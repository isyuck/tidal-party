// client id guusv7otlopu3dlprk9tpoijs6hf4j

// let socket;
// var io = require('socket.io')(8081);
const osc = require('node-osc');
const client = new osc.Client('127.0.0.1', 3333);
const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: "botforctrlav",
    password: "oauth:<insert oauth here>"
  },
  channels: [
    "ctrlav"
  ]
};

const commands = {
  about: "ctrlAV is an ecosystem for audiovisual performers and their audiences to try new things and brainstorm for a new tomorrow",
  today: "Kickoff Talk",
  commands: () => {
    return Object.keys(commands)
      .map((command) => " !" + command)
    },
  schedule: "The livestream schedule is 8-10pm EST (+5 UTC) on Thursdays, but the topics have not been decided yet",
  zork: "West of House This is an open field west of a white house, with a boarded front door. There is a small mailbox here. A rubber mat saying 'Welcome to Zork!' lies by the door.",
  osc: "sending osc message"
}

// Create a client with our options
const client2 = new tmi.client(opts);

// Register our event handlers (defined below)
client2.on('message', onMessageHandler);
client2.on('connected', onConnectedHandler);

// Connect to Twitch:
client2.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  let pattern;

if (msg.includes('\"')){
  let firstQuote = msg.indexOf('\"') + 1;
  let secondQuote = msg.lastIndexOf('\"')
   pattern = msg.substring(firstQuote, secondQuote);
}
  
if (msg.includes("osc")) {msg = '!osc'};
  // Remove whitespace from chat message
  const commandName = msg.trim();

  switch(commandName) {
    case '!today':
      client2.say(target, `Today's topic is ${commands.today}`);
      console.log(`ran ${commandName}`);
      break;
    case '!commands':
      client2.say(target, `Available commands are ${commands.commands()}`)
      console.log(`ran ${commandName}`);
      break;
    case '!about':
      client2.say(target, commands.about)
      console.log(`ran ${commandName}`);
      break;
    case '!schedule':
      client2.say(target, commands.schedule)
      console.log(`ran ${commandName}`);
      break;
    case '!zork':
      client2.say(target, commands.zork)
      break;
    case "!osc":
      client2.say(target, commands.osc);
      client.send('/oscAddress', pattern, () => {
      });
      break;
    default:
      console.log("Not a recognized command");
  }
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
