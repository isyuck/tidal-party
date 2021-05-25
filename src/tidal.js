import { spawn } from "child_process";

// local
import config from "../config/config.js";

// spawn tidal either with ghci or safe-tidal-cli
const tidal = config.safeTidal
    ? spawn("safe-tidal-cli")
    : spawn("ghci", ["-ghci-script", config.ghci.path]);

export function start() {

    tidal.stdout.on("data", (data) => {
        console.log(`${data}`);
    });

    tidal.stderr.on("data", (data) => {
        console.error(`error: ${data}`);
    });
}

// takes a list of patterns and writes them to tidal's stdin.
// it also replaces the capital X in the prepend string with i
export function writePatterns(patterns, prepend) {
    for (let [i, p] of patterns.entries()) {
        let np = prepend.replace('X', `${i + 1}`)
        write(`${np} \$ ${p.pattern}`);
    }
}

// wrap stdin write, and add some newlines
export function write(data) {
    tidal.stdin.write(`${data}\n\n`);
}
