const { Client, CommandInteraction, ActionBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const UserDataManager = require('../../classes/userDataClass');

module.exports = {
    name: "altuser",
    description: "Manage your alt user accounts and groups.",

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction) => {
        const userId = interaction.user.id;
        const userManager = new UserDataManager();

        // Fetch user data using the UserDataManager
        const userData = await userManager.fetchUser(userId);

        // Get altUsers array from userData
        const altUsers = userData.altUsers || [];

        // Create embed for response
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Alt User Management')
            .setDescription(`User: ${interaction.user.tag}`)
            .setTimestamp();
        
        // Check if user has any alt groups
        const hasAltGroups = altUsers.length > 0;

        if (hasAltGroups) {
            // Format alt groups for display
            const groupDisplay = altUsers.map(group => {
                if (typeof group === 'object' && group.name) {
                    const userCount = Array.isArray(group.users) ? group.users.length : 0;
                    return `${group.name} (${userCount} users)`;
                }
                return 'Unamed Group';
            }).join('\n');
            
            embed.addFields(
                { name: 'Alt Groups', value: groupDisplay }
            );
        } else {
            embed.addFields(
                { name: 'Alt Groups', value: 'No alt groups found.' }
            );
        }

        // Create buttons
        const row = new ActionBuilder();

        // Button 1: Add Alt Group (always enabled)
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('add_alt_group')
                .setLabel('Add New Group')
                .setStyle(ButtonStyle.Primary)
        );

        // Only add these  buttons if the user has alt groups
        if (hasAltGroups) {
            // Button 2: Remove Alt Group (enabled if user has alt groups)
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_alt_group')
                    .setLabel('Edit Group')
                    .setStyle(ButtonStyle.Secondary)
            );
            
            // Button 3: Delete alt user group
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('delete_alt_group')
                    .setLabel('Delete Group')
                    .setStyle(ButtonStyle.Danger)
            );
            
            // Button 4: Set main group
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('set_main_group')
                    .setLabel('Set Main Group')
                    .setStyle(ButtonStyle.Success)
            );
        }

        // Create second row for remaining buttons if needed
        const row2 = new ActionRowBuilder();
        
        if (hasAltGroups) {
            // Button 5: Set main user
            row2.addComponents(
                new ButtonBuilder()
                    .setCustomId('set_main_user')
                    .setLabel('Set Main User')
                    .setStyle(ButtonStyle.Success)
            );
            
            // Button 6: Set next alt user
            row2.addComponents(
                new ButtonBuilder()
                    .setCustomId('set_next_alt')
                    .setLabel('Set Next Alt')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        
        // Send the response with buttons
        const components = hasAltGroups ? [row, row2] : [row];
        
        return interaction.reply({
            embeds: [embed],
            components: components,
            ephemeral: true
        });
    }
}


/**
 * // Mock function to fetch user data - replace with actual implementation
async function fetchUserData(userId) {
    // This would be replaced with your actual database query
    // For now, return mock data or null
    return null; // Change to mock data to test with groups
    
     Example mock data:
    return {
        userId: userId,
        altGroups: [
            { name: "Gaming Accounts", users: ["user1", "user2"] },
            { name: "Work Accounts", users: ["user3"] }
        ]
    };
    
}
 */