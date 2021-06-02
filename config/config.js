exports.config = {
  twitch: {
    identity: {
      username: "YOUR_BOT_USERNAME",
      password: "YOUR_BOT_OATH",
    },
    channels: ["isyuck"],
    options: {
      debug: false,
      messagesLogLevel: "info"
    },
    connection: {
      reconnect: true,
      secure: true,
    },
    channels: ["YOUR_CHANNEL"],
  },
  ghci: {
    path: "config/BootTidal.hs",
  },
  maxActivePatterns: 8,
  algorithm: 0,
  expiration: 8,
  safeTidal: true,
}
