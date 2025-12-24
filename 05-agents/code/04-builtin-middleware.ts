import {
  createAgent,
  createMiddleware,
  summarizationMiddleware,
  HumanMessage,
  SystemMessage,
  tool,
} from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod";
import "dotenv/config";

/**
 * Example 4: Built-in Middleware - summarizationMiddleware
 *
 * Demonstrates how summarizationMiddleware automatically summarizes
 * long conversations to stay within context limits and reduce token costs.
 *
 * Configuration:
 * - trigger: [{ tokens: N }, { messages: M }] - OR logic (either triggers)
 * - trigger: { tokens: N, messages: M } - AND logic (both required)
 * - keep: { messages: N } - Messages to preserve after summarization
 *
 * Run: npx tsx 05-agents/code/04-builtin-middleware.ts
 */

// Simulated knowledge base - provides verbose responses to trigger summarization
const knowledgeBase: Record<string, string> = {
  superposition: `Superposition means a quantum system can exist in multiple states simultaneously until measured. Like Schrödinger's cat being both alive and dead until observed. This principle enables qubits to represent 0 and 1 at the same time, making quantum computing powerful.`,

  entanglement: `Entanglement occurs when particles become correlated so measuring one instantly affects the other, regardless of distance. Einstein called it "spooky action at a distance." It's essential for quantum cryptography and quantum computing algorithms.`,

  tunneling: `Quantum tunneling lets particles pass through barriers they classically couldn't overcome. It's why the sun shines (fusion), how electron microscopes work, and a challenge in chip design as transistors shrink.`,
};

// Research tool that returns detailed explanations
const researchTool = tool(
  async (input) => {
    const topic = input.topic.toLowerCase();
    const match = Object.keys(knowledgeBase).find((key) => topic.includes(key));
    return match
      ? knowledgeBase[match]
      : `Quantum mechanics describes matter and energy at atomic scales, featuring superposition, entanglement, and tunneling - concepts that defy classical intuition.`;
  },
  {
    name: "research",
    description: "Get explanations about quantum mechanics topics",
    schema: z.object({
      topic: z.string().describe("The topic to research"),
    }),
  }
);

async function main() {
  console.log("📚 Built-in Middleware: summarizationMiddleware Demo\n");
  console.log("Shows how conversations are automatically condensed.\n");

  const model = new ChatOpenAI({
    model: process.env.AI_MODEL,
    configuration: { baseURL: process.env.AI_ENDPOINT },
    apiKey: process.env.AI_API_KEY,
  });

  // State tracking
  const state = {
    maxMessageCount: 0,
    currentMessageCount: 0,
    currentTokens: 0,
    summaryContent: null as string | null,
  };

  // Simple logging middleware - detects summarization when message count drops below max
  const logger = createMiddleware({
    name: "Logger",
    wrapModelCall: (request, handler) => {
      state.currentMessageCount = request.messages.length;
      state.currentTokens = request.messages.reduce((sum, msg) => {
        const content = typeof msg.content === "string" ? msg.content : "";
        return sum + Math.ceil(content.length / 4);
      }, 0);

      // Summarization detected when message count is less than max seen
      if (state.maxMessageCount > 0 && state.currentMessageCount < state.maxMessageCount) {
        const firstMsg = request.messages[0];
        state.summaryContent =
          firstMsg && typeof firstMsg.content === "string" ? firstMsg.content : null;
      } else {
        state.summaryContent = null;
      }

      // Track maximum message count
      if (state.currentMessageCount > state.maxMessageCount) {
        state.maxMessageCount = state.currentMessageCount;
      }

      return handler(request);
    },
  });

  const agent = createAgent({
    model,
    tools: [researchTool],
    middleware: [
      summarizationMiddleware({
        model,
        trigger: { tokens: 200, messages: 4 }, // AND: both conditions must be met
        keep: { messages: 2 },
      }),
      logger,
    ],
  });

  const questions = [
    "What is quantum superposition?",
    "How does entanglement work?",
    "Explain quantum tunneling",
    "What are some practical applications?",
    "How do superposition and entanglement connect?",
    "What role does tunneling play in electronics?",
    "Summarize the key concepts we discussed",
  ];

  console.log("─".repeat(70));

  // System message to encourage tool usage for detailed responses
  const systemMessage = new SystemMessage(
    "You are a quantum physics research assistant. Always use the research tool to provide accurate, detailed explanations. Keep your final responses concise."
  );
  const messages: (SystemMessage | HumanMessage)[] = [systemMessage];

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log(`\n📝 Question ${i + 1}/${questions.length}`);
    console.log(`👤 User: ${question}\n`);

    messages.push(new HumanMessage(question));
    const response = await agent.invoke({ messages: [...messages] });

    // Log state
    console.log(`  [State] 📊 Messages: ${state.currentMessageCount} | Tokens: ~${state.currentTokens}`);

    // Show summary box when summarization occurred
    if (state.summaryContent) {
      console.log(`  [State] 🔄 Summarization occurred! Condensed context:`);
      console.log(`  ┌${"─".repeat(66)}┐`);
      const summary = state.summaryContent;
      const lines = summary.substring(0, 400).split("\n").slice(0, 6);
      lines.forEach((line: string) => {
        console.log(`  │ ${line.substring(0, 64).padEnd(64)} │`);
      });
      console.log(`  └${"─".repeat(66)}┘`);
    }

    // Max is updated in middleware, no need to update here

    // Show response (truncated)
    const lastMessage = response.messages[response.messages.length - 1];
    const content = String(lastMessage.content);
    const display = content.length > 250 ? content.substring(0, 250) + "..." : content;
    console.log(`\n🤖 Assistant: ${display}`);
    console.log("\n" + "─".repeat(70));

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("\n💡 Key Takeaways:");
  console.log("   • summarizationMiddleware automatically condenses long conversations");
  console.log("   • Configure with trigger (when) and keep (how much to preserve)");
  console.log("   • Reduces token usage while maintaining context");
}

main().catch(console.error);
