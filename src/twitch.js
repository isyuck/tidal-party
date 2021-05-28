const tmi = require("tmi.js")

// local
const config = require("../config/config.js");

// setup a twitch client using the config file
const client = new tmi.client(config.twitch);

// connect the client to twitch
const connect = () => {
    client.connect().catch((err) => {
        // console.log(`error: ${err}. check your configuration!`);
    });
};

const onConnect = (fn) => {
    client.on("connected", fn);
};

const onMessage = (fn) => {
    client.on("message", fn);
};

const say = (target, msg) => {
    client.say(target, msg);
}

exports.connect = connect;
exports.onConnect = onConnect;
exports.onMessage = onMessage;
exports.say = say;
