const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'uptime',
	description: "Check bot's uptime.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
        const seconds = Math.round(Date.now() / 1000);
        await interaction.reply(
          `Bot has been up since <t:${Math.round(
            seconds - process.uptime()
          )}:R>`
        );
	}
};