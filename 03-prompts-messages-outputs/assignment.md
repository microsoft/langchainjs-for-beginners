# Assignment: Prompts, Messages, and Structured Outputs

## Overview

Practice creating reusable, maintainable prompts using templates, few-shot learning, and structured output techniques. This assignment focuses on **templates and structured outputs** (Parts 2 and 3 of the chapter).

## Prerequisites

- Completed this [chapter](./README.md)
- Run all code examples (including structured outputs examples) in this chapter
- Understand template syntax and composition

---

## Challenge: Few-Shot Format Teacher 🎓

**Goal**: Use few-shot prompting to teach the AI a custom output format.

**Tasks**:
1. Create `format-teacher.ts`
2. Teach the AI to convert product descriptions into a specific JSON format:
   ```json
   {
     "name": "Product name",
     "price": "$XX.XX",
     "category": "Category",
     "highlight": "Key feature"
   }
   ```
3. Provide 3-4 example conversions
4. Test with new product descriptions
5. Parse and validate the JSON output

**Teaching Examples** (provide these as few-shot examples):
- Input: "Premium wireless headphones with noise cancellation, $199"
- Input: "Organic cotton t-shirt in blue, comfortable fit, $29.99"
- Input: "Gaming laptop with RTX 4070, 32GB RAM, $1,499"

**Success Criteria**:
- AI consistently outputs valid JSON
- Format matches your examples
- Works with various product descriptions

**Hints**:
```typescript
// 1. Import required modules
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

// 2. Create model with temperature 0 for consistent formatting

// 3. Define your teaching examples array with input/output pairs
//    - Each example should show a product description as input
//    - And the corresponding JSON format as output

// 4. Create an example template using ChatPromptTemplate.fromMessages
//    with ["human", "{input}"] and ["ai", "{output}"]

// 5. Create a FewShotChatMessagePromptTemplate with your examples

// 6. Build a final prompt that includes the few-shot template

// 7. Test with new product descriptions and parse the JSON output
```

> [!TIP]
> **🤖 Get help from [GitHub Copilot](../docs/copilot.md):** If you need assitance with this challenge, open this file in your editor and and [use the Challenge Tutor agent](../docs/copilot.md#challenge-tutor-agent) to get personalized help and explanations.

---

## Bonus Challenge: Product Data Extractor with Structured Outputs 🏷️

**Goal**: Build a system that extracts product information into validated, typed data structures.

**Tasks**:
1. Create `product-extractor.ts`
2. Define a Zod schema for product information:
   ```typescript
   {
     name: string,
     price: number,
     category: string (enum: Electronics, Clothing, Food, Books, Home),
     inStock: boolean,
     rating: number (1-5),
     features: string[]
   }
   ```
3. Use `withStructuredOutput()` to extract product data
4. Test with product descriptions in various formats:
   - Formal product listings
   - Casual marketplace descriptions
   - Mixed content (reviews + specifications)
5. Validate that all outputs match your schema
6. Handle edge cases (missing information)

**Example Inputs**:
- "MacBook Pro 16-inch with M3 chip, $2,499. Currently in stock. Users rate it 4.8/5. Features: Liquid Retina display, 18-hour battery, 1TB SSD"
- "Cozy wool sweater, blue color, medium size. $89, available now! Customers love it - 4.5 stars. Hand-washable, made in Ireland"
- "The Great Gatsby by F. Scott Fitzgerald. Classic novel, paperback edition for $12.99. In stock. Rated 4.9 stars. 180 pages, published 1925"

**Success Criteria**:
- All outputs are properly typed
- Schema validation works correctly
- Handles various input formats
- Correctly categorizes products
- Gracefully handles missing data

**Hints**:
```typescript
// 1. Import required modules
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import "dotenv/config";

// 2. Create the ChatOpenAI model

// 3. Define a Zod schema with all required fields:
//    - name (string)
//    - price (number)
//    - category (enum with 5 categories)
//    - inStock (boolean)
//    - rating (number, 1-5)
//    - features (array of strings)
//    Use .describe() to add descriptions for each field

// 4. Create a structured output model using model.withStructuredOutput()

// 5. Create a prompt template asking to extract product information

// 6. Create a chain by piping template.pipe(structuredModel)

// 7. Test with various product descriptions and handle edge cases
```

---

## Submission Checklist

Before continuing, make sure you've completed:

- [ ] Challenge: Few-shot format teacher with JSON output
- [ ] Bonus: Product data extractor with structured outputs (optional)

---

## Solutions

Solutions for all challenges are available in the [`solution/`](./solution/) folder. Try to complete the challenges on your own first!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more examples including email generation, translation systems, dynamic prompt builders, and template libraries!

> **💡 Note**: This assignment focuses on templates (Part 2 of this chapter). For message-based patterns (Part 1), practice building agents later in the course!

---

## Need Help?

- **Template syntax**: Review examples in [`code/`](./code/)
- **Few-shot issues**: Check Example 5 ([`code/05-few-shot.ts`](./code/05-few-shot.ts))
- **Composition**: Review Example 6 ([`code/06-composition.ts`](./code/06-composition.ts))
- **Any question**: Use the [Challenge Tutor agent](../docs/copilot.md#challenge-tutor-agent) in GitHub Copilot
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Once you've completed these challenges, you're ready for:

**[Function Calling & Tools](../04-function-calling-tools/README.md)**

Excellent progress! You're mastering prompt engineering! 🚀
