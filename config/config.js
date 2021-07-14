exports.config = {
  twitch: {
    identity: {
      username: "ctrlav",
      password: "oauth:1i7ylkznxdpr5jc4gijpp4s9r37ais",
    },
    options: {
      debug: false,
      messagesLogLevel: "info"
    },
    connection: {
      reconnect: true,
      secure: true,
    },
    channels: ["ctrlav"],
  },
  ghci: {
    path: "config/BootTidal.hs",
  },
  maxActivePatterns: 8,
  algorithm: 0,
  expiration: 8,
  safeTidal: false,
}
