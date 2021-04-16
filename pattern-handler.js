module.exports = class PatternHandler {
    constructor(mode, maxActivePatterns) {
        this.mode = mode;
        this.connections = [];
        this.maxActivePatterns = maxActivePatterns;
    }

    updateConnections(user, msg) {
        if (this.mode == 0) {
            let current = ({
                user: user, pattern: msg = msg.substr(msg.indexOf(" ") + 1)
            });

            if (!this.connections.length) {
                this.connections.push(current);
            } else if (this.connections.length < this.maxActivePatterns) {
                let match = false;
                for (connection of this.connections) {
                    if (connection.user === current.user) {
                        Object.assign(connection, current);
                        match = true;
                        break;
                    }
                }
                if (!match) { this.connections.push(current) }

            } else if (this.connections.length === config.maxActivePatterns) {
                // remove last sent connection and replace with the new one
                this.connections.push(current);
                this.connections.shift();
            }
            return this.connections;
        }
        return this.connections;
    }
}
