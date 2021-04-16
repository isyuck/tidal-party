module.exports = class PatternHandler {
    constructor(mode, maxActivePatterns) {
        this.mode = mode;   // decides pattern update algorithm
        this.patterns = []; // the current list of active patterns
        this.maxActivePatterns = maxActivePatterns;
    }

    // pass a pattern & user pair, and get a new list of pattern
    // & user pairs. uses 'mode' to decide which algorithm to use
    update(current) {
        const len = this.patterns.length;
        if (this.mode == 0) {
            if (!len) {
                this.patterns.push(current);
            } else if (len < this.maxActivePatterns) {
                let match = false;
                for (let pattern of this.patterns) {
                    if (pattern.user === current.user) {
                        Object.assign(pattern, current);
                        match = true;
                        break;
                    }
                }
                if (!match) { this.patterns.push(current) }
            } else if (len === config.maxActivePatterns) {
                this.patterns.push(current);
                this.patterns.shift();
            }
            return this.patterns;
        }

        // no mode match
        return this.patterns;
    }
}
