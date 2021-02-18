const osc = require('node-osc');
const oscClient = new osc.Client('127.0.0.1', 6060);
const tmi = require('tmi.js');
const maxActiveConnections = 4; // pattern limit
const oscAddr = "/ctrl"
const effectsList = require("./effects.json")
const ui = require("./ui.js")

// twitch configuration
const opts = {
  identity: {
    username: "YOUR_BOT_ACCOUNT",
    password: "YOUR_TWITCH_OAUTH",
  },
  channels: [
    "YOUR_CHANNEL_NAME"
  ]
};

const twitchClient = new tmi.client(opts);

twitchClient.on('message', onMessageHandler);
twitchClient.on('connected', onConnectedHandler);

twitchClient.connect();

ui.render();

let connections = []

function updateUI() {
  for ([i, connection] of connections.entries()) {
    ui.addConnection(i, connection)
  }
}

function parseMessage(msg) {
  let current = ({pattern: "", effects:{name: "", pattern: ""}});

  let match = msg.match(/"(.*?)"/)
  current.pattern = match[1]

  const effectPairs = msg.split('# ')
  let effects = []
  effectPairs.shift() // remove first pattern
  for (pair of effectPairs) {
    pair = pair.split(' ')
    const name = pair.shift()
    const pat = pair.join(" ").replace(/"/g, "").trim()
    effects.push({name: name, pattern: pat})
  }
  current.effects = effects;

  return current
}

function handleNewMessage(msg, username) {


  try {
    // common messages
       // empty
    if (msg === "!t" || msg === "" || msg === " " || msg === "\"\"" || !msg) { return `error: pattern from ${username} empty, maybe try !t \"bd sn cp hh\" ?` }
       // single quote
    if (msg === "\"") { return `error: could not parse pattern ${msg} from ${username}` }
       // help
    if (msg === "help") {return `usage: !t \"pattern\" | example: !t \"bd sn cp hh\" | !osc silence`}

       // silence user's pattern
    if (msg === "silence") {
      for ([i, connection] of connections.entries()) {
        if (connection.user === username) {
          oscClient.send(oscAddr, "p" + i, "")
          connections.splice(i, 1)
          updateUI()
          return `silenced ${username}'s pattern`;
        }
      }
    }

    // replace other double quotes with "" (related to mobile)
    msg = msg.replace(/”|“/g, "\"") //

    const parsed = parseMessage(msg)
    let current = ({user: username, pattern: parsed.pattern, effects: parsed.effects})

    if (connections.length === 0) { 
      // if there are no connections just add the new connection
      connections.push(current)
    } else if (connections.length < maxActiveConnections){
      let match = false;
      for (connection of connections) {
        // if the user already has a connection
        if (connection.user === current.user) {
          Object.assign(connection, current)
          match = true;
          break;
        }
      }
      if (!match) { connections.push(current) }
    } else if (connections.length === maxActiveConnections) {
      // remove last sent connection and replace with the new one
      connections.push(current)
      connections.shift()
    }

    // prep osc messages
    let messages = []
    for ([i, connection] of connections.entries()) {
      let patternMsg = new osc.Message(oscAddr) // for 's'
      patternMsg.append(`p${i}`)
      patternMsg.append(connection.pattern)

      // update local effects list with values from connection
      let localEffectsList = JSON.parse(JSON.stringify(effectsList))
      for (listEffect of localEffectsList) {
        for (const connectionEffect of connection.effects) {
          if (connectionEffect.name === listEffect.name) {
            listEffect.pattern = connectionEffect.pattern
          }
        }
      }

      let effectMsgs = []

      for (const listEffect of localEffectsList) {
        let effectMsg = new osc.Message(oscAddr)  // for gain, speed etc
        effectMsg.append(`p${i}-${listEffect.name}`)
        effectMsg.append(listEffect.pattern)
        effectMsgs.push(effectMsg)
      }

      messages.push({pattern: patternMsg, effects: effectMsgs})
    }


    // send osc messages
    for (const message of messages) {
      oscClient.send(message.pattern ,() => {});
      if (message.effects.length) {
        for (const me of message.effects)
        oscClient.send(me, () => {});
      }
    }

    updateUI()

    return `pattern "${current.pattern}" from ${current.user} sent`
  } catch (err) {
    return `${err.name} in message from ${username}, try checking your syntax?`
  }

  try {
    return `unknown error! try checking your syntax, ${username}`
  } catch (err) {
    return `unknown error! check your syntax?`
  }
}

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // ignore messages from the bot

  // get first 'word' (all chars until whitespace)
  const commandName = msg.split(' ')[0]

  switch(commandName) {
    case "!t":
      const result = handleNewMessage(msg.substr(msg.indexOf(" ") + 1), context.username);
      twitchClient.say(target, result);
      break;
  }
}

function onConnectedHandler (addr, port) {
  ui.onTwitchConnected(addr, port)
}
