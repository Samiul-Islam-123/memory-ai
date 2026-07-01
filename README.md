# Memory Engine Node 🧠

[![npm version](https://badge.fury.io/js/memory-engine-node.svg)](https://badge.fury.io/js/memory-engine-node)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A powerful, plug-and-play dual-memory system for building highly personalized, stateful AI applications.

---

## The Problem: AI Amnesia 🛑

Building a basic chatbot with LLMs (like OpenAI, Google, or Anthropic) is incredibly easy today. However, **making that AI remember the user** across multiple sessions is notoriously difficult. 

To build a truly personalized AI, developers typically have to waste weeks wrestling with:
- **Context Window Limits:** You can't just feed the entire chat history into every prompt.
- **Vector Databases:** Setting up, hosting, and querying Pinecone, Qdrant, or ChromaDB.
- **Embedding Pipelines:** Converting text to embeddings and managing similarity searches.
- **Information Extraction:** Writing complex background tasks to summarize and extract "facts" from a user's noisy chat history.

This creates massive overhead, drives up token costs, and delays your launch.

## The Solution: Memory Engine ✅

**Memory Engine** solves this by abstracting the entire memory architecture into a single, easy-to-use package. You simply pass in three models (Base Chat, Embedding, and Analyzer), and the engine automatically handles the rest out of the box.

- It maintains a sliding **Working Memory** for immediate conversational context.
- It constantly runs background analysis to extract crucial facts and saves them to a local **Long-Term Memory** vector store.
- It dynamically retrieves only the most relevant past memories and injects them into the prompt, giving your AI perfect recall without overflowing the context window.

Save weeks of backend development time and build personalized AI apps effortlessly.

## Where Can You Use This? 🚀

Memory Engine is perfect for applications that require long-term context and deep user personalization:
- **AI Companions & Friends:** Bots that remember a user's hobbies, family members, and past stories.
- **Personalized AI Tutors:** Educational apps that track a student's learning progress, struggling topics, and preferred teaching styles across weeks of sessions.
- **Customer Support Agents:** Bots that remember previous tickets, user frustration levels, and account details without forcing the user to repeat themselves.
- **Productivity Assistants:** Coding or writing assistants that remember your specific project architecture, coding preferences, and ongoing to-do lists.

---

## Features

- **Automated Dual-Memory Management:** Intelligently balances short-term context with long-term recall.
- **Zero Vector DB Required:** Uses a highly optimized local storage and vector math engine under the hood. No external database setup needed.
- **Multi-Provider Support:** Seamlessly integrates with three major AI providers:
  - Google (Gemini)
  - OpenAI (GPT)
  - Anthropic (Claude)
- **Production Ready:** Built-in error handling and graceful fallbacks ensure your chat never crashes even if background analysis fails.

---

## Installation

```bash
npm install memory-engine-node
```

---

## Quick Start (Tutorial)

Here is a basic example of how to use the `MemoryEngine`. 

You need to provide configurations for three distinct models:
1. **Base Chat Model**: Handles the main conversational responses.
2. **Embedding Model**: Used for storing and retrieving long-term memories.
3. **Memory Analyzer Model**: Analyzes conversations in the background to extract and store important facts.

```javascript
const MemoryEngine = require("memory-engine-node");

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
        "./memory-data" // Directory path to locally store long-term memory files
    );

    // 2. Chat with the engine
    try {
        console.log("Starting conversation...");
        
        const response1 = await mem.chat("Hi, my name is Alex and I'm currently learning React!");
        console.log("🤖 Model:", response1);

        // Imagine this is a completely new session days later...
        // The model will dynamically retrieve your name and interests from its Long-Term Vector Memory!
        const response2 = await mem.chat("Do you remember my name and what I am studying?");
        console.log("🤖 Model:", response2);

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
```

---

## How It Works (Under the Hood)

When a user sends a message:
1. **Retrieval:** The engine embeds the user's message and runs a cosine similarity search against the local vector store to find highly relevant past memories.
2. **Generation:** It combines the retrieved Long-Term Memories with the recent Working Memory and sends an optimized prompt to the Base Chat model to generate a personalized response.
3. **Analysis:** In the background, the Analyzer model observes the interaction to see if any new durable facts (e.g., "User changed their framework to Vue") were created.
4. **Storage:** If new facts are found, they are embedded and intelligently merged (inserted or updated) into the Long-Term Memory store for future use.

This architecture enables your AI to have stateful, continuous, and context-aware conversations without the headache of managing pipelines or complex prompt engineering.
