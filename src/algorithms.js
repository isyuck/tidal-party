// an array of functions that take a new pattern & user pair, a
// list of all current patterns & user pairs, and the max active
// patterns, and returns a new list of pattern & user pairs
exports.algorithms = [
  // algorithm[0] // simple stack //
  // add patterns until maxlen is reached, then replace the
  // oldest pattern with the newest.
  (latest, all, maxlen) => {
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
      all.push(latest).shift();
    }
    return all;
  },
  // add new algorithms here
];
