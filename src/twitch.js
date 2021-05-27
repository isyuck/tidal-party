import tmi from "tmi.js";

// local
import config from "../config/config.js";

// setup a twitch client using the config file
const client = new tmi.client(config.twitch);

// connect the client to twitch
export function connect() {
    client.connect().catch((err) => {
        // console.log(`error: ${err}. check your configuration!`);
    });
};

export function onConnect(fn) {
    client.on("connected", fn);
};

export function onMessage(fn) {
    client.on("message", fn);
};

export function say(target, msg) {
    client.say(target, msg);
}
