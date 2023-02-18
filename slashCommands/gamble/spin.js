const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')
const mongo = require('mongoose');

module.exports = {
    name: 'spin',
    description: "Spin your gems with a chance of winning or losing.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 1000,
    options: [
        {
                    name: 'amount',
                    description: 'Amount of gems to bet.',
                    type: 3,
                    required: true
                }
            ],
    run: async (client, interaction) => {
    
    }
};
