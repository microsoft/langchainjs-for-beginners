/**
 * Complex Structured Data with Zod Schemas
 * Run: npx tsx 03-prompts-messages-outputs/code/08-zod-schemas.ts
 *
 * 🤖 Try asking GitHub Copilot Chat (https://github.com/features/copilot):
 * - "How do I add validation constraints like min/max to Zod schema fields?"
 * - "How would I handle arrays of nested objects in a schema?"
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as z from "zod";
import "dotenv/config";

async function main() {
  console.log("🏢 Complex Structured Output Example\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  // Define a complex nested schema
  const CompanySchema = z.object({
    name: z.string().describe("Company name"),
    founded: z.number().describe("Year the company was founded"),
    headquarters: z
      .object({
        city: z.string(),
        country: z.string(),
      })
      .describe("Company headquarters location"),
    products: z.array(z.string()).describe("List of main products or services"),
    employeeCount: z.number().describe("Approximate number of employees"),
    isPublic: z.boolean().describe("Whether the company is publicly traded"),
  });

  // Create structured model with strict mode for reliable schema compliance
  const structuredModel = model.withStructuredOutput(CompanySchema, {
    strict: true,
  });

  // Create a prompt template
  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Extract company information from the text. If information is not available, make reasonable estimates based on common knowledge.",
    ],
    ["human", "{text}"],
  ]);

  // Combine template with structured output
  const chain = template.pipe(structuredModel);

  console.log("🧪 Extracting data from company descriptions:\n");
  console.log("=".repeat(80));

  // Test 1: Microsoft
  console.log("\n1️⃣  Microsoft:\n");
  const companyInfo1 = `
    Microsoft was founded in 1975 and is headquartered in Redmond, Washington.
    The company is publicly traded and has over 220,000 employees worldwide.
    Their main products include Windows, Office, Azure, and Xbox.
  `;

  const result1 = await chain.invoke({ text: companyInfo1 });

  console.log("✅ Extracted Company Data:");
  console.log(JSON.stringify(result1, null, 2));
  console.log("\n📊 Type-safe access:");
  console.log(`   ${result1.name} (${result1.isPublic ? "Public" : "Private"})`);
  console.log(`   Founded: ${result1.founded}`);
  console.log(`   Location: ${result1.headquarters.city}, ${result1.headquarters.country}`);
  console.log(`   Products: ${result1.products.join(", ")}`);
  console.log(`   Employees: ${result1.employeeCount.toLocaleString()}`);

  // Test 2: SpaceX
  console.log("\n" + "=".repeat(80));
  console.log("\n2️⃣  SpaceX:\n");
  const companyInfo2 = `
    SpaceX, based in Hawthorne, California, was established in 2002.
    The company focuses on spacecraft, rockets, and satellite internet (Starlink).
    They employ around 13,000 people and remain privately held.
  `;

  const result2 = await chain.invoke({ text: companyInfo2 });

  console.log("✅ Extracted Company Data:");
  console.log(JSON.stringify(result2, null, 2));

  // Test 3: Netflix
  console.log("\n" + "=".repeat(80));
  console.log("\n3️⃣  Netflix:\n");
  const companyInfo3 = `
    Netflix started in 1997 in Los Gatos, California.
    It's a publicly traded streaming service with about 12,800 employees.
    Main offerings include streaming video, original content, and DVD rentals (discontinued).
  `;

  const result3 = await chain.invoke({ text: companyInfo3 });

  console.log("✅ Extracted Company Data:");
  console.log(JSON.stringify(result3, null, 2));

  console.log("\n" + "=".repeat(80));
  console.log("\n💡 Complex Schema Features:");
  console.log("   - ✅ Nested objects (headquarters with city/country)");
  console.log("   - ✅ Arrays (products list)");
  console.log("   - ✅ Multiple data types (strings, numbers, booleans)");
  console.log("   - ✅ Validation (ensures correct types)");
  console.log("   - ✅ Descriptions guide the AI's extraction");
  console.log("\n🎯 Use Cases:");
  console.log("   - Data extraction from documents");
  console.log("   - Form filling from natural language");
  console.log("   - Structured database inserts");
  console.log("   - API response formatting");
  console.log("   - Classification with predefined categories");
}

main().catch(console.error);
