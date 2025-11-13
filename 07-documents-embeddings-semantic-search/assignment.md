# Assignment: Documents, Embeddings & Semantic Search

## Overview

Practice creating embeddings, building vector stores, and performing semantic searches to understand how AI finds meaning in text.

## Prerequisites

- Completed this [chapter](./README.md)
- Run all code examples in the chapter
- Understand embeddings and similarity metrics
- Completed the Agents & MCP chapter

---

## Challenge: Similarity Explorer 🔬

**Goal**: Discover how embeddings capture semantic similarity.

**Tasks**:
1. Create `similarity-explorer.ts` in the `07-documents-embeddings-semantic-search/solution/` folder
2. Create embeddings for these 10 sentences:
   ```
   - "I love programming in JavaScript"
   - "JavaScript is my favorite language"
   - "Python is great for data science"
   - "Machine learning uses Python often"
   - "I enjoy coding web applications"
   - "Dogs are loyal pets"
   - "Cats are independent animals"
   - "Pets bring joy to families"
   - "The weather is sunny today"
   - "It's raining outside"
   ```
3. Compare all pairs and find:
   - Most similar pair
   - Least similar pair
   - All pairs with similarity > 0.8
4. Display results with scores

**Success Criteria**:
- Correctly calculates similarity for all pairs
- Identifies semantic relationships (e.g., programming pairs cluster)
- Clear formatted output with scores

**Hints**:
```typescript
// 1. Import required modules
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

// 2. Create an OpenAIEmbeddings instance with environment variables

// 3. Define your array of 10 sentences

// 4. Generate embeddings for all sentences using embeddings.embedDocuments()

// 5. Create a function to calculate cosine similarity between two vectors
//    Formula: dot product / (magnitude of A × magnitude of B)

// 6. Use nested loops to compare all pairs (avoid comparing same sentence)

// 7. Track the most similar, least similar, and pairs > 0.8

// 8. Display results with formatted scores
```

> [!TIP]
> **🤖 Get help from [GitHub Copilot](../docs/copilot.md):** If you need assitance with this challenge, open this file in your editor and and [use the Challenge Tutor agent](../docs/copilot.md#challenge-tutor-agent) to get personalized help and explanations.

---

## Bonus Challenge: Semantic Book Search 📚

**Goal**: Build a book recommendation system using semantic search.

**Tasks**:
1. Create `book-search.ts`
2. Create a vector store with these book summaries:
   ```typescript
   const books = [
     { title: "The AI Revolution", summary: "How artificial intelligence is transforming society and business" },
     { title: "JavaScript Mastery", summary: "Complete guide to modern web development with JavaScript" },
     { title: "Data Science Handbook", summary: "Statistical analysis and machine learning for beginners" },
     { title: "The Startup Playbook", summary: "Building and scaling technology companies from scratch" },
     { title: "Mystery at Midnight", summary: "A detective solves crimes in Victorian London" },
     { title: "Space Odyssey", summary: "Humans explore distant galaxies and alien civilizations" },
     { title: "Cooking Basics", summary: "Essential techniques for home chefs and food enthusiasts" },
     { title: "Python for Data", summary: "Using Python for data analysis and visualization" },
   ];
   ```
3. Implement search queries:
   - "books about programming"
   - "stories set in space"
   - "learning about AI and technology"
   - "cooking and recipes"
4. Return top 3 results with scores for each query

**Success Criteria**:
- Finds relevant books semantically (not just keywords)
- Returns appropriate number of results
- Shows similarity scores
- Works for varied query types

**Hints**:
```typescript
// 1. Import required modules
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import "dotenv/config";

// 2. Create an OpenAIEmbeddings instance

// 3. Define your books array with title and summary properties

// 4. Convert books to Document objects using .map()
//    - pageContent should be the summary
//    - metadata should include the title

// 5. Create a MemoryVectorStore using MemoryVectorStore.fromDocuments()

// 6. For each test query, use vectorStore.similaritySearchWithScore()
//    to get top 3 results with scores

// 7. Display results showing title and similarity score
```

---

## Submission Checklist

Before moving to the next chapter:

- [ ] Challenge: Similarity explorer compares all pairs
- [ ] Bonus: Book search system works (optional)

---

## Solutions

Solutions available in [`solution/`](./solution/) folder. Try on your own first!

**Additional Examples**: Check out the [`samples/`](./samples/) folder for more examples including keyword vs semantic comparison, multilingual search, embedding visualization, chunking strategies, document organization, and web processing!

---

## Need Help?

- **Embeddings**: Review examples in [`code/`](./code/)
- **Similarity metrics**: Check cosine similarity in example 1
- **Vector stores**: See example 2
- **Any question**: Use the [Challenge Tutor agent](../docs/copilot.md#challenge-tutor-agent) in GitHub Copilot
- **Still stuck**: Join our [Discord community](https://aka.ms/foundry/discord)

---

## Next Steps

Now you're ready to combine everything you've learned - agents, tools, and retrieval!

**[Building Agentic RAG Systems](../08-agentic-rag-systems/README.md)**

In the final chapter, you'll build intelligent systems where agents autonomously decide when to search your documents to answer questions!

Great work on understanding embeddings and semantic search! 🚀
