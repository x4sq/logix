const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const mongo = require('mongoose');
const shortNumber = require('short-number');

module.exports = {
	name: 'daily',
	description: "Claim your 25M daily gems.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 86400000,
	run: async (client, interaction) => {
		balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            if(err) throw err;

			if(!data){
                await balSchema.create({
                    UserID: interaction.user.id,
                    Balance: 0
                })
			}
				let bal = data.Balance
				const yes = math.evaluate(`${bal} + 25000000`)
				data.Balance = yes
				await data.save()
				const success = new EmbedBuilder()
				.setColor('DarkButNotBlack')
				.setDescription(`Successfully claimed your daily **25.0m**, run this again in 24 hours to claim.\n\nNew balance: **${shortNumber(yes)}**`)
				.setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
				return interaction.reply({ embeds: [success], ephemeral: true })
            }
		
		)
	}
}