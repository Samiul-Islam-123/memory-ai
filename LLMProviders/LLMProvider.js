const AnthropicProvider = require("./AnthropicProvider");
const GeminiProvider = require("./GeminiProvider");
const OpenAIProvider = require("./OpenAIProvider");

const PROVIDERS = {
    openai: OpenAIProvider,
    google: GeminiProvider,
    anthropic: AnthropicProvider
};

class LLMProvider {

    constructor({ model, provider, apiKey }) {


        const Provider = PROVIDERS[provider];

        if (!Provider) {
            throw new Error(`Unsupported provider: ${provider}`);
        }

        this.llm = new Provider({
            model,
            apiKey
        });

    }

    async generate(prompt, systemPrompt) {
        try{

            return await this.llm.generate({
                prompt,
                systemPrompt
            });
        }catch(error){
            throw error
        }

    }

    async generateEmbeddings(text){
        try{

            return await this.llm.embed(text);
        }catch(error){
            throw error
        }
    }

}

module.exports = LLMProvider;