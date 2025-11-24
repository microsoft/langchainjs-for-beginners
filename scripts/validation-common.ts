/**
 * Shared validation utilities for code example testing
 *
 * This module contains common configuration and functions used by both
 * the sequential and parallel validation scripts.
 */

import { spawn } from "child_process";
import { readdir } from "fs/promises";
import { join } from "path";

export interface TestResult {
  file: string;
  success: boolean;
  duration: number;
  error?: string;
}

// Files that require user input - test with automated input
export const INTERACTIVE_FILES = [
  { file: "chatbot.ts", input: "Hello\n" },
  { file: "streaming-chat.ts", input: "Hello\n" },
  { file: "qa-program.ts", input: "What is 2+2?\n" },
  { file: "03-human-in-loop.ts", input: "yes\nno\nno\n" },
  { file: "conversational-rag.ts", input: "What is TypeScript?\n" },
];

// Files that are servers - start them, verify they run, then kill them
export const SERVER_FILES = [
  {
    file: "basic-mcp-server.ts",
    successIndicator: "🚀 MCP Calculator Server", // Text to look for in stdout
    waitTime: 3000, // Wait 3 seconds after seeing success indicator
  },
  {
    file: "mcp-rag-server.ts",
    successIndicator: "✅ MCP Server initialized and ready for connections", // Text to look for in stdout
    waitTime: 3000, // Wait 3 seconds after seeing success indicator
  },
  {
    file: "stdio-calculator-server.ts",
    successIndicator: "📟 stdio MCP Calculator Server running", // Text to look for in stderr
    waitTime: 2000, // Wait 2 seconds after seeing success indicator
  },
];

// Files to skip during validation
// These files are correct but may fail with certain model providers due to API limitations
export const SKIP_FILES = [
  {
    file: "temperature-lab.ts",
    reason: "Uses temperature=0 which is not supported by all model providers (e.g., GitHub Models)",
  },
];

// Timeout for all examples (generous to handle API calls and complex examples)
// Set to 2 minutes to accommodate files with multiple sequential AI calls
// (e.g., email-generator.ts and prompt-builder.ts which make 3-4 AI calls each)
export const TIMEOUT_MS = 120000; // 120 seconds (2 minutes)

/**
 * Recursively find all TypeScript files in a directory
 */
export async function findCodeFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        files.push(...(await findCodeFiles(fullPath)));
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        // Skip the validate script itself
        if (!entry.name.includes("validate-examples")) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
    // Silently skip instead of warning
  }

  return files;
}

/**
 * Get automated input for interactive files
 */
export function getInteractiveInput(filePath: string): string | undefined {
  const config = INTERACTIVE_FILES.find((item) => filePath.includes(item.file));
  return config?.input;
}

/**
 * Get server configuration for server files
 */
export function getServerConfig(filePath: string) {
  return SERVER_FILES.find((item) => filePath.includes(item.file));
}

/**
 * Check if a file should be skipped during validation
 */
export function shouldSkipFile(filePath: string): boolean {
  return SKIP_FILES.some((item) => filePath.includes(item.file));
}

/**
 * Get skip reason for a file
 */
export function getSkipReason(filePath: string): string | undefined {
  const config = SKIP_FILES.find((item) => filePath.includes(item.file));
  return config?.reason;
}

/**
 * Run a server example: start it, verify it runs, then stop it
 */
export function runServerExample(
  filePath: string,
  config: { successIndicator: string; waitTime: number }
): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const child = spawn("npx", ["tsx", filePath], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, CI: "true" },
    });

    let stdout = "";
    let stderr = "";
    let serverStarted = false;
    let timeoutHandle: NodeJS.Timeout;

    // Set timeout for server startup
    timeoutHandle = setTimeout(() => {
      child.kill();
      resolve({
        file: filePath,
        success: false,
        duration: Date.now() - startTime,
        error: `Server did not start within ${TIMEOUT_MS}ms`,
      });
    }, TIMEOUT_MS);

    child.stdout.on("data", (data) => {
      stdout += data.toString();

      // Check if server started successfully
      if (!serverStarted && stdout.includes(config.successIndicator)) {
        serverStarted = true;

        // Wait a bit to ensure server is stable, then kill it
        setTimeout(() => {
          clearTimeout(timeoutHandle);
          child.kill();

          resolve({
            file: filePath,
            success: true,
            duration: Date.now() - startTime,
          });
        }, config.waitTime);
      }
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();

      // Also check stderr for success indicator (stdio servers log to stderr)
      if (!serverStarted && stderr.includes(config.successIndicator)) {
        serverStarted = true;

        // Wait a bit to ensure server is stable, then kill it
        setTimeout(() => {
          clearTimeout(timeoutHandle);
          child.kill();

          resolve({
            file: filePath,
            success: true,
            duration: Date.now() - startTime,
          });
        }, config.waitTime);
      }
    });

    child.on("error", (error) => {
      clearTimeout(timeoutHandle);
      child.kill();
      resolve({
        file: filePath,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      });
    });
  });
}

/**
 * Run a regular code example
 */
export function runExample(filePath: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const interactiveInput = getInteractiveInput(filePath);

    const child = spawn("npx", ["tsx", filePath], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, CI: "true" },
    });

    let stdout = "";
    let stderr = "";
    let timeoutHandle: NodeJS.Timeout;

    // Provide automated input for interactive files
    if (interactiveInput) {
      child.stdin.write(interactiveInput);
      child.stdin.end();
    }

    // Set timeout
    timeoutHandle = setTimeout(() => {
      child.kill();
      resolve({
        file: filePath,
        success: false,
        duration: Date.now() - startTime,
        error: `Timeout after ${TIMEOUT_MS}ms`,
      });
    }, TIMEOUT_MS);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeoutHandle);
      const duration = Date.now() - startTime;

      // Check for error indicators in stderr even if exit code is 0
      const hasError =
        stderr &&
        (stderr.includes("Error:") ||
          stderr.includes("Error\n") ||
          stderr.includes("at ") || // Stack trace indicator
          stderr.toLowerCase().includes("exception"));

      if (code === 0 && !hasError) {
        resolve({
          file: filePath,
          success: true,
          duration,
        });
      } else {
        resolve({
          file: filePath,
          success: false,
          duration,
          error: hasError ? stderr : stderr || `Exit code: ${code}`,
        });
      }
    });

    child.on("error", (error) => {
      clearTimeout(timeoutHandle);
      resolve({
        file: filePath,
        success: false,
        duration: Date.now() - startTime,
        error: error.message,
      });
    });
  });
}

/**
 * Find all chapter directories (e.g., 00-*, 01-*, etc.)
 */
export async function findChapters(projectRoot: string): Promise<string[]> {
  const entries = await readdir(projectRoot, { withFileTypes: true });
  // Match directories starting with 2 digits followed by "-"
  const chapterPattern = /^\d{2}-/;

  return entries
    .filter((entry) => entry.isDirectory() && chapterPattern.test(entry.name))
    .map((entry) => entry.name)
    .sort(); // Ensure chapters are in numerical order
}

/**
 * Collect all code files from chapters (code, solution, samples folders)
 */
export async function collectAllCodeFiles(
  projectRoot: string,
  chapters: string[]
): Promise<string[]> {
  const allFiles: string[] = [];

  for (const chapter of chapters) {
    // Check code folder
    const codePath = join(projectRoot, chapter, "code");
    const codeFiles = await findCodeFiles(codePath);
    allFiles.push(...codeFiles);

    // Check solution folder
    const solutionPath = join(projectRoot, chapter, "solution");
    const solutionFiles = await findCodeFiles(solutionPath);
    allFiles.push(...solutionFiles);

    // Check samples folder
    const samplesPath = join(projectRoot, chapter, "samples");
    const samplesFiles = await findCodeFiles(samplesPath);
    allFiles.push(...samplesFiles);
  }

  // Filter out files that should be skipped
  return allFiles.filter((file) => !shouldSkipFile(file));
}

/**
 * Display summary of files to be tested
 */
export function displayTestSummary(allFiles: string[]): void {
  console.log(`📁 Found ${allFiles.length} code files to test\n`);

  // Show skipped files count
  const skippedCount = SKIP_FILES.length;
  if (skippedCount > 0) {
    console.log(`⏭️  ${skippedCount} files skipped (model limitations):`);
    SKIP_FILES.forEach((skip) => {
      console.log(`   • ${skip.file}: ${skip.reason}`);
    });
    console.log();
  }

  // Identify interactive files
  const interactiveCount = allFiles.filter((file) => getInteractiveInput(file)).length;
  if (interactiveCount > 0) {
    console.log(`🤖 ${interactiveCount} interactive files will be tested with automated input\n`);
  }

  // Identify server files
  const serverCount = allFiles.filter((file) => getServerConfig(file)).length;
  if (serverCount > 0) {
    console.log(`🌐 ${serverCount} server files will be started, verified, then stopped\n`);
  }
}

/**
 * Display final test results
 */
export function displayFinalResults(
  results: TestResult[],
  totalFiles: number,
  projectRoot: string,
  totalDuration?: number
): void {
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log("\n" + "=" + "=".repeat(79) + "\n");
  console.log("📊 Test Results:\n");
  console.log(`   Total:    ${totalFiles}`);
  console.log(`   Passed:   ${passed} ✅`);
  console.log(`   Failed:   ${failed} ❌`);

  const successRate = ((passed / totalFiles) * 100).toFixed(1);
  console.log(`   Success:  ${successRate}%`);

  if (totalDuration !== undefined) {
    console.log(`   Duration: ${(totalDuration / 1000).toFixed(1)}s (${(totalDuration / 60000).toFixed(1)} minutes)`);
  }

  if (failed > 0) {
    console.log("\n" + "=" + "=".repeat(79) + "\n");
    console.log("❌ Failed Examples:\n");

    results
      .filter((r) => !r.success)
      .forEach((result) => {
        const relativePath = result.file.replace(projectRoot + "/", "");
        console.log(`   ${relativePath}`);
        if (result.error) {
          console.log(`   → ${result.error.split("\n").slice(0, 3).join("\n   ")}`);
        }
        console.log();
      });
  }

  console.log("=" + "=".repeat(79) + "\n");
}
