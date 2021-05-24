module.exports = {
  twitch: {
    identity: {
      username: "YOUR_BOT_USERNAME",
      password: "YOUR_BOT_OATH",
    },
    channels: ["YOUR_CHANNEL"],
  },
  // only applies if safeTidal is false
  ghci: {
    path: "BootTidal.hs",
  },
  maxActivePatterns: 8,
  algorithm: 0,
  expiration: 8,
  safeTidal: true, // use jwaldmann/safe-tidal-cli (recommended)
};
