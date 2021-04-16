const config = require("./config.js");
const tmi = require("tmi.js");
const { spawn } = require('child_process');
const algorithms = require("./algorithms.js");

// the list of all active patterns
let patterns = [];

// twitch
const twitchClient = new tmi.client(config.twitch);
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);
twitchClient.connect();

// tidal
const tidal = spawn('ghci', ['-ghci-script', config.ghci.path]);
tidal.stdout.on('data', (data) => { console.log(`tidal ${String(data).trim()}`) });
tidal.stderr.on('data', (data) => { console.error(`stderr: ${data}`); });

function handleNewMessage(user, msg) {

  // parse twitch message into object
  const latest = ({ user: user, pattern: msg = msg.substr(msg.indexOf(" ") + 1) });

  // don't use an algo that doesn't exist
  if (config.algorithm < algorithms.length) {
    // use an algorithm to update the list of active patterns
    patterns = algorithms[config.algorithm](latest, patterns, config.maxActivePatterns);

    // send patterns to tidal
    for ([i, p] of patterns.entries()) {
      tidal.stdin.write(`d${i + 1} \$ ${p.pattern}\n`);
    }

    console.log(patterns);
    return `@${user}: ${msg}`;
  } else {
    console.log(`no algorithm at index ${config.algorithm}, try a number less than ${algorithms.length}`);
  }
  return "";
}

function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // ignore messages from the bot

  // get first 'word' (all chars until whitespace)
  const commandName = msg.split(' ')[0]
  let result = "";

  switch (commandName) {
    case "!t":
      result = handleNewMessage(context.username, msg);
      break;
    // username as argument (for multiuser debug/testing only)
    // e.g. `!u kuhn msg` to pretend to be user 'kuhn'
    case "!u":
      const tmsg = msg.split(' ');
      const user = tmsg.splice(1, 1);
      result = handleNewMessage(user.join(' '), tmsg.join(' '));
      break;
  }

  twitchClient.say(target, result);
}

function onConnectedHandler(addr, port) {
  console.log(`connected on ${addr}:${port}`);
}
