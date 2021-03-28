const config = require("./config.js");
// const ui = require("./ui.js");
const effectsList = require("./effects.json");
const osc = require("node-osc");
const oscClient = new osc.Client(config.network.host, config.network.port);
const oscAddr = config.network.address;
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
tidal.stdout.on('data', (data) => { console.log(`tidal: ${String(data).trim()}`) });

tidal.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});



// ui.render();

function updateUI() {
  for ([i, connection] of connections.entries()) {
    ui.addConnection(i, connection)
  }
}

function handleNewMessage(msg, username) {
    // updateUI()
  msg = msg.substr(msg.indexOf(" ") + 1)
  console.log(username);
  tidal.stdin.write(msg + "\n");
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
  }
}

function onConnectedHandler (addr, port) {
  // ui.onTwitchConnected(addr, port)
  console.log(`connected on ${addr}:${port}`);
}
