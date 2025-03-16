const wait = require("node:timers/promises").setTimeout;
const { Client, CommandInteraction } = require("discord.js")

module.exports = {
    name: "delete",
    description: "Replies, then does something else",

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */

    run: async (client, interaction) => {
        await interaction.reply(`<@152322669214171145>`)
        await wait(2000)
        await interaction.deleteReply()
    }
}