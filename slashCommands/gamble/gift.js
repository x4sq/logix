const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const mongo = require('mongoose');
const shortNumber = require('short-number');

module.exports = {
	name: 'gift',
	description: "Send your friends gifts of gems!",
	type: ApplicationCommandType.ChatInput,
	cooldown: 60000,
	run: async (client, interaction) => {

	}
}