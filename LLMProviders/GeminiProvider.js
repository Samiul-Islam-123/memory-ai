const { GoogleGenAI } = require("@google/genai");

class GeminiProvider {

    constructor({ model, apiKey }) {

        if (!model) {
            throw new Error("Gemini model is required.");
        }

        if (!apiKey) {
            throw new Error("Gemini API key is required.");
        }

        this.model = model;

        this.client = new GoogleGenAI({
            apiKey
        });

    }

    async generate({ prompt, systemPrompt = "" }) {

        try {

            if (!prompt || typeof prompt !== "string") {
                throw new Error("Prompt must be a non-empty string.");
            }

            const response = await this.client.models.generateContent({

                model: this.model,

                config: {
                    systemInstruction: systemPrompt
                },

                contents: prompt

            });

            return response.text || "";

        } catch (error) {

            if (error.status === 401) {
                throw new Error("Invalid Gemini API Key.");
            }

            if (error.status === 403) {
                throw new Error("Gemini access denied.");
            }

            if (error.status === 404) {
                throw new Error(`Model "${this.model}" not found.`);
            }

            if (error.status === 429) {
                throw new Error("Gemini rate limit exceeded.");
            }

            throw new Error(`Gemini Error: ${error.message}`);
        }

    }

    async embed(text) {

        try {

            if (!text || typeof text !== "string") {
                throw new Error("Text must be a non-empty string.");
            }

            const response = await this.client.models.embedContent({

                model: this.model,

                contents: text

            });

            return response.embeddings[0].values;

        } catch (error) {

            if (error.status === 401) {
                throw new Error("Invalid Gemini API Key.");
            }

            if (error.status === 403) {
                throw new Error("Gemini access denied.");
            }

            if (error.status === 404) {
                throw new Error(`Embedding model "${this.model}" not found.`);
            }

            if (error.status === 429) {
                throw new Error("Gemini rate limit exceeded.");
            }

            throw new Error(`Gemini Embedding Error: ${error.message}`);

        }

    }

}

module.exports = GeminiProvider;