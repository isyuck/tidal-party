const config = require("./config.js");
// const ui = require("./ui.js");
const tmi = require("tmi.js");
const { spawn } = require('child_process');

let connections = [];

// twitch
const twitchClient = new tmi.client(config.twitch);
twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);
twitchClient.connect();

// tidal
const tidal = spawn('ghci', ['-ghci-script', config.ghci.path]);
tidal.stdout.on('data', (data) => { console.log(`tidal ${String(data).trim()}`) });

tidal.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// ui.render();

// function updateUI() {
//   for ([i, connection] of connections.entries()) {
//     ui.addConnection(i, connection)
//   }
// }

function handleNewMessage(msg, username) {
  // updateUI()
  msg = msg.substr(msg.indexOf(" ") + 1);

  let current = ({ user: username, pattern: msg });

  if (!connections.length) {
    connections.push(current);
  } else if (connections.length < config.maxActivePatterns) {
    let match = false;
    for (connection of connections) {
      if (connection.user === current.user) {
        Object.assign(connection, current);
        match = true;
        break;
      }
    }
    if (!match) { connections.push(current) }
  } else if (connections.length === config.maxActivePatterns) {
    // remove last sent connection and replace with the new one
    connections.push(current)
    connections.shift()
  }

  for ([i, connection] of connections.entries()) {
    tidal.stdin.write(`d${i + 1} \$ ${connection.pattern}\n`);
  }

  console.log(connections);

  return msg;
}

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // ignore messages from the bot

  // get first 'word' (all chars until whitespace)
  const commandName = msg.split(' ')[0]

  switch(commandName) {
    case "!t":
      const result = handleNewMessage(msg, context.username);
      twitchClient.say(target, result);
      break;
      // username as argument (for multiuser debug/testing only)
      // e.g. `!u kuhn msg` to pretend to be user 'kuhn'
    case "!u":
      const tmsg = msg.split(' ');
      const user = tmsg.splice(1, 1);
      handleNewMessage(tmsg.join(' '), user.join(' '));
      break;
  }
}

function onConnectedHandler (addr, port) {
  // ui.onTwitchConnected(addr, port)
  console.log(`connected on ${addr}:${port}`);
}
