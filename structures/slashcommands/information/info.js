const { Client, CommandInteraction } = require("discord.js")
const userAccount = require("../../functions/userAccount");

module.exports = {
    name: "info",
    description: "Get stats for yourself.",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        const user = interaction.user.id
        return interaction.reply(`<@${user}>!\n ${JSON.stringify(userAccount, null, 2)}`);
    }
}