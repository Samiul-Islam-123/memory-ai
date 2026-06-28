const LLMProvider = require("../LLMProviders/LLMProvider");

class VectorEngine {
    constructor({ embedding_model_config }) {

        this.embedding_model = new LLMProvider({
            model: embedding_model_config.model,
            provider: embedding_model_config.provider,
            apiKey: embedding_model_config.apiKey
        })
    }

    //to generate embeddings
    async generateEmbeddings(data) {
        return (await this.embedding_model.generateEmbeddings(data));
    }


    //to search similarity between two vectors
    cosineSimilarity(vectorA, vectorB) {

        if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
            throw new Error("Both inputs must be arrays.");
        }

        if (vectorA.length !== vectorB.length) {
            throw new Error("Embedding dimensions do not match.");
        }

        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;

        for (let i = 0; i < vectorA.length; i++) {

            dotProduct += vectorA[i] * vectorB[i];

            magnitudeA += vectorA[i] * vectorA[i];

            magnitudeB += vectorB[i] * vectorB[i];

        }

        magnitudeA = Math.sqrt(magnitudeA);
        magnitudeB = Math.sqrt(magnitudeB);

        if (magnitudeA === 0 || magnitudeB === 0) {
            return 0;
        }

        return dotProduct / (magnitudeA * magnitudeB);

    }

    async search({
        query,
        memories,
        topK = 3,
        threshold = 0.55
    }) {

        const queryEmbedding =
            await this.generateEmbeddings(query);

        const matches = [];

        for (const memory of memories) {

            const similarity = this.cosineSimilarity(
                queryEmbedding,
                memory.embedding
            );

            if (similarity >= threshold) {

                matches.push({
                    similarity,
                    memory
                });

            }

        }

        matches.sort(
            (a, b) => b.similarity - a.similarity
        );

        return matches.slice(0, topK);

    }

    //to make descision whether to insert, or udpate or just ignore in memory
    async resolveMemoryAction({
        memory,
        memories,
        insertThreshold = 0.75,
        updateThreshold = 0.90,
        ignoreThreshold = 0.98
    }) {

        if (memories.length === 0) {
            return {
                action: "insert",
                score: 0,
                index: -1
            };
        }

        let bestScore = -1;
        let bestIndex = -1;

        for (let i = 0; i < memories.length; i++) {

            const score = this.cosineSimilarity(
                memory,
                memories[i]
            );

            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }

        }

        if (bestScore >= ignoreThreshold) {
            return {
                action: "ignore",
                score: bestScore,
                index: bestIndex
            };
        }

        if (bestScore >= updateThreshold) {
            return {
                action: "update",
                score: bestScore,
                index: bestIndex
            };
        }

        return {
            action: "insert",
            score: bestScore,
            index: bestIndex
        };

    }

}

module.exports = VectorEngine;