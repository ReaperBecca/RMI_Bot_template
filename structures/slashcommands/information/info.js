const { Client, CommandInteraction, AttachmentBuilder } = require("discord.js");
const userAccount = require("../../functions/userAccount");
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    name: "info",
    description: "Get stats for yourself.",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        const userId = interaction.user.id;
        
        try {
            // First, ensure the user data exists by fetching it
            await userAccount.userManager.fetchUser(userId);
            
            // Get the path to the user's data file
            const dbPath = path.join(__dirname, '../../../../../Database');
            const userDataPath = path.join(dbPath, 'userData');
            const userFilePath = path.join(userDataPath, `${userId}.json`);
            
            // Read the file
            const userData = await fs.readFile(userFilePath, 'utf8');
            
            // Create a formatted version for display
            const formattedData = JSON.stringify(JSON.parse(userData), null, 2);
            
            // Create an attachment with the user data
            const attachment = new AttachmentBuilder(
                Buffer.from(formattedData), 
                { name: `user_${userId}.json` }
            );
            
            return interaction.reply({
                content: `<@${userId}>, here's your user data:`,
                files: [attachment]
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            return interaction.reply({
                content: `Sorry, I couldn't retrieve your user data. Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
}
