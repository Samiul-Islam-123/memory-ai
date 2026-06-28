function extractJSON(text) {

    if (!text || typeof text !== "string") {
        return { memories: [] };
    }

    try {
        // Remove ```json and ```
        const cleaned = text
            .replace(/```json\s*/i, "")
            .replace(/```\s*$/i, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.warn("[MemoryEngine] JSON Parse Error in extractJSON. Returning empty memories.", error.message);
        return { memories: [] };
    }
}

function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.toString().split(/\s+/).length * 1.3);
}

module.exports = {extractJSON, estimateTokens};