const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const mongo = require('mongoose');
const shortNumber = require('short-number');

module.exports = {
	name: 'blackjack',
	description: "Play against a dealer and gamble your gems in Blackjack.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 20000,
	run: async (client, interaction) => {

	}
}