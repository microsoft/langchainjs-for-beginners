# GitHub Actions Workflows

This directory contains CI/CD workflows for the LangChain.js for Beginners course.

## Workflows

### `validate-examples.yml`

Validates all code examples in the course when explicitly requested. **Does not run automatically** on every commit to save CI time and API costs.

**What it does:**
- Runs all TypeScript code examples across all chapters
- Verifies they execute without errors
- Tests on Node.js 22 (LTS)
- Automatically provides input for interactive examples
- Runs `npm run test:parallel` (120-second timeout per example)

**How to trigger:**

1. **Include keyword in commit message:**
   ```bash
   git commit -m "Fix RAG examples validate-examples"
   git push
   ```

2. **Include keyword in PR title:**
   ```
   "Update embeddings validate-examples"
   ```

3. **Manual trigger via GitHub UI:**
   - Go to Actions tab → Select "Validate Code Examples" → Click "Run workflow"

**When to trigger:**
- ✅ Adding/modifying code examples
- ✅ Updating dependencies that affect examples
- ✅ Testing before merging to main/develop
- ❌ Documentation-only changes
- ❌ Fixing typos or comments
- ❌ Minor formatting changes

**Requirements:**
- Uses Microsoft Foundry `AI_API_KEY`, `AI_ENDPOINT`, and `AI_MODEL` repository secrets
- There is no default endpoint — configure secrets before running validation

## Running Locally

To validate all examples on your local machine:

```bash
# Install dependencies first
npm install

# Sequential validation (safer against rate limits)
npm test

# Parallel validation (faster; matches CI)
npm run test:parallel
```

**Note:** You need `AI_API_KEY`, `AI_ENDPOINT`, `AI_MODEL`, and `AI_EMBEDDING_MODEL` in `.env`. See [Course Setup](../../00-course-setup/README.md) for details.

## GitHub Actions Secrets Setup

Configure Microsoft Foundry credentials as repository secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add repository secrets:
   - `AI_API_KEY`: Your Microsoft Foundry API key
   - `AI_ENDPOINT`: Your Microsoft Foundry endpoint URL (include `/openai/v1`)
   - `AI_MODEL`: Your chat model name (defaults to `gpt-5-mini` if omitted)
   - `AI_EMBEDDING_MODEL`: Your embedding model name (defaults to `text-embedding-3-small` if omitted)

## Validation Details

The validation scripts (`scripts/validate-examples.ts` and `scripts/validate-examples-parallel.ts`) share config in `scripts/validation-common.ts`:
- ✅ Finds all `.ts` files in `code/`, `solution/`, and `samples/` directories
- ✅ Executes each file with a 120-second timeout
- ✅ Automatically provides input for interactive examples
- ✅ Starts server examples, checks for a ready message, then stops them
- ✅ Skips files listed in `SKIP_FILES` (currently `temperature-lab.ts`)
- ✅ Reports success/failure rates
- ✅ Exits with error code if any examples fail

### Interactive Files

These files require user interaction and receive automated input during testing:
- `chatbot.ts` - Receives "Hello\n" as input
- `streaming-chat.ts` - Receives "Hello\n" as input
- `qa-program.ts` - Receives "What is 2+2?\n" as input
- `03-human-in-loop.ts` - Receives "yes\nno\nno\n" as input
- `conversational-rag.ts` - Receives "What is TypeScript?\n" as input

### Test Results

After running, you'll see:
- Total examples tested
- Passed/failed counts
- Success rate percentage
- Detailed error messages for failures

## Adding New Examples

When adding new code examples:

1. **Standard examples** - Will be automatically detected and tested (120-second timeout)
2. **Interactive examples** - Add an entry to `INTERACTIVE_FILES` in `scripts/validation-common.ts`
3. **Server examples** - Add an entry to `SERVER_FILES` in `scripts/validation-common.ts`
4. **Skipped examples** - Add to `SKIP_FILES` in `scripts/validation-common.ts` only if the example cannot run on Microsoft Foundry

## Troubleshooting

**Tests failing locally:**
- Ensure `AI_API_KEY` and other required variables are set in your `.env` file
- Run `npm install` to get latest dependencies
- Check that you're using Node.js 22 or higher (run `node --version`)

**Tests failing in CI:**
- Verify the workflow was triggered (commit message must contain "validate-examples")
- Check that required secrets are configured in repository settings
- Review GitHub Actions logs for specific errors
- Ensure Node.js 22 is specified in the workflow file

## Best Practices

✅ **DO:**
- Test examples locally before committing
- Keep examples within the 120-second validation timeout
- Include error handling in examples
- Document any special requirements

❌ **DON'T:**
- Commit examples that require user input without marking them as interactive
- Use hardcoded API keys (always use environment variables)
- Create examples with infinite loops
- Assume specific file paths exist
