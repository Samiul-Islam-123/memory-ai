# Memory Engine

A powerful, easy-to-use memory system for building AI-powered applications. 

Instead of building a basic LLM integration (via providers like OpenAI, Google, or Anthropic) and then struggling with the complexity of creating a custom memory system (working memory, long-term storage, retrieval, and analysis), **Memory Engine** handles it all for you automatically out of the box.

Just import the package, configure three models, and boom—everything is automatically handled!

## Features

- **Automated Memory Management:** Intelligently handles both short-term (working) and long-term memory.
- **Multi-Provider Support:** Currently supports three major AI providers:
  - Google
  - OpenAI
  - Anthropic

## Installation

```bash
npm install memory-engine
```

## Usage

Here is a basic example of how to use the `MemoryEngine`. You need to provide configurations for three distinct models:
1. **Base Chat Model**: Handles the main conversational responses.
2. **Embedding Model**: Used for storing and retrieving long-term memories.
3. **Memory Analyzer Model**: Analyzes conversations to extract and store important facts to long-term storage.

```javascript
const MemoryEngine = require("memory-engine");

async function main() {
    // 1. Initialize the Memory Engine
    const mem = new MemoryEngine(
        {
            // Base chat model
            model: "gemini-3.1-flash-lite", // e.g., gpt-4o for openai, claude-3-5-sonnet-20240620 for anthropic
            provider: "google",             // 'google', 'openai', or 'anthropic'
            apiKey: "YOUR_API_KEY"
        },
        {
            // Embedding model
            model: "gemini-embedding-2",
            provider: "google",
            apiKey: "YOUR_API_KEY"
        },
        {
            // Analyzer model
            model: "gemini-2.5-flash",
            provider: "google",
            apiKey: "YOUR_API_KEY"
        },
        "./memory-data" // Directory path to store long-term memory files
    );

    // 2. Chat with the engine
    try {
        const response1 = await mem.chat("Hi, my name is Alex and I love building AI apps!");
        console.log("Model:", response1);

        // In future chats, the model will naturally remember your name and interests!
        const response2 = await mem.chat("Do you remember my name?");
        console.log("Model:", response2);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
```

## How It Works

Under the hood, **Memory Engine** utilizes a dual-memory system:
- **Working Memory:** Keeps track of the immediate conversational context to ensure continuity.
- **Long-Term Memory:** Past interactions are analyzed and important facts are embedded and stored. When a user sends a new message, the engine retrieves pertinent long-term memories to enhance the model's prompt dynamically. 

This enables your AI applications to have stateful, continuous, and context-aware conversations without the headache of managing vector databases or complex prompt engineering.
