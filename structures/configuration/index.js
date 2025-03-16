require('dotenv').config();

module.exports = {
    client_token: process.env.token,
    client_id: process.env.botId,
    client_prefix: "!",
    mongodb_url: process.env.mongodbURL, //optional
    developers: process.env.botCreator,
    sharding: false,
    database: true,
}

/**
 * Get discord bot token from here https://discord.com/developers/applications
 * Get mongodb url from https://www.mongodb.com/
 */