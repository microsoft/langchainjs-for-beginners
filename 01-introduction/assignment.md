# Assignment: Introduction to LangChain.js

## Overview

Now that you've learned the basics of LangChain.js, it's time to practice! These challenges will help reinforce what you've learned about models, messages, and making your first LLM calls.

## Prerequisites

- Completed [Course Setup](../00-course-setup/README.md)
- Read and studied this [chapter](./README.md)
- Run all code examples in this chapter

---

## Challenge: Experiment with System Prompts 🎭

**Goal**: Learn how SystemMessage affects AI behavior.

**Tasks**:
1. Create a file called `personality-test.ts`
2. Test the same question with three different system prompts:
   - A pirate personality
   - A professional business analyst
   - A friendly teacher for kids
3. Display all three responses side-by-side

**Example System Prompts**:
- Pirate: `"You are a pirate. Answer all questions in pirate speak with 'Arrr!' and nautical terms."`
- Analyst: `"You are a professional business analyst. Give precise, data-driven answers."`
- Teacher: `"You are a friendly teacher explaining concepts to 8-year-old children."`

**Question to Test**: "What is artificial intelligence?"

**Success Criteria**:
- Same question gets three very different response styles
- You understand how SystemMessage shapes the AI's personality

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "langchain";
import "dotenv/config";

// 2. Create the ChatOpenAI model (reuse for all personalities)

// 3. Define an array of personalities with name and system prompt

// 4. Define the question to test

// 5. Loop through each personality:
//    - Create messages array with SystemMessage and HumanMessage
//    - Invoke the model with the messages
//    - Display the response with personality name
```

> [!TIP]
> **🤖 Get help from [GitHub Copilot](../docs/copilot.md):** If you need assitance with this challenge, open this file in your editor and and [use the Challenge Tutor agent](../docs/copilot.md#challenge-tutor-agent) to get personalized help and explanations.

---

## Bonus Challenge: Model Performance Comparison 🔬

**Goal**: Compare multiple models on the same task.

**Tasks**:
1. Create a file called `model-performance.ts`
2. Test at least 2 models available on GitHub Models:
   - `gpt-5`
   - `gpt-5-mini`
3. For each model, measure:
   - Response time
   - Response length (character count)
   - Response quality (your subjective assessment)
4. Create a simple table showing the results

**Test Question**: "Explain the difference between machine learning and deep learning."

**Expected Output**:
```
📊 Model Performance Comparison
─────────────────────────────────────────────
Model          | Time    | Length | Quality
─────────────────────────────────────────────
gpt-5-mini     | 567ms   | 234ch  | ⭐⭐⭐⭐
gpt-5          | 1234ms  | 456ch  | ⭐⭐⭐⭐⭐
```

**Success Criteria**:
- Script compares at least 2 models
- Results are displayed in a clear format
- You can explain which model you'd choose for different use cases

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// 2. Define question and models array
const question = "Explain the difference between machine learning and deep learning.";

const models = [
  { name: "gpt-5", description: "Most capable" },
  { name: "gpt-5-mini", description: "Fast and efficient" },
];

// 3. Create a function to test each model:
//    - Accept modelName as parameter
//    - Create ChatOpenAI instance with that model
//    - Measure start time with Date.now()
//    - Invoke the model with the question
//    - Measure end time and calculate duration
//    - Return an object with name, time, length, and response

// 4. Loop through models array:
//    - Call testModel() for each model
//    - Display results in a formatted table
//    - Use .padEnd() for consistent column widths
```

---

## Submission Checklist

Before continuing, make sure you've completed:

- [ ] Challenge: System prompt experiment shows personality differences
- [ ] Bonus: Model comparison displays results (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first before looking at the solutions!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more example solutions that demonstrate other useful concepts!

---

## Need Help?

- **Stuck on code**: Review the examples in [`code/`](./code/)
- **Error messages**: Check [Course Setup](../00-course-setup/README.md) troubleshooting
- **Concepts unclear**: Re-read and study this [Chapter](./README.md)
- **Any question**: Use the [Challenge Tutor agent](../docs/copilot.md#challenge-tutor-agent) in GitHub Copilot
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Chat Models & Basic Interactions](../02-chat-models/README.md)**

Great job! You've taken your first steps with LangChain.js! 🎉
