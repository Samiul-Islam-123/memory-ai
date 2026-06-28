const { estimateTokens } = require('../utils/UtilityFunctions');

class WorkingMemory {
    constructor({ maxTokens = 2000 }) {
        this.maxTokens = maxTokens
        this.currentTokens = 0;
        this.memory = [];
    }

    readWorkingMemory() {

        return this.memory;
    }

    writeWorkingMemory(data) {



        const totalTokens =
            estimateTokens(data.user) +
            estimateTokens(data.model);

        data.totalTokens = totalTokens;


        this.memory.push(data);



        this.currentTokens += totalTokens;

        while (
            this.currentTokens > this.maxTokens &&
            this.memory.length > 0
        ) {
            ("[DEBUG] Token limit reached")
            const removed = this.memory.shift();
            this.currentTokens -= removed.totalTokens;
        }

    }
}

module.exports = WorkingMemory