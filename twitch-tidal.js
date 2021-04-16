const config = require("./config.js");
const PatternHandler = require("./pattern-handler.js");
const tmi = require("tmi.js");
const { spawn } = require('child_process');

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

function handleNewMessage(username, msg) {

  const connections = patternHandler.updateConnections(username, msg);

  for ([i, connection] of connections.entries()) {
    tidal.stdin.write(`d${i + 1} \$ ${connection.pattern}\n`);
  }

  console.log(connections);

  return msg;
}

function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // ignore messages from the bot

  // get first 'word' (all chars until whitespace)
  const commandName = msg.split(' ')[0]

  switch (commandName) {
    case "!t":
      const result = handleNewMessage(context.username, msg);
      twitchClient.say(target, result);
      break;
    // username as argument (for multiuser debug/testing only)
    // e.g. `!u kuhn msg` to pretend to be user 'kuhn'
    case "!u":
      const tmsg = msg.split(' ');
      const user = tmsg.splice(1, 1);
      handleNewMessage(user.join(' '), tmsg.join(' '));
      break;
  }
}

function onConnectedHandler(addr, port) {
  console.log(`connected on ${addr}:${port}`);
}
