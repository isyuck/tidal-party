// an array of functions that take a new pattern & user pair, a
// list of all current patterns & user pairs, and the max active
// patterns, and returns a new list of pattern & user pairs
const algorithm = [
    // algorithm[0] // simple user stack. add patterns until
    // maxlen is reached, then replace the oldest pattern
    // with the newest.
    function(latest, all, maxlen) {
        if (!all.length) {
            all.push(latest);
        } else if (all.length < maxlen) {
            let match = false;
            for (let p of all) {
                if (p.user === latest.user) {
                    Object.assign(p, latest);
                    match = true;
                    break;
                }
            }
            if (!match) { all.push(latest) }
        } else if (all.length === maxlen) {
            all.push(current);
            all.shift();
        }
        return all;
    },
    // add new algorithms here
];

module.exports = class PatternHandler {
    constructor(mode, maxActivePatterns) {
        this.mode = mode;   // decides pattern update algorithm
        this.patterns = []; // the current list of active patterns
        this.maxActivePatterns = maxActivePatterns;
    }

    // pass a pattern & user pair, and get a new list of pattern & user pairs
    update(latest) {
        this.patterns = algorithm[this.mode](latest, this.patterns, this.maxActivePatterns);
        return this.patterns;
    }
}
