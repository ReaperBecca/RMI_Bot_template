const { Client, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const UserDataManager = require('../../classes/userDataClass');
const fs = require('fs');
const path = require('path');

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
        const row = new ActionRowBuilder();

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
        
        

        // Create button collector
        const collector = Response.createMessageComponentCollector({
            time: 300000 // 5 minutes
        });

        // Load button handlers
        const buttonHandlers = new Map();
        const buttonPath = path.join(__dirname, 'altUser_Buttons');

        try {
            const buttonFiles = fs.readdirSync(buttonPath);

            for (const file of buttonFiles) {
                if (file.endsWith('.js')) {
                    const buttonHandler = require(path.join(buttonPath, file));
                    if (buttonHandler.customId) {
                        buttonHandlers.set(buttonHandler.customId, buttonHandler);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading button handlers:', error);
        }

        // Handle button interactions
        collector.on('collect', async (buttonInteraction) => {
            const handler = buttonHandlers.get(buttonInteraction.customId);

            if (handler) {
                try {
                    await handler.run(client, buttonInteraction, userData);
                } catch (error) {
                    console.error(`Error executing button handler for ${buttonInteraction.customId}:`, error);
                    await buttonInteraction.reply({
                        content: 'There was an error processing your request.',
                        ephemeral: true
                    }).catch(console.error);
                }
            } else {
                await buttonInteraction.reply({
                    content: 'This button is not yet implemented.',
                    ephemeral: true
                }).catch(console.error);
            }
        });

        collector.on('end', () => {
            // Update the message to show that the buttons are no longer active
            const disabledRow = new ActionRowBuilder()
                .addComponents(
                    row.components[0].setDisabled(true)
                );

            const disabledComponents = [disabledRow];

            if (hasAltGroups) {
                const disabledRow1 = new ActionRowBuilder();
                row.components.slice(1).forEach(component => {
                    disabledRow1.addComponents(component.setDisabled(true));
                });

                const disabledRow2 = new ActionRowBuilder();
                row2.components.forEach(component => {
                    disabledRow2.addComponents(component.setDisabled(true));
                });

                disabledComponents.push(disabledRow1, disabledRow2);
            }

            interaction.editReply({
                components: disabledComponents
            }).catch(console.error);
        });

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