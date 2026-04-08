# Course Setup

Welcome! Before we dive into building AI applications with LangChain.js, let's get your development environment ready. This chapter walks you through installing Node.js, setting up your GitHub token for free AI model access (you can also use Microsoft Foundry), and configuring your project environment. By the end, you'll have everything you need to start building with LangChain.js.

## Prerequisites

- A GitHub account (free)
- Basic command line knowledge
- Text editor or IDE

## 📋 What You'll Set Up

1. Node.js and npm
2. GitHub Personal Access Token (for free AI models)
3. Project dependencies
4. Environment variables
5. VS Code (recommended IDE)

---

## 📖 The Workshop Analogy

**Just like setting up a workshop before building furniture, you need to prepare your development environment before building AI applications.**

You'll install Node.js, get access to AI models, and configure your tools. This ensures you have a solid foundation and smooth development experience. Let's get your workshop ready—it takes just 15 minutes!

## Setup Options

Choose from one of the following options to set up your development environment:

1. **GitHub Codespaces**: Use a cloud-based development environment.
2. **Local Development**: Set up your environment on your machine.

---

## GitHub Codespaces

If you prefer not to set up your local environment, you can use **GitHub Codespaces** which is a cloud-based development environment that runs in your browser.
 
1. **Create a Codespace**: Open the [langchainjs-for-beginners](https://github.com/microsoft/langchainjs-for-beginners) on GitHub and click on the green "Code" button. Select "Open with Codespaces" and "New codespace".
2. **Wait for Initialization**: It will take a few moments to set up your environment.
3. **Access the Terminal**: Once ready, open the terminal in Codespaces (Terminal > New Terminal).

---

## Local Development

### Step 1: Install Node.js

You'll need **Node.js LTS (Long Term Support)** to run LangChain.js applications.

#### Check if Node.js is installed:

```bash
node --version
```

If you see an LTS version number (visit [nodejs.org](https://nodejs.org/en/download) to check), you're good! Skip to Step 2.

#### Install Node.js:

1. Visit [nodejs.org](https://nodejs.org/)
2. Follow the install instructions for your operating system
3. Verify installation:

```bash
node --version  # Displays LTS version
npm --version # Displays npm version
```

**Why LTS?** Stable, production-ready, and receives security updates.

---

### Step 2: Clone the Repository

```bash
# Clone the course repository
git clone https://github.com/microsoft/langchainjs-for-beginners

# Navigate to the project
cd langchainjs-for-beginners

# Install dependencies
npm install

# Install tsx globally
npm install -g tsx
```

This will install all required packages including:
- `@langchain/openai` - OpenAI-compatible model integration (used in all chapters)
- `@langchain/core` - Core LangChain functionality
- `langchain` - Main LangChain package with additional utilities
- `dotenv` - Environment variable management for API keys

#### Why install tsx globally?

**tsx** lets you run `.ts` files directly without compiling first.

**Comparison**:
```bash
# Without tsx: compile then run
tsc myfile.ts && node myfile.js

# With tsx: run directly
tsx myfile.ts
```

**Benefits**: Faster development, simpler workflow, no build step needed. Throughout this course, you'll run examples using `tsx filename.ts`.

---

### Step 3: Create GitHub Personal Access Token

GitHub Models provides free access to powerful AI models—you just need a Personal Access Token.

#### Create Your Token:

1. **Visit**: https://github.com/settings/tokens/new
2. **Token name**: `langchain-course` (or any name you prefer)
3. **Expiration**: Choose your preference (90 days recommended for learning)
4. **Scopes/Permissions**:
   - ✅ No scopes needed for GitHub Models!
   - You can leave all checkboxes unchecked
5. **Click**: "Generate token"
6. **⚠️ IMPORTANT**: Copy your token now and save it to a text file temporarily! You'll need it in the next step.

#### Why GitHub Models?

- ✅ **Free**: No credit card required
- ✅ **Powerful**: Access to GPT-4o, GPT-4o-mini, and other models
- ✅ **Easy**: Use your existing GitHub account
- ✅ **Learning**: Perfect for this course!

---

### Step 4: Configure Environment Variables

#### Create `.env` file:

**Mac, Linux, WSL on Windows:**

```bash
cp .env.example .env
```

**Windows Command Prompt:**

```bash
# Windows Command Prompt
copy .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

#### Edit `.env` file:

Open `.env` in your text editor and configure your AI provider.

**For GitHub Models (Free):**

```bash
AI_API_KEY=ghp_your_github_token_here
AI_ENDPOINT=https://models.github.ai/inference
AI_MODEL=openai/gpt-5-mini
```

 > [!TIP]
 > The free `gpt-5-mini` and `gpt-5` Github models can get busy from time to time so if you hit an error using them, try changing the `AI_MODEL` value to `openai/gpt-4.1-mini` or `openai/gpt-4.1`instead.

**Replace `ghp_your_github_token_here` with your actual GitHub token!**

**Alternative: Microsoft Foundry**

If you have an Azure subscription, you can use Microsoft Foundry for production-grade AI applications. See the [Azure Setup Appendix](./APPENDIX.md#microsoft-foundry-setup) for detailed instructions on deploying models and configuring your environment.

### Step 5: Test Your Setup

Let's verify everything works!

#### Run the test:

Run the following command in your terminal from the root of the project:

```bash
tsx scripts/test-setup.ts
```

#### Expected output:

```
🚀 Testing AI provider connection...

✅ SUCCESS! Your AI provider is working!
   Provider: https://models.inference.ai.azure.com
   Model: gpt-5-mini

Model response: Setup successful!

🎉 You're ready to start the course!
```

If you see this, you're all set! If not, check the troubleshooting section below.

---

### Step 6: Install VS Code (Recommended)

While you can use any text editor, we recommend **Visual Studio Code** for the best experience.

#### Install VS Code:

1. Visit [code.visualstudio.com](https://code.visualstudio.com/)
2. Download for your OS
3. Install and launch VS Code

## ✅ Setup Checklist

Before starting the course, make sure you have:

- [ ] Node.js LTS installed
- [ ] Project cloned and dependencies installed (`npm install`)
- [ ] tsx installed globally (`npm install -g tsx`)
- [ ] GitHub Personal Access Token created if you're using GitHub Models. If you're using Microsoft Foundry, ensure your models are deployed and you have your API key and endpoint.
- [ ] `.env` file configured with your token (or key if using Microsoft Foundry) and endpoint
- [ ] Test script runs successfully
- [ ] VS Code installed (optional but recommended)

---

## 🎯 What's Next?

You're all set! Time to build your first AI application.

**👉 Continue to [Introduction to LangChain.js](../01-introduction/README.md)**

---

## 📚 Additional Resources

- [GitHub Models Documentation](https://github.com/marketplace/models)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Environment Variables Best Practices](https://www.npmjs.com/package/dotenv)

---

## 🗺️ Navigation

[Back to Main](../README.md) | [Next: Introduction to LangChain.js →](../01-introduction/README.md)

---

## 💬 Questions?

If you get stuck or have any questions about building AI apps, join:

[![Microsoft Foundry Discord](https://img.shields.io/badge/Discord-Microsoft_Foundry_Community_Discord-blue?style=for-the-badge&logo=discord&color=5865f2&logoColor=fff)](https://aka.ms/foundry/discord)

If you have product feedback or errors while building visit:

[![Microsoft Foundry Developer Forum](https://img.shields.io/badge/GitHub-Microsoft_Foundry_Developer_Forum-blue?style=for-the-badge&logo=github&color=000000&logoColor=fff)](https://aka.ms/foundry/forum)

If you run into issues with the course materials, please open an issue in the GitHub repo:

[![Course Issues](https://img.shields.io/badge/GitHub-LangChain.js_for_Beginners_Issues-blue?style=for-the-badge&logo=github&color=green&logoColor=fff)](https://github.com/microsoft/langchainjs-for-beginners/issues)
