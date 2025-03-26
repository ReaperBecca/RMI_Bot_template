const config = require('../configuration/index');
const { logger } = require('../functions/logger');
const localDb = require('./localDbHandler');

const connect = async () => {
    console.log("\n---------------------");

    if (config.database) {
        try {
            await localDb.initialize();
            logger("Local database initialized", "success");

        } catch (error) {
            logger(`DatabasLocal database initialization failed: ${error}`, "error");
        }
    } else {
        logger("Database integration disabled in config", "info");
    }

    console.log("---------------------");
    return;
}

module.exports = { connect };