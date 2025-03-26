const UserDataManager = require('../../classes/userDataClass');
const client = require("../../client");
const localDb = require("../../database/localDbHandler");
const userManager = new UserDataManager();

client.on("messageCreate", async (message) => {
    try {
        // Get user data directly from storage
        const userData = await userManager.fetchUser(message.author.id);

        // Update stats
        userData.ttlMsgs = (userData.ttlMsgs || 0) + 1;
        userData.ttlWords = (userData.ttlWords || 0) + message.content.split(" ").length;
        userData.ttlChrs = (userData.ttlChrs || 0) + message.content.length;

        // Save directly to storage
        await localDb.saveData('userData', userData.userId, userData);
    } catch (error) {
        console.error("Error processing message for user data:", error);
    }
});

client.on("interactionCreate", async (interaction) => {
    try {
        // Get user data directly from storage
        const userData = await userManager.fetchUser(interaction.user.id);

        // Update stats
        userData.ttlInt = (userData.ttlInt || 0) + 1;

        if (interaction.isButton()) {
            userData.ttlBttn = (userData.ttlBttn || 0) + 1;
        }

        // Save directly to storage
        await localDb.saveData('userData', userData.userId, userData);
    } catch (error) {
        console.error("Error processing interaction for user data:", error);
    }
});




