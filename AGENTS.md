# AGENTS.md

## Project Overview

This is **LangChain.js for Beginners** - a comprehensive educational course teaching AI application development with LangChain.js and TypeScript. The repository contains 8 sections (00-07) covering everything from basic chat models to autonomous agents, RAG systems, and Model Context Protocol (MCP) integration.

**Architecture**: Educational course structure with 71+ runnable TypeScript examples organized by topic
**Key Technologies**: LangChain.js, TypeScript, tsx, Node.js >=22.0.0 (LTS), MCP, OpenAI/Microsoft Foundry/Anthropic
**Purpose**: Teaching developers how to build AI-powered applications using an agent-first philosophy
**Teaching Approach**: Agent-first (Tools → Agents → Documents → Agentic RAG)

## Repository Structure

```
LangChainJS-for-Beginners/
├── 00-course-setup/          # Initial setup and configuration
├── 01-introduction/          # LangChain.js basics
├── 02-chat-models/           # Chat models and interactions
├── 03-prompts-messages-outputs/ # Dynamic prompts, messages, and structured outputs
├── 04-function-calling-tools/   # Function calling and tool integration (Agent-first: Step 1)
├── 05-agents/                   # Autonomous agents (Agent-first: Step 2)
├── 06-mcp/                      # Model Context Protocol - connecting AI to external services
├── 07-documents-embeddings-semantic-search/ # Document processing, embeddings, semantic search (Agent-first: Step 3)
├── 08-agentic-rag-systems/      # Agentic RAG where agents decide when to search (Agent-first: Step 4)
│   └── samples/
│       └── mcp-rag-server/      # RAG as an MCP service (capstone example)
├── data/                     # Sample data files
├── scripts/                  # Build and validation scripts
│   ├── build-check.ts        # TypeScript compilation validator
│   ├── test-setup.ts         # Environment setup tester
│   └── validate-examples.ts  # Code example test runner
├── .env.example              # Environment configuration template
└── GLOSSARY.md               # Comprehensive course glossary
```

Each chapter contains:
- `README.md` - Conceptual explanations and learning content
- `assignment.md` - Hands-on exercises
- `code/` - Working code examples
- `solution/` - Assignment solutions
- `images/` - Supporting diagrams (some chapters)

## Setup Commands

### Initial Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your AI provider credentials
# Required: AI_API_KEY, AI_ENDPOINT, AI_MODEL, AI_EMBEDDING_MODEL
```

### AI Provider Configuration

The course supports multiple AI providers (no code changes needed - just update `.env`):

**GitHub Models** (Free - recommended for learning):
```bash
AI_API_KEY=your_github_personal_access_token
AI_ENDPOINT=https://models.inference.ai.azure.com
AI_MODEL=gpt-5-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
```

**Microsoft Foundry** (Production):
```bash
AI_API_KEY=your_azure_openai_api_key
AI_ENDPOINT=https://your-resource.openai.azure.com/openai/v1
AI_MODEL=gpt-5-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
```

**OpenAI Direct**:
```bash
AI_API_KEY=your_openai_api_key
AI_ENDPOINT=https://api.openai.com/v1
AI_MODEL=gpt-5-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
```

### Environment Requirements

- Node.js >=22.0.0 (LTS - specified in `package.json`)
- npm (package manager)
- Valid AI provider credentials in `.env` file

## Development Workflow

### Running Individual Examples

```bash
# Run any TypeScript file directly with tsx
npx tsx 01-introduction/code/01-hello-world.ts

# Or use npm start
npm start 02-chat-models/code/01-multi-turn.ts

# Watch mode for development
npm run dev <file-path>
```

### Working on Course Content

When working on course content or examples:
1. Each chapter is self-contained with its own code examples
2. Code files use ES modules (`"type": "module"` in package.json)
3. All examples use environment variables for configuration (never hardcode keys)
4. Interactive examples should be marked in `validate-examples.ts`

## Testing Instructions

### Quick Build Check (Fast - 10-30 seconds)

```bash
# Type-check all TypeScript files without running them
npm run build
```

This compiles 71 TypeScript files to check for:
- ✅ Type errors
- ✅ Syntax errors
- ✅ Import issues
- ✅ No API calls - just compilation

### Full Validation (Comprehensive - 20-40 minutes)

```bash
# Run all code examples with actual API calls
npm test
```

**Important Notes**:
- Requires valid `AI_API_KEY`, `AI_ENDPOINT`, `AI_MODEL`, and `AI_EMBEDDING_MODEL` in `.env`
- Tests all examples sequentially to avoid rate limiting
- Interactive files are tested with automated input
- Some examples have 60-second timeouts (marked in `SLOW_FILES`)
- Examples in `future/` folder are not included in validation

### Testing Specific Examples

```bash
# Run a single example
npx tsx 03-prompt-templates/code/01-basic-template.ts

# Test a specific chapter
npx tsx 06-rag-systems/code/*.ts
```

### Test File Categories

**Interactive Files** (tested with automated input):
- `chatbot.ts`
- `streaming-chat.ts`
- `qa-program.ts`
- `03-human-in-loop.ts`

**Slow Files** (60-second timeout):
- `03-model-comparison.ts` - Compares multiple models
- `03-parameters.ts` - Tests 9 parameter combinations
- `temperature-lab.ts` - Temperature experiments
- `04-error-handling.ts` - Error scenarios
- `robust-chat.ts` - Retry logic testing
- And others listed in `validate-examples.ts`

## Code Style

### TypeScript Configuration

```json
{
  "target": "ES2022",
  "module": "ESNext",
  "moduleResolution": "bundler",
  "strict": true
}
```

### Coding Conventions

**Module System**:
- Use ES modules (import/export)
- File extension required for local imports: `import { foo } from "./utils.js"`

**Environment Variables**:
- Always use `process.env.AI_API_KEY` (never hardcode)
- Always use `process.env.AI_ENDPOINT`
- Always use `process.env.AI_MODEL`
- Always use `process.env.AI_EMBEDDING_MODEL` (for embeddings)
- Load from `.env` using dotenv

**Code Examples**:
- Keep examples focused and educational
- Include comments explaining key concepts
- Use async/await for asynchronous operations
- Handle errors gracefully
- Log outputs clearly for learning purposes

**File Naming**:
- Use kebab-case for directories: `01-introduction`
- Use numbered prefixes for sequential content: `01-hello-world.ts`
- Use descriptive names: `model-comparison.ts`, not `mc.ts`

**Import Patterns**:
```typescript
// LangChain imports
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Standard library
import { config } from "dotenv";
import { readFile } from "fs/promises";
```

### Educational Code Quality

- Prioritize readability over cleverness
- Include inline comments for complex concepts
- Use meaningful variable names
- Avoid overly nested code
- Keep examples concise (typically <100 lines)

## Build and Deployment

### Build Process

The repository uses TypeScript compilation checking via `scripts/build-check.ts`:

```bash
# Build check (validates TypeScript compilation)
npm run build
```

**Output**: No build artifacts generated - this is a validation-only check
**Purpose**: Ensures all TypeScript files compile correctly before commits

### Validation Process

The repository uses `scripts/validate-examples.ts` for comprehensive testing:

```bash
# Full validation (runs all examples)
npm test
```

**Process**:
1. Finds all `.ts` files in `code/` and `solution/` directories
2. Runs each file sequentially with `tsx`
3. Provides automated input for interactive examples
4. Reports success/failure with detailed error messages
5. Exits with error code 1 if any examples fail

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/validate-examples.yml`):
- **Triggers**: Only runs when commit message or PR title contains "validate-examples", or manually triggered
- Tests on Node.js 22 (LTS)
- Runs full validation suite
- Uses secrets: `AI_API_KEY`, `AI_ENDPOINT`, `AI_MODEL`, `AI_EMBEDDING_MODEL`
- Timeout: 30 minutes

**To trigger validation in your commit:**
```bash
git commit -m "Update RAG examples validate-examples"
```

**To trigger validation manually:**
1. Go to GitHub Actions tab
2. Select "Validate Code Examples" workflow
3. Click "Run workflow"

## Adding New Examples

### Standard Example (Single API call, <30 seconds)

1. Create `.ts` file in appropriate chapter's `code/` directory
2. Use numbered prefix: `05-new-example.ts`
3. Follow existing patterns for imports and structure
4. Test locally: `npx tsx path/to/05-new-example.ts`
5. Run build check: `npm run build`
6. No changes to `validate-examples.ts` needed

### Slow Example (Multiple API calls or >30 seconds)

1. Create the example file as above
2. Add filename to `SLOW_FILES` array in `validate-examples.ts`:
```typescript
const SLOW_FILES = [
  "03-model-comparison.ts",
  "your-new-slow-file.ts", // Add here
];
```

### Interactive Example (Requires user input)

1. Create the example file
2. Add to `INTERACTIVE_FILES` array in `validate-examples.ts`:
```typescript
const INTERACTIVE_FILES = [
  { file: "chatbot.ts", input: "Hello\n" },
  { file: "your-new-interactive.ts", input: "test input\n" },
];
```

## Pull Request Guidelines

### Before Submitting

```bash
# 1. Run build check
npm run build

# 2. Test affected examples locally
npx tsx path/to/changed-file.ts

# 3. Run full validation (optional but recommended)
npm test
```

### Commit Messages

- Use clear, descriptive commit messages
- Reference issue numbers if applicable
- Include "validate-examples" to trigger CI/CD validation when needed
- Examples:
  - "Add vector store example to chapter 5" (no validation)
  - "Add vector store example to chapter 5 validate-examples" (triggers validation)

### PR Requirements

- All TypeScript files must compile (`npm run build` passes)
- Changed examples must run successfully
- Update `validate-examples.ts` if adding interactive/slow files
- Update chapter README.md if adding new concepts
- Include comments in code for educational clarity

## Security Considerations

### Secrets Management

- **NEVER commit `.env` file** (included in `.gitignore`)
- Always use environment variables for API keys
- Use `.env.example` as template (no real credentials)
- GitHub Actions uses repository secrets

### API Keys

```typescript
// ❌ WRONG - Hardcoded
const apiKey = "ghp_abc123";

// ✅ CORRECT - Environment variable
const apiKey = process.env.AI_API_KEY;
```

### Rate Limiting

- Validation script runs examples sequentially to avoid rate limits
- Interactive examples timeout after 30-60 seconds
- Consider rate limits when adding multiple API calls

## Troubleshooting

### "Missing AI_API_KEY" Error

```bash
# Ensure .env file exists and contains:
AI_API_KEY=your_key
AI_ENDPOINT=your_endpoint
AI_MODEL=gpt-5-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
```

### "Command timed out"

- Add file to `SLOW_FILES` in `validate-examples.ts`
- Check for infinite loops or hanging API calls

### "Module not found"

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Compilation Errors

```bash
# Check specific file
npx tsc --noEmit path/to/file.ts

# Check all files
npm run build
```

## Additional Notes

### Course Philosophy

This is an educational repository optimized for learning:
- Examples are sequential and build on each other
- Code prioritizes clarity over performance
- Each chapter is self-contained for easy navigation
- All examples are tested automatically to ensure they work
- **Pedagogical approach**: Hands-on examples before heavy theory
- Terms and concepts defined before extensive use
- Additional/future content clearly marked as optional
- Deep dive sections available for those wanting more depth

### Agent-First Teaching Philosophy

Unlike traditional LangChain tutorials that teach document search first, this course follows a **modern, agent-first approach**:

1. **Function Calling & Tools** - Learn to give AI the ability to use tools
2. **Agents & MCP** - Build autonomous agents that reason and make decisions
3. **Documents & Embeddings** - Learn document processing and semantic search
4. **Agentic RAG** - Combine agents with retrieval for intelligent systems

**Why Agent-First?**
- Mirrors how production AI systems work (agents with multiple capabilities)
- Teaches autonomous decision-making before retrieval patterns
- Enables students to build **Agentic RAG** where agents decide when to search
- More efficient than traditional "always-search" RAG patterns

**Key Differentiator**: Students learn to build RAG systems where agents intelligently decide when retrieval is necessary vs answering directly from general knowledge.

### MCP RAG Server (Extended Example)

The course includes a capstone example that combines all learned concepts:

**Location**: `08-agentic-rag-systems/samples/mcp-rag-server/`

**What it demonstrates**:
- Building an HTTP streamable MCP server that exposes RAG as a service
- Multiple agents sharing a centralized knowledge base
- Agentic decision-making (when to search vs answer directly)
- Enterprise architecture pattern for scalable AI systems

**Files**:
- `mcp-rag-server.ts` - MCP server exposing searchDocuments and addDocument tools
- `mcp-rag-agent.ts` - Agent client that connects to and uses the MCP RAG server
- `README.md` - Complete architecture explanation and setup guide

**Security Note**: Example is for educational purposes and does not implement authentication/authorization. See [MCP Security Documentation](https://modelcontextprotocol.io/docs/tutorials/security/authorization) for production guidelines.

**Run the example**:
```bash
npx tsx 08-agentic-rag-systems/samples/mcp-rag-server/mcp-rag-agent.ts
```

### Working with Chapters

- Start with `00-course-setup` for environment configuration
- Each chapter has learning objectives in its README.md
- Follow the agent-first progression (Chapters 4 → 5 → 6 → 7)
- Try the assignments before looking at solutions
- Examples in `code/` directory demonstrate concepts
- Solutions in `solution/` directory show complete implementations
- Consult `GLOSSARY.md` for definitions of all course terms
- Extended samples in chapter `samples/` folders show real-world patterns

### Provider Flexibility

The course is provider-agnostic:
- Switch providers by changing `.env` only
- No code changes required
- Same examples work with GitHub Models, Azure, or OpenAI
- Documented in each chapter's README.md

### Testing Best Practices

- Run `npm run build` frequently (fast feedback)
- Test individual examples during development
- Run `npm test` before major commits
- Include "validate-examples" in commit message to trigger CI/CD validation
- Use manual trigger in GitHub Actions UI when needed

## Quick Reference

```bash
# Setup
npm install
cp .env.example .env

# Development
npm start <file>              # Run specific file
npm run dev <file>            # Watch mode

# Testing
npm run build                 # Type-check (fast)
npm test                      # Full validation (slow)
npx tsx <file>                # Run individual file

# Trigger CI/CD validation
git commit -m "Your message validate-examples"  # Triggers GitHub Actions
```

## Resources

- [LangChain.js Documentation](https://js.langchain.com/)
- [Model Context Protocol (MCP) Documentation](https://modelcontextprotocol.io/)
- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/authorization)
- [Course README](./README.md)
- [Course Glossary](./GLOSSARY.md)
- [GitHub Models](https://github.com/marketplace/models)
- [Microsoft Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/)
