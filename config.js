const config = {
    twitch: {
        identity: {
            username: "YOUR_BOT_ACCOUNT",
            password: "YOUR_TWITCH_OAUTH",
        },
        channels: [
            "YOUR_CHANNEL_NAME"
        ],
    },
    network: {
        host: "127.0.0.1",
        address: "/ctrl",
        port: 6060,
    },
    ghci: {
        path: "BootTidal.hs"
    },
    maxActivePatterns: 8,
};

module.exports = config;
