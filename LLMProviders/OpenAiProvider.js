const OpenAI = require("openai");

class OpenAIProvider {

    constructor({ model, apiKey }) {

        if (!model) {
            throw new Error("OpenAI model is required.");
        }

        if (!apiKey) {
            throw new Error("OpenAI API key is required.");
        }

        this.model = model;

        this.client = new OpenAI({
            apiKey
        });
    }

    async generate({prompt, systemPrompt}) {

        try {

            if (!prompt || typeof prompt !== "string") {
                throw new Error("Prompt must be a non-empty string.");
            }

            const response = await this.client.chat.completions.create({

                model: this.model,

                messages: [

                    {
                        role: "system",
                        content: systemPrompt
                    },

                    {
                        role: "user",
                        content: prompt
                    }

                ]

            });

            return response.choices?.[0]?.message?.content || "";

        } catch (error) {

            if (error.status === 401) {
                throw new Error("Invalid OpenAI API Key.");
            }

            if (error.status === 429) {
                throw new Error("OpenAI rate limit exceeded.");
            }

            if (error.status === 404) {
                throw new Error(`Model "${this.model}" not found.`);
            }

            throw new Error(
                `OpenAI Error: ${error.message}`
            );
        }

    }

}

module.exports = OpenAIProvider;