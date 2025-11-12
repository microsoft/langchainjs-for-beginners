# Maintainers Guide

This guide is for maintainers and contributors who want to test, validate, and maintain the course examples.

## Testing & Validation

All code examples in this course are automatically tested to ensure they work correctly. Git check ins with "validate-examples" in the commit message will trigger validation.

### Build Check

Compile all TypeScript files to check for errors and warnings:

```bash
# Check all files compile without errors
npm run build
```

This will:
- ✅ Compile all TypeScript files across all chapters
- ✅ Show type errors and warnings
- ✅ Validate imports and syntax
- ✅ Fast - no API calls, just compilation check

### Runtime Validation

Run all code examples with actual API calls:

```bash
# Validate all code examples
npm test

# Or test individual examples
npx tsx 01-introduction/code/01-hello-world.ts
npx tsx 05-function-calling-tooling/code/01-simple-tool.ts
```

The validation script:
- ✅ Tests all TypeScript examples across all chapters
- ✅ Automatically handles interactive examples with simulated input
- ✅ Provides detailed error reports if issues are found
- ✅ Runs in GitHub Actions when triggered (see below)

### GitHub Actions Validation

To save CI time and API costs, validation only runs when you include `validate-examples` in your commit message:

```bash
git commit -m "Update RAG examples validate-examples"
```

Or trigger manually via the GitHub Actions UI.

**Note**: Runtime validation requires `AI_API_KEY`, `AI_ENDPOINT`, `AI_MODEL`, `AI_EMBEDDING_MODEL`, and `AI_API_VERSION` environment variables as secrets in your GitHub repository settings.

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Code Quality**: All examples must pass `npm run build`
2. **Testing**: Run `npm test` before submitting PRs
3. **Documentation**: Update README files when adding new examples
4. **Consistency**: Follow existing patterns and naming conventions

## File Structure

Each chapter follows this structure:

```
XX-chapter-name/
├── README.md              # Chapter content and explanations
├── assignment.md          # Hands-on challenges
├── code/                  # Working examples
│   ├── 01-example.ts
│   └── 02-example.ts
└── solution/              # Assignment solutions
    ├── challenge-1.ts
    └── challenge-2.ts
```

## Maintenance Tasks

### Updating Dependencies

```bash
# Update LangChain packages
npm update @langchain/core @langchain/openai @langchain/community

# Verify everything still works
npm run build
npm test
```

### Adding New Examples

1. Create the example file in the appropriate chapter's `code/` directory
2. Add explanation to the chapter's README.md
3. Test the example: `npx tsx XX-chapter/code/YY-example.ts`
4. Run full build check: `npm run build`
5. Update assignment.md if relevant

### Reviewing PRs

Before merging PRs, ensure:
- [ ] All TypeScript files compile: `npm run build`
- [ ] Examples run successfully: `npm test`
- [ ] Documentation is clear and accurate
- [ ] Code follows existing patterns
- [ ] Assignment solutions are provided (if applicable)
