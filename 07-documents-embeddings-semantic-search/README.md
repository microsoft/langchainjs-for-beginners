# Documents, Embeddings & Semantic Search

In this chapter, you'll learn the complete pipeline for working with documents in AI applications — from loading and preparing documents to enabling intelligent semantic search. You'll discover how to load content from various sources, split it into manageable chunks, convert text into numerical embeddings, and perform similarity searches that understand meaning rather than just matching keywords.

**Why learn this after agents?** You've already built agents that can use tools to solve problems. Now you'll learn how to create **retrieval tools** that give agents the power to search through your documents intelligently. This combination—agents with retrieval capabilities—enables **agentic RAG systems** where AI autonomously decides when and how to search your knowledge base to answer questions. You'll build this powerful pattern in [Building Agentic RAG Systems](../08-agentic-rag-systems/README.md).

## Prerequisites

- Completed [Getting Started with Agents](../05-agents/README.md)

## 🎯 Learning Objectives

By the end of this chapter, you'll be able to:

- ✅ Load documents from various sources (text, PDF, web)
- ✅ Split long documents into manageable chunks
- ✅ Understand chunking strategies and their trade-offs
- ✅ Work with document metadata
- ✅ Understand what embeddings are and how they work
- ✅ Create embeddings for text using AI models
- ✅ Store embeddings in vector databases
- ✅ Perform semantic similarity searches
- ✅ Build the foundation for RAG systems

---

## 📌 About the Code Examples

The code snippets shown in this README are simplified for clarity and focus on core concepts. The actual code files in the `code/`, `solution/`, and `samples/` folders include:

- ✨ **Enhanced console output** with emojis, separators, and detailed formatting
- 📊 **Additional statistics** and metrics for better understanding
- 🎯 **More comprehensive examples** with diverse datasets and multiple queries
- 💡 **Extended educational content** with key insights and observations
- 🛡️ **Robust error handling** with try-catch blocks and safe operations

When you run the actual files, you'll see more detailed output than shown in the examples below. This is intentional - the README focuses on teaching concepts, while the code demonstrates production-quality practices.

---

## 📖 The Smart Library System Analogy

**Imagine you're building a modern, intelligent library system.**

### Part 1: Organizing the Library (Document Processing)

When someone donates a massive encyclopedia to your library, you can't:
- ❌ Hand readers the entire 2,000-page book
- ❌ Give them random pages
- ❌ Show them just individual words

Instead, you need to:

- Find the right sections (loading)
- Break it into manageable chapters (chunking)
- Label each piece with metadata (organization)
- Keep some overlap between sections so context isn't lost

### Part 2: The Smart Search System (Embeddings & Semantic Search)

Now imagine each book section gets a special "number tag" that represents its meaning:
- Section about "photosynthesis": `[plants: 0.9, biology: 0.8, energy: 0.7]`
- Section about "solar panels": `[plants: 0.1, technology: 0.9, energy: 0.8]`
- Section about "pasta recipes": `[plants: 0.2, food: 0.9, energy: 0.3]`

> **💡 Note:** These simplified "named tags" are for illustration. Real embeddings are dense vectors of 1536+ numbers without human-readable labels. Think of them as coordinates in 1536-dimensional semantic space, similar to (latitude, longitude) but with many more dimensions!

When someone asks "How do plants create energy?", the system:
1. Converts their question into numbers: `[plants: 0.9, biology: 0.7, energy: 0.8]`
2. Finds sections with similar numbers
3. Returns the photosynthesis section (perfect match!)

**This is how document processing and semantic search work together!**

LLMs have context limits which means they can only process so much text at once. Document processing prepares your content, and semantic search helps you find what's needed based on *meaning*, not just keyword matching. Powerful!

<img src="images/library-system-analogy.png" alt="Smart Library System Analogy" width="800"/>

*The smart library system: Organize documents into chunks with metadata (left), then use semantic search to find relevant content by meaning (right).*

---

## 📄 Part 1: Working with Documents

### Why Document Loaders?

LLMs need text input, but data comes in many formats: text files, PDFs, websites, JSON/CSV, and more. **[Document loaders](../GLOSSARY.md#document-loader) handle the complexity of reading different formats.**

> **📦 Import Path Note**: This course uses `@langchain/classic` imports (e.g., `@langchain/classic/document_loaders/fs/text`). If you see older tutorials using different paths, `@langchain/classic` is the current recommended approach.

<img src="images/document-processing-pipeline.png" alt="Document Processing Pipeline" width="800"/>

*The document processing pipeline: Load documents → Split into chunks → Create embeddings → Store in vector database, ready for semantic search.*

### Example 1: Loading Text Files

Let's see how to use `TextLoader` to read text files and access `pageContent` and `metadata`.

**Key code you'll work with:**
```typescript
// Initialize the loader with a file path
const loader = new TextLoader("./data/sample.txt");

// Load the document - returns array of Document objects
const docs = await loader.load();

// Access document properties
console.log(docs[0].pageContent);  // The actual text content
console.log(docs[0].metadata);      // Metadata like source path
```

**Code**: [`code/01-load-text.ts`](./code/01-load-text.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/01-load-text.ts`

**Example code:**

First, create a sample text file:

```typescript
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { writeFileSync } from "fs";

// Create sample data
const sampleText = `
LangChain.js is a framework for building applications with large language models.

It provides tools for:
- Working with different AI providers
- Managing prompts and templates
- Processing and storing documents
- Building RAG systems
- Creating AI agents

The framework is designed to be modular and composable, allowing developers
to build complex AI applications by combining simple, reusable components.
`.trim();

writeFileSync("./data/sample.txt", sampleText);

// Load the document
const loader = new TextLoader("./data/sample.txt");
const docs = await loader.load();

console.log("Loaded documents:", docs.length);
console.log("Content:", docs[0].pageContent);
console.log("Metadata:", docs[0].metadata);
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "How can I load PDF files instead of text files using LangChain?"
> - "How would I load multiple text files from a directory at once?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/01-load-text.ts`, you'll see:

```
Loaded documents: 1
Content: LangChain.js is a framework for building applications with large language models.

It provides tools for:
- Working with different AI providers
- Managing prompts and templates
- Processing and storing documents
- Building RAG systems
- Creating AI agents

The framework is designed to be modular and composable, allowing developers
to build complex AI applications by combining simple, reusable components.

Metadata: {
  source: './data/sample.txt'
}
```

### How It Works

**What's happening**:
1. **Create sample data**: We write a text file to `./data/sample.txt`
2. **Initialize TextLoader**: Pass the file path to the loader
3. **Load**: Call `loader.load()` to read the file
4. **Result**: Returns an array of `Document` objects

**Key Points**:
- `TextLoader` reads text files and handles file I/O
- Returns array of `Document` objects (even for single files, for consistency)
- Each document has two main properties:
  - `pageContent`: The actual text content
  - `metadata`: Information about the document (source, etc.)
- Metadata automatically includes the source file path

---

## ✂️ Splitting Documents

### Why Split Documents?

- **LLM context limits**: Models can only process ~4,000-128,000 tokens
- **Relevance**: Smaller chunks = more precise retrieval
- **Cost**: Smaller inputs = lower API costs

### Chunk Size Trade-offs ([Chunking](../GLOSSARY.md#chunk--chunking))

| Small Chunks (200-500 chars) | Large Chunks (1000-2000 chars) |
|------------------------------|--------------------------------|
| ✅ More precise | ✅ More context |
| ✅ Better for specific questions | ✅ Better for complex topics |
| ❌ May lose context | ❌ Less precise matching |
| ❌ More chunks to process | ❌ Fewer chunks |

### Example 2: Text Splitting

Here you'll split long documents into manageable chunks using RecursiveCharacterTextSplitter with configurable chunk size and overlap.

**Key code you'll work with:**
```typescript
// Create a splitter with chunk size and overlap settings
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,      // Target size in characters
  chunkOverlap: 50,    // Overlap between chunks (preserves context)
});

// Split text into document chunks
const docs = await splitter.createDocuments([text]);
```

**Code**: [`code/02-splitting.ts`](./code/02-splitting.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/02-splitting.ts`

**Example code:**

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const text = `
[Long article about AI and machine learning...]
`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,      // Target size in characters
  chunkOverlap: 50,    // Overlap between chunks (preserves context)
});

const docs = await splitter.createDocuments([text]);

console.log(`Split into ${docs.length} chunks`);

docs.forEach((doc, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log(doc.pageContent);
  console.log(`Length: ${doc.pageContent.length} characters`);
});
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "How do I determine the optimal chunk size for my documents?"
> - "Can I split on specific delimiters like headings or paragraphs?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/02-splitting.ts`, you'll see:

```
Split into 5 chunks

Chunk 1:
[First ~300 characters of the article...]
Length: 297 characters

Chunk 2:
[Next ~300 characters with 50 character overlap...]
Length: 303 characters

Chunk 3:
[...]
```

### How It Works

**What's happening**:
1. **Create splitter**: Configure `RecursiveCharacterTextSplitter` with `chunkSize: 300` and `chunkOverlap: 50`
2. **Split text**: `createDocuments()` splits the text into manageable pieces
3. **Each chunk**: Has approximately 300 characters, with 50 characters overlapping with adjacent chunks
4. **Result**: Array of `Document` objects, each with a portion of the original text

**Why these settings?**
- `chunkSize: 300`: Small enough for focused retrieval, large enough for context
- `chunkOverlap: 50`: ~17% overlap preserves context between chunks

### Practical Chunk Size Guidelines

**Starting Point**: Use **500 characters** with **100 character overlap** (20%) for most use cases.

**Adjust based on results**:
- Too few results → Increase chunk size
- Results too generic → Decrease chunk size
- Missing context at boundaries → Increase overlap

**Splitter Types ([Text Splitter](../GLOSSARY.md#text-splitter))**:

1. **RecursiveCharacterTextSplitter** (recommended)
   - Splits on paragraphs, then sentences, then words
   - Preserves structure better

2. **CharacterTextSplitter**
   - Simple splitting by character count
   - Less context-aware

3. **TokenTextSplitter**
   - Splits by token count (more precise for LLM limits)

---

## 🔄 Chunk Overlap

**Why overlap chunks ([chunk overlap](../GLOSSARY.md#chunk-overlap))?** Without overlap, "the mitochondria is the | powerhouse of the cell" splits mid-sentence, losing context. With overlap, both chunks include "is the powerhouse," preserving meaning.

**Recommended overlap**: Start with 20% of chunk size (e.g., 100 chars for 500-char chunks). Production systems commonly use 10-50% depending on content type—test what works for your application.

### Example 3: Comparing Overlap

This example compares chunks with and without overlap to demonstrate how overlap preserves context.

**Key code you'll work with:**
```typescript
// No overlap - chunks split exactly at boundaries
const noOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 150,
  chunkOverlap: 0,     // No shared context between chunks
});

// With overlap - chunks share text to preserve context
const withOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 150,
  chunkOverlap: 30,    // 30 characters overlap between chunks
});
```

**Code**: [`code/03-overlap.ts`](./code/03-overlap.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/03-overlap.ts`

**Example code:**

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const text = "Your sample text here...";

// No overlap
const noOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 0,
});

// With overlap
const withOverlap = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

const chunks1 = await noOverlap.createDocuments([text]);
const chunks2 = await withOverlap.createDocuments([text]);

console.log("Without overlap:");
chunks1.forEach((doc, i) => console.log(`${i}: ${doc.pageContent}`));

console.log("\nWith overlap:");
chunks2.forEach((doc, i) => console.log(`${i}: ${doc.pageContent}`));
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What percentage overlap is recommended for different chunk sizes?"
> - "Can too much overlap cause duplicate information in search results?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/03-overlap.ts`, you'll see the difference:

```
Without overlap:
0: [First 100 chars] ...end of sentence
1: New sentence starts... [next 100 chars]
2: [next 100 chars]

With overlap:
0: [First 100 chars including] ...end of sentence. New
1: sentence. New sentence starts... [90 more chars]
2: [last 20 chars of previous] + [80 new chars]
```

### How It Works

**What's happening**:
- **Without overlap (chunkOverlap: 0)**: Chunks are cut exactly at 100 characters, potentially splitting mid-sentence
- **With overlap (chunkOverlap: 20)**: Each chunk includes the last 20 characters from the previous chunk, preserving context

**Why overlap matters**: Imagine splitting "The mitochondria is the powerhouse of the cell" at 25 characters:
- Without overlap: Chunk 1 ends with "...is the", Chunk 2 starts with "powerhouse..." - context lost!
- With overlap: Both chunks include "is the powerhouse", preserving meaning

**Recommended overlap**: 10-20% of chunk size

---

## 🏷️ Document Metadata

[Metadata](../GLOSSARY.md#metadata) helps you:
- Track document source
- Filter by category, date, author
- Understand context

### Example 4: Working with Metadata

In this example, you'll learn how to add and preserve metadata (source, category, date, author) through document loading and splitting operations.

**Key code you'll work with:**
```typescript
// Create document with custom metadata
const doc = new Document({
  pageContent: "LangChain.js is a framework...",
  metadata: {
    source: "langchain-guide.md",
    category: "tutorial",
    date: "2024-01-15",
    author: "Tech Team",
  },
});

// Metadata is preserved when splitting
const splitDocs = await splitter.splitDocuments([doc]);
// Each chunk retains the original metadata!
```

**Code**: [`code/04-metadata.ts`](./code/04-metadata.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/04-metadata.ts`

**Example code:**

```typescript
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Create documents with metadata
const docs = [
  new Document({
    pageContent: "LangChain.js is a framework for building AI apps...",
    metadata: {
      source: "langchain-guide.md",
      category: "tutorial",
      date: "2024-01-15",
      author: "Tech Team",
    },
  }),
  new Document({
    pageContent: "RAG systems combine retrieval with generation...",
    metadata: {
      source: "rag-explained.md",
      category: "extended",
      date: "2024-02-20",
    },
  }),
];

// Metadata is preserved when splitting
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);

splitDocs.forEach((doc, i) => {
  console.log(`\nChunk ${i + 1}:`);
  console.log("Content:", doc.pageContent.substring(0, 50) + "...");
  console.log("Metadata:", doc.metadata);
});
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "How can I filter search results by metadata values like category or date?"
> - "Can I add custom metadata after documents are loaded?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/04-metadata.ts`, you'll see:

```
Chunk 1:
Content: LangChain.js is a framework for building AI apps...
Metadata: {
  source: 'langchain-guide.md',
  category: 'tutorial',
  date: '2024-01-15',
  author: 'Tech Team'
}

Chunk 2:
Content: ...
Metadata: {
  source: 'langchain-guide.md',
  category: 'tutorial',
  date: '2024-01-15',
  author: 'Tech Team'
}

Chunk 3:
Content: RAG systems combine retrieval with generation...
Metadata: {
  source: 'rag-explained.md',
  category: 'extended',
  date: '2024-02-20'
}
```

### How It Works

**What's happening**:
1. **Create documents with metadata**: Each `Document` has `pageContent` and custom `metadata`
2. **Split documents**: `splitDocuments()` breaks them into chunks
3. **Metadata is preserved**: Every chunk retains the metadata from its parent document
4. **Use metadata for filtering**: Later you can filter by source, category, date, etc.

**Real-world use cases**:
- Filter search results by document type or date
- Track which document a chunk came from
- Implement access control (user permissions)
- Build faceted search interfaces

---

## 🔢 Part 2: Embeddings & Semantic Search

Now that we can load and chunk documents, how do we search them intelligently? Let's compare traditional keyword search to semantic search.

### Traditional Search vs. Semantic Search

**Keyword Search**:
```
Query: "How do I cook pasta?"
Matches: Documents containing "cook" AND "pasta"
Misses: "Preparing Italian noodles" (different words, same meaning!)
```

**[Semantic Search](../GLOSSARY.md#semantic-search)**:
```
Query: "How do I cook pasta?"
Understands: cooking = preparing, pasta = noodles
Finds: "Preparing Italian noodles", "Making spaghetti", etc.
```

<img src="images/semantic-search-comparison.png" alt="Traditional Search vs Semantic Search" width="800"/>

*Keyword search only finds exact matches, while semantic search understands meaning and finds relevant content even with different wording.*

### What Are Embeddings?

**[Embeddings](../GLOSSARY.md#embedding) are numerical representations of text.** Text goes in ("LangChain is a framework"), an AI model processes it, and a vector comes out (`[0.23, -0.41, 0.87, ..., 0.15]` with 1536 numbers). Similar meanings produce similar vectors, allowing computers to understand and compare text mathematically.

**Example**: "dog" and "cat" vectors would be close together (both animals and pets), while "pizza" would be far away (different concept).

<img src="images/embeddings-visualization.png" alt="Embeddings Visualization" width="800"/>

*Embeddings convert text to numerical vectors. Similar meanings (dog, cat) produce similar vectors, while different concepts (pizza) produce different vectors.*

> **💡 Want to understand how embeddings work in depth?** See the [Deep Dive on Embeddings](#-deep-dive-embeddings) section at the end of this chapter.

---

## 💻 Creating Embeddings

**You want to search your documentation by meaning, not just keywords.** When someone searches "how to configure authentication," you want to find documents about "setting up user login" even though they use different words. To do this, you need to convert text into numerical vectors (embeddings) where similar meanings produce similar numbers.

### Example 5: Basic Embeddings

Let's see how to use `OpenAIEmbeddings` to create vector embeddings and measure similarity with cosine similarity.

**Key code you'll work with:**
```typescript
// Create embeddings model
const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL,
});

// Convert text to embeddings (1536 numbers)
const allEmbeddings = await embeddings.embedDocuments(texts);

// Calculate similarity between embeddings
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);  // 1.0 = identical, 0.0 = unrelated
}
```

**Code**: [`code/05-basic-embeddings.ts`](./code/05-basic-embeddings.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/05-basic-embeddings.ts`

**Example code:**

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});

// Create an embedding for text
const text = "LangChain makes building AI apps easier";
const embedding = await embeddings.embedQuery(text);

console.log(`Embedding dimensions: ${embedding.length}`);
console.log(`First 10 values: ${embedding.slice(0, 10)}`);

// Similar text produces similar embeddings
const similar = await embeddings.embedQuery("LangChain simplifies AI development");
const different = await embeddings.embedQuery("I love pizza");

// Calculate similarity ([cosine similarity](../GLOSSARY.md#cosine-similarity))
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB);
}

console.log("Similarity (LangChain vs LangChain):", cosineSimilarity(embedding, similar).toFixed(3));
console.log("Similarity (LangChain vs pizza):", cosineSimilarity(embedding, different).toFixed(3));
```

> **💡 Performance Tip**: The actual code file [`05-basic-embeddings.ts`](./code/05-basic-embeddings.ts) demonstrates **batch processing** using `embedDocuments()` to embed multiple texts at once, which is 5-10x faster than individual `embedQuery()` calls. See [Example 8](#-batch-processing) for detailed performance comparison!

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What is the cosineSimilarity function doing mathematically?"
> - "Can I use different embedding models and how do they compare?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/05-basic-embeddings.ts`, you'll see:

```
Embedding dimensions: 1536
First 10 values: 0.023,-0.041,0.087,...
Similarity (LangChain vs LangChain): 0.892
Similarity (LangChain vs pizza): 0.124
```

### How It Works

**What's happening**:
1. **Create embedding model**: Configure `OpenAIEmbeddings` with model name and API settings
2. **Generate embedding**: Call `embedQuery()` to convert text into a 1536-dimensional vector
3. **Compare embeddings**: Use cosine similarity to measure how similar two vectors are
4. **Similarity scores**:
   - 0.892 (LangChain vs LangChain): Very similar - both about the same topic
   - 0.124 (LangChain vs pizza): Very different - unrelated topics

**Key insights**:
- **Similar meaning → Similar vectors**: "LangChain makes building AI apps easier" and "LangChain simplifies AI development" have similar embeddings
- **Different meaning → Different vectors**: LangChain and pizza have very different embeddings
- **Cosine similarity**: Measures the angle between vectors (1.0 = identical, 0.0 = orthogonal, -1.0 = opposite)
- **Dimensions**: 1536 numbers capture the semantic meaning of the text

---

## 🗄️ Vector Stores

[Vector stores](../GLOSSARY.md#vector-store) are databases optimized for storing and searching embeddings.

### Popular Vector Stores

| Vector Store | Best For | Difficulty |
|--------------|----------|------------|
| MemoryVectorStore | Testing, small datasets | Easy |
| Chroma | Local development | Easy |
| Pinecone | Production, cloud | Medium |
| Weaviate | Self-hosted production | Medium |
| Qdrant | High performance | Medium |

**You've created embeddings for your documents, but how do you store thousands of them and find the most similar ones quickly?** You need a database optimized for vector similarity search—a vector store. It automatically embeds your documents, stores the vectors, and lets you search by meaning using `similaritySearch()`.

### Example 6: In-Memory Vector Store

Let's see how to use `MemoryVectorStore.fromDocuments()` to create a searchable knowledge base and perform semantic `similaritySearch()`.

**Key code you'll work with:**
```typescript
// Create documents to search
const docs = [
  new Document({ pageContent: "Cats are independent pets..." }),
  new Document({ pageContent: "Dogs are loyal companions..." }),
  // ... more documents
];

// Create vector store - automatically embeds all documents
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Perform semantic search - finds by meaning, not keywords!
const results = await vectorStore.similaritySearch("animals that live indoors", 2);
```

**Code**: [`code/06-vector-store.ts`](./code/06-vector-store.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/06-vector-store.ts`

**Example code:**

```typescript
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  model: process.env.AI_EMBEDDING_MODEL,
  configuration: { baseURL: process.env.AI_ENDPOINT },
  apiKey: process.env.AI_API_KEY
});

// Create documents
const docs = [
  new Document({ pageContent: "Cats are independent pets that love to nap." }),
  new Document({ pageContent: "Dogs are loyal companions that enjoy playing fetch." }),
  new Document({ pageContent: "Birds can sing beautiful songs and fly freely." }),
  new Document({ pageContent: "Fish are quiet pets that live in aquariums." }),
];

// Create vector store from documents
const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

// Perform semantic search
const results = await vectorStore.similaritySearch("animals that live indoors", 2);

console.log("Most similar documents:");
results.forEach((doc, i) => {
  console.log(`${i + 1}. ${doc.pageContent}`);
});
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What's the difference between MemoryVectorStore and persistent stores like Pinecone?"
> - "Can I save and load a MemoryVectorStore to avoid recomputing embeddings?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/06-vector-store.ts`, you'll see:

```
Most similar documents:
1. Fish are quiet pets that live in aquariums.
2. Cats are independent pets that love to nap.
```

Notice: The search found "indoors" matches even though the word "indoors" doesn't appear in any document!

> **📝 Note**: The actual code file (`06-vector-store.ts`) uses a more comprehensive dataset with 6 documents across programming, AI, and animal categories, and demonstrates 4 different search queries to show semantic search across diverse topics. The simplified example above focuses on teaching the core concept of semantic understanding.

### How It Works

**What's happening**:
1. **Create documents**: Four documents about different pets
2. **Create embeddings**: `fromDocuments()` automatically embeds each document
3. **Store in vector store**: Embeddings are stored in memory (MemoryVectorStore)
4. **Semantic search**: `similaritySearch("animals that live indoors", 2)` finds the 2 most similar documents
5. **Results based on meaning**: Fish (aquariums = indoors) and Cats (nap = indoor activity) match best

**Why semantic search wins**:
- **Keyword search** would find nothing (no document contains "indoors" or "animals")
- **Semantic search** understands that:
  - Fish in aquariums → indoors
  - Cats napping → typically indoors
  - Birds flying freely → outdoors
  - Dogs playing fetch → typically outdoors

The AI understands *meaning*, not just words!

---

## 🎯 Similarity Search with Scores

### Example 7: Search with Similarity Scores

Here you'll perform similarity search with numerical scores to quantify how closely documents match your search query.

**Key code you'll work with:**
```typescript
// Search with scores to see how well each result matches
const resultsWithScores = await vectorStore.similaritySearchWithScore(
  "pets that need less attention",
  4  // Return top 4 results
);

// Each result is a [document, score] tuple
resultsWithScores.forEach(([doc, score]) => {
  console.log(`Score: ${score.toFixed(3)} - ${doc.pageContent}`);
  // Higher scores = better matches (typically 0.0-1.0)
});
```

**Code**: [`code/07-similarity-scores.ts`](./code/07-similarity-scores.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/07-similarity-scores.ts`

**Example code:**

```typescript
// ... setup code ...

const resultsWithScores = await vectorStore.similaritySearchWithScore(
  "pets that need less attention",
  4
);

console.log("Search results with similarity scores:");
resultsWithScores.forEach(([doc, score]) => {
  console.log(`Score: ${score.toFixed(3)} - ${doc.pageContent}`);
});
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What similarity score threshold should I use to filter out irrelevant results?"
> - "How does similaritySearchWithScore differ from the regular similaritySearch method?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/07-similarity-scores.ts`, you'll see:

```
Search results with similarity scores:
Score: 0.812 - Fish are quiet pets that live in aquariums.
Score: 0.794 - Cats are independent pets that love to nap.
Score: 0.701 - Birds can sing beautiful songs and fly freely.
Score: 0.623 - Dogs are loyal companions that enjoy playing fetch.
```

### How It Works

**similaritySearchWithScore()** returns `[document, score]` tuples where higher scores = more similar to the query.

**Score interpretation**: 1.0 = identical, 0.8-0.9 = very similar, 0.6-0.8 = somewhat similar, <0.6 = different topics

**Use scores to**: Set thresholds (e.g., only results with score > 0.7), filter by confidence, or rank results

---

## ⚡ Batch Processing

Creating embeddings one at a time is slow. Use [batch processing](../GLOSSARY.md#batch-processing)!

### Example 8: Batch Embeddings

In this example, you'll efficiently create embeddings for multiple texts at once using batch processing, which is significantly faster than individual calls.

**Key code you'll work with:**
```typescript
const texts = ["Text 1", "Text 2", "Text 3", ...];

// Slow: One at a time (~200ms each = 1000ms total for 5 texts)
for (const text of texts) {
  await embeddings.embedQuery(text);  // ❌ Inefficient
}

// Fast: Batch processing (~120ms total for 5 texts)
const batchEmbeddings = await embeddings.embedDocuments(texts);  // ✅ 8x faster!
```

**Code**: [`code/08-batch-embeddings.ts`](./code/08-batch-embeddings.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/08-batch-embeddings.ts`

**Example code:**

```typescript
const texts = [
  "Machine learning is a subset of AI",
  "Deep learning uses neural networks",
  "Natural language processing handles text",
  "Computer vision processes images",
  "Reinforcement learning learns from rewards",
];

console.time("Batch embeddings");
const batchEmbeddings = await embeddings.embedDocuments(texts);
console.timeEnd("Batch embeddings");

console.log(`Created ${batchEmbeddings.length} embeddings`);
console.log(`Each with ${batchEmbeddings[0].length} dimensions`);
```

> **🤖 Try with [GitHub Copilot](../docs/copilot.md) Chat:** Want to explore this code further? Open this file in your editor and ask Copilot:
> - "What's the maximum batch size I can use with embedDocuments?"
> - "How do I handle rate limiting when embedding large document collections?"

### Expected Output

When you run this example with `tsx 07-documents-embeddings-semantic-search/code/08-batch-embeddings.ts`, you'll see:

```
Batch embeddings: 124ms
Created 5 embeddings
Each with 1536 dimensions
```

### How It Works

**What's happening**: `embedDocuments(texts)` embeds multiple texts at once—5-10x faster than individual `embedQuery()` calls.

**Performance**: Individual calls (~200ms × 5 = 1000ms) vs. batch call (~120ms total) = 8x faster

**When to use**: Prefer batch processing for multiple texts (document collections, bulk queries)

---

## 🧮 Embedding Relationships (Bonus)

Embeddings can demonstrate semantic relationships through vector arithmetic!

**Example**: `Embedding("Puppy") - Embedding("Dog") + Embedding("Cat") ≈ Embedding("Kitten")`

This works because embeddings encode relationships as vectors. The demo code shows this in action.

**Code**: [`code/09-embedding-relationships.ts`](./code/09-embedding-relationships.ts)  
**Run**: `tsx 07-documents-embeddings-semantic-search/code/09-embedding-relationships.ts`  

*This is bonus content - feel free to explore it after mastering the basics!*

---

## 📊 Similarity Metrics

**Cosine Similarity** (Recommended for text):
- Measures angle between vectors
- Range: -1 to 1 (usually 0 to 1 for text)
- Best for comparing text embeddings

Other metrics like Euclidean Distance and Dot Product exist but are used for specialized cases. **Stick with cosine similarity for text and embeddings.**

---

## 🗺️ Concept Map

This chapter taught you the complete pipeline for document processing and semantic search:

```mermaid
graph LR
    A[Documents] --> B[Load]
    B --> C[Split]
    C --> D[Embed]
    D --> E[Vector Store]
    E --> F[Semantic Search]
```

*This pipeline powers RAG systems and intelligent document retrieval.*

---

## 🎓 Key Takeaways

- **Document loaders** handle different file formats
- **Text splitters** break documents into manageable chunks
- **Chunk size matters**: Balance context vs. precision
- **Overlap preserves context** between chunks
- **Metadata** tracks source and enables filtering
- **Embeddings** convert text to numerical vectors
- **Semantic search** finds meaning, not just keywords
- **Vector stores** enable fast similarity search at scale
- **Batch processing** is more efficient than one-by-one
- **Cosine similarity** is best for text comparisons
- **Retrieval + Agents = Agentic RAG** - Next, you'll combine these retrieval skills with agents to build intelligent RAG systems

---

## 🏆 Assignment

Ready to practice? Complete the challenges in [assignment.md](./assignment.md)!

The assignment includes:
1. **Similarity Explorer** - Discover how embeddings capture semantic similarity
2. **Semantic Book Search** (Bonus) - Build a book recommendation system using semantic search

---

## 📚 Additional Resources

- [Document Loaders Documentation](https://js.langchain.com/docs/modules/data_connection/document_loaders/)
- [Text Splitters Guide](https://js.langchain.com/docs/modules/data_connection/document_transformers/)
- [Embeddings Documentation](https://js.langchain.com/docs/modules/data_connection/text_embedding/)
- [Vector Stores Guide](https://js.langchain.com/docs/modules/data_connection/vectorstores/)
- [Understanding Embeddings](https://platform.openai.com/docs/guides/embeddings)

**💡 Want more examples?** Check out the [`samples/`](./samples/) folder for additional code examples including keyword vs semantic comparison, multilingual search, embedding visualization, chunking strategies, document organization, and web processing!

---

## 🚀 What's Next?

Great work! You've learned how to process **documents**, create **embeddings**, and perform **semantic search** to find relevant information—but you still had to manually decide when and how to search your knowledge base.

### From Manual Search to Intelligent Retrieval

**What if an AI agent could automatically decide when to search your documents and intelligently combine retrieval with reasoning?** That's exactly what you'll learn in the final chapter:

**Building Agentic RAG Systems** - Combine the autonomous agents you learned in [Getting Started with Agents](../05-agents/README.md) with the retrieval capabilities you just built to create intelligent question-answering systems that know when to search and how to reason about the results.

**The power of this combination**:
- **Agents** autonomously decide which tools to use and when
- **Retrieval tools** search your knowledge base for relevant information
- **Agentic RAG** = Agents that intelligently use retrieval as one of their tools!

This is the culmination of everything you've learned—creating truly intelligent systems that can search, reason, and answer questions using your own documents!

---

## 🗺️ Navigation

[← Previous: Model Context Protocol (MCP)](../06-mcp/README.md) | [Back to Main](../README.md) | [Next: Building Agentic RAG Systems →](../08-agentic-rag-systems/README.md)

---

## 💬 Questions or stuck?

If you get stuck or have any questions about building AI apps, join:

[![Microsoft Foundry Discord](https://img.shields.io/badge/Discord-Microsoft_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Microsoft Foundry Developer Forum](https://img.shields.io/badge/GitHub-Microsoft_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

---

## 🔬 Deep Dive: Embeddings

> **📘 Optional Section**: This section provides a deeper understanding of how embeddings work. Feel free to return to this after completing the hands-on examples!

### Why Embeddings Are Powerful

**Semantic Relationships**:
```typescript
Embedding("Puppy") - Embedding("Dog") + Embedding("Cat") ≈ Embedding("Kitten")
```

This works because embeddings capture relationships:
- "Puppy" is to "Dog" as "Kitten" is to "Cat"
- The vectors encode species and life stage as separate dimensions
- Vector math preserves these relationships!

### How Embedding Models Learn

Embedding models (like `text-embedding-3-small`) are trained on **massive amounts of text** to learn patterns:

1. **Co-occurrence**: Words that appear near each other often get similar embeddings
2. **Context**: "bank" (river) vs "bank" (money) get different embeddings based on surrounding words
3. **Relationships**: The model learns that "Puppy" is to "Dog" as "Kitten" is to "Cat"

**Training Data Scale**:
- Billions of sentences from books, websites, articles
- Learns patterns from how humans use language
- No explicit programming - patterns emerge from data

### Key Properties of Embeddings

**Similar Meaning → Similar Vectors**:
```
"LangChain helps build AI apps"       → [0.23, -0.41, ...]
"LangChain simplifies AI development" → [0.24, -0.39, ...]  ← Very close!
"I love pizza"                        → [-0.67, 0.82, ...]  ← Very different!
```

**Vectors Can Be Compared Mathematically**:
- Distance between vectors = semantic difference
- Close vectors = similar meaning
- Far vectors = different meaning
- We often use cosine similarity to measure "closeness"

**Works Across Languages**:
```
Embedding("hello") ≈ Embedding("hola") ≈ Embedding("bonjour")
```
Multilingual models learn that these mean the same thing!

**Captures Context and Nuance**:
```
"I'm feeling blue" (sad)   → different from
"The sky is blue" (color)  → different embeddings!
```
The model understands "blue" means different things in different contexts.

**Semantic Similarity Examples**:

High Similarity (score ≈ 0.85-0.95):
- "cat" ↔ "feline"
- "happy" ↔ "joyful"
- "car" ↔ "automobile"

Medium Similarity (score ≈ 0.5-0.7):
- "cat" ↔ "dog" (both pets, but different)
- "happy" ↔ "excited" (related emotions)
- "car" ↔ "truck" (both vehicles)

Low Similarity (score ≈ 0.0-0.3):
- "cat" ↔ "pizza"
- "happy" ↔ "mountain"
- "car" ↔ "philosophy"

### Why 1536 (or more) Dimensions?

- **text-embedding-3-small**: 1536 dimensions
- **text-embedding-3-large**: 3072 dimensions

More dimensions = more nuanced understanding, but:
- Larger models → higher API costs
- Larger vectors → more storage needed
- Diminishing returns after a point

For most applications, 1536 dimensions is the sweet spot between accuracy and efficiency.

### Real-World Application Example

When you search for "indoor pets", the system:

1. **Converts your query to a vector**:
   ```
   "indoor pets" → [0.45, -0.23, 0.78, ..., 0.12]
   ```

2. **Compares to all document vectors**:
   ```
   "Cats love napping"        → [0.47, -0.21, 0.76, ...] ← Close! (0.89 similarity)
   "Fish live in aquariums"   → [0.44, -0.24, 0.79, ...] ← Close! (0.91 similarity)
   "Dogs enjoy outdoor fetch" → [0.12, -0.67, 0.23, ...] ← Different (0.42 similarity)
   ```

3. **Returns the closest matches**: Cats and fish documents match best!

The beauty: The word "indoor" doesn't appear in any document, but the system understands aquariums and napping are typically indoor activities!
