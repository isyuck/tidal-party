module.exports = {
  twitch: {
    identity: {
            username: "ctrlav",
            password: "oauth:qd7jnx0vsna81703f2ewx6glj5qh0n",
        },
        channels: [
            "ctrlav"
        ],
  },
  ghci: {
    path: "BootTidal.hs",
  },
  maxActivePatterns: 8,
  algorithm: 0,
  expiration: 8,
  safeTidal: true, // use jwaldmann/safe-tidal-cli (recommended)
};
