const Anthropic = require("@anthropic-ai/sdk");

class AnthropicProvider {

    constructor({ model, apiKey }) {

        if (!model) {
            throw new Error("Anthropic model is required.");
        }

        if (!apiKey) {
            throw new Error("Anthropic API key is required.");
        }

        this.model = model;

        this.client = new Anthropic({
            apiKey
        });

    }

    async generate({prompt, systemPrompt}) {

        try {

            if (!prompt || typeof prompt !== "string") {
                throw new Error("Prompt must be a non-empty string.");
            }

            const response = await this.client.messages.create({

                model: this.model,

                system: systemPrompt,

                max_tokens: 4096,

                messages: [

                    {
                        role: "user",
                        content: prompt
                    }

                ]

            });

            return response.content?.[0]?.text || "";

        } catch (error) {

            if (error.status === 401) {
                throw new Error("Invalid Anthropic API Key.");
            }

            if (error.status === 403) {
                throw new Error("Anthropic access denied.");
            }

            if (error.status === 404) {
                throw new Error(`Model "${this.model}" not found.`);
            }

            if (error.status === 429) {
                throw new Error("Anthropic rate limit exceeded.");
            }

            throw new Error(`Anthropic Error: ${error.message}`);

        }

    }

}

module.exports = AnthropicProvider;