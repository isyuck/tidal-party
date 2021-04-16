const config = require("./config.js");
const tmi = require("tmi.js");
const { spawn } = require('child_process');
const PatternHandler = require("./pattern-handler.js");
const patternHandler = new PatternHandler(config.mode, config.maxActivePatterns);

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

  // get a new list of patterns
  const patterns = patternHandler.update({
    user: user, pattern: msg = msg.substr(msg.indexOf(" ") + 1)
  });

  for ([i, p] of patterns.entries()) {
    tidal.stdin.write(`d${i + 1} \$ ${p.pattern}\n`);
  }

  console.log(patterns);
  return `@${user}: ${msg}`;
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
