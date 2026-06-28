function extractJSON(text) {

    if (!text || typeof text !== "string") {
        throw new Error("Expected a string.");
    }

    // Remove ```json and ```
    const cleaned = text
        .replace(/```json\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

    return JSON.parse(cleaned);
}

function estimateTokens(text) {
    return Math.ceil(text.split(/\s+/).length * 1.3);
}

module.exports = {extractJSON, estimateTokens};