import { createAgent, createMiddleware, HumanMessage, tool, ToolMessage } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import { evaluate } from "mathjs";
import * as z from "zod";
import "dotenv/config";

/**
 * Example 3: createAgent() with Middleware
 *
 * Middleware allows you to intercept and modify agent behavior.
 * This example shows two powerful middleware patterns:
 *
 * 1. Dynamic Model Selection - Switch models based on conversation complexity
 * 2. Custom Error Handling - Gracefully handle tool failures
 *
 * Use middleware for:
 * - Logging and monitoring
 * - Cost optimization (cheaper models for simple tasks)
 * - Error recovery
 * - Request/response transformation
 */

// Define tools
const calculatorTool = tool(
  async (input) => {
    // Use mathjs for safe mathematical evaluation
    const result = evaluate(input.expression);
    return `The result is: ${result}`;
  },
  {
    name: "calculator",
    description: "Perform mathematical calculations",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate"),
    }),
  },
);

const searchTool = tool(
  async (input) => {
    // Simulate occasional failures for demonstration
    if (input.query.toLowerCase().includes("error")) {
      throw new Error("Search service temporarily unavailable");
    }

    return `Search results for "${input.query}": Found relevant information about ${input.query}.`;
  },
  {
    name: "search",
    description: "Search for information",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  },
);

async function main() {
  console.log("🔧 Agent with Middleware Example\n");

  // Create two models: basic (cheaper) and capable (more powerful)
  const basicModel = new ChatOpenAI({
    model: process.env.AI_MODEL, // e.g., gpt-5-mini
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  const capableModel = new ChatOpenAI({
    model: process.env.AI_MODEL, // In production, use a more capable model
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
    temperature: 0.1, // More precise for complex tasks
  });

  // Middleware 1: Dynamic Model Selection
  // Switches to more capable model for long conversations
  const dynamicModelSelection = createMiddleware({
    name: "DynamicModelSelection",
    wrapModelCall: (request, handler) => {
      const messageCount = request.messages.length;
      console.log(`  [Middleware] Message count: ${messageCount}`);

      // Use more capable model for complex conversations (>10 messages)
      if (messageCount > 10) {
        console.log(`  [Middleware] 🔄 Switching to more capable model\n`);
        return handler({
          ...request,
          model: capableModel,
        });
      }

      console.log(`  [Middleware] ✓ Using basic model\n`);
      return handler(request);
    },
  });

  // Middleware 2: Custom Error Handling
  // Catches tool failures and provides helpful fallback messages
  const toolErrorHandler = createMiddleware({
    name: "ToolErrorHandler",
    wrapToolCall: async (request, handler) => {
      try {
        return await handler(request);
      } catch (error: any) {
        console.error(`  [Middleware] ⚠️  Tool "${request.tool?.name}" failed: ${error.message}`);
        console.log(`  [Middleware] 🔄 Returning fallback message\n`);
        // Return graceful fallback as a ToolMessage
        return new ToolMessage({
          content: `I encountered an error while using the ${request.tool?.name} tool: ${error.message}. Let me try a different approach to answer your question.`,
          tool_call_id: request.toolCall.id || "",
        });
      }
    },
  });

  // Create agent with both middleware
  const agent = createAgent({
    model: basicModel,
    tools: [calculatorTool, searchTool],
    middleware: [dynamicModelSelection, toolErrorHandler],
  });

  // Test 1: Simple calculation with dynamic model selection
  console.log("Test 1: Simple calculation");
  console.log("─".repeat(60));
  const query1 = "What is 25 * 8?";
  console.log(`👤 User: ${query1}\n`);
  const response1 = await agent.invoke({ messages: [new HumanMessage(query1)] });
  const lastMessage1 = response1.messages[response1.messages.length - 1];
  console.log(`🤖 Agent: ${lastMessage1.content}\n\n`);

  // Test 2: Search with error handling
  console.log("Test 2: Search with error handling");
  console.log("─".repeat(60));
  const query2 = "Search for information about error handling";
  console.log(`👤 User: ${query2}\n`);
  const response2 = await agent.invoke({ messages: [new HumanMessage(query2)] });
  const lastMessage2 = response2.messages[response2.messages.length - 1];
  console.log(`🤖 Agent: ${lastMessage2.content}\n\n`);

  console.log("💡 Middleware Benefits:");
  console.log("   • Dynamic model selection → Cost optimization");
  console.log("   • Error handling → Graceful degradation");
  console.log("   • Logging → Easy debugging");
  console.log("   • Flexibility → Customize behavior without changing tools\n");

  console.log("✅ Production Use Cases:");
  console.log("   • Switch to cheaper models for simple queries");
  console.log("   • Automatic retries with exponential backoff");
  console.log("   • Request/response logging for monitoring");
  console.log("   • User context injection (auth, permissions)");
  console.log("   • Rate limiting and quota management");
}

main().catch(console.error);
