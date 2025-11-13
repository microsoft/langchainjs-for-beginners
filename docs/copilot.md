# Setting up and using GitHub Copilot with this repository

This repository has been designed to work seamlessly with GitHub Copilot, an AI-powered code companion tool that can help you learn and write code faster.

GitHub Copilot [can be used for FREE](https://github.blog/news-insights/product-news/github-copilot-in-vscode-free/) in VS Code, Visual Studio and Codespaces, follow the instructions below to get started.

> [!TIP]
> In addition to Copilot Free tier, students, educators, and open source maintainers also can have a free access to unlimited Copilot Pro.

## Setup

Go to this [GitHub Copilot page](https://github.com/features/copilot) and click on the "Get started for free" button to enable GitHub Copilot for your account.

Once you have enabled GitHub Copilot, you need to login to GitHub Copilot in your IDE:

- **VS Code**: Install the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) from the VS Code marketplace. After installing the extension, you will be prompted to sign in to GitHub and authorize the extension to access your account.
- **Visual Studio**: Follow the instructions in this [GitHub Copilot for Visual Studio documentation](https://learn.microsoft.com/visualstudio/ide/copilot-free-plan?view=vs-2022).
- **Codespaces**: GitHub Copilot is pre-installed in Codespaces. You just need to sign in to your GitHub account when prompted.

## Using GitHub Copilot

Once you have set up GitHub Copilot, you can start using it to assist you with learning and coding tasks in this repository.

First, open the repository in your IDE, and open a Copilot chat window. In VS Code, you use `⌃⌘I` on Mac or `Ctrl+Alt+I` on Windows/Linux to open the chat.

From there, you attach files or folders from the repository to the chat context, and you can start asking questions about the lessons, such as:

- "Explain me like I'm five what I'll learn in Lesson 6 (MCP), under 100 words."

### Using the different agents

Copilot chat supports different agents roles that can help you get more specific answers or actions based on your needs. You can switch between agents by clicking on the mode selector in the chat window.

![Agent mode picker](./images/copilot-modes.png)

Copilot comes with some built-in agents, such as:

- **Agent (default)**: Default agent is optimized for making autonomous edits across multiple files in your project.
- **Ask**: Ask agent is optimized for answering questions about your codebase, coding, and general technology concepts.
- **Plan**: Plan agent researches and drafts plans for a given task without making any changes to your codebase.

### Challenge tutor agent

In addition to the built-in agents, you can also create custom agents to tailor the experience to your specific needs. For example, we have created a custom agent called **"Challeng Tutor"** that is designed to help you while you're working on the lesson challenges, without giving you the solution (otherwise it wouldn't be useful 😉).

Try selecting the "Challenge Tutor" agent from the agent selector, and then ask questions like:

- "How can I initialize the ChatOpenAI model?"

## Extending or customizing examples

Once you're comfortable with the lessons, you can explore how to extend or customize the examples to fit your own use cases. You can modify existing code, add new features, or integrate with other services or APIs. **Agent** is the recommended mode for making such changes.

## Advanced usage

After you're more familiar with Copilot, you can explore more advanced features, such as customizing prompts, instructions or creating your own custom agents to suit your specific needs.

You can also explore the [Awesome Copilot repository](https://github.com/github/awesome-copilot) for community-created reusable prompts, custom agents, and other resources to enhance your Copilot experience.

## Resources

- [GitHub Copilot documentation](https://docs.github.com/copilot)
- [Custom agents in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Tutorial: Getting started with GitHub Copilot](https://github.com/skills/getting-started-with-github-copilot)
