const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')
const mongo = require('mongoose');
const shortNumber = require('short-number');

module.exports = {
	name: 'bal',
	description: "Check your gems balance.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 10000,
	run: async (client, interaction) => {
		balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            if(err) throw err;

            if(!data){
                await balSchema.create({
                    UserID: interaction.user.id,
                    Balance: 0
                })
                const user = interaction.user.id
                const embed = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`Your balance is: **0** gems.`)
                .setFooter({ text: `ID: ${user}`})
                return interaction.reply({ embeds: [embed] })
            }
            
            const bal = await data.Balance
            const num2 = parseInt(bal, 10)
            const num = shortNumber(num2)
                const user = data.UserID
                const embed = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`Your balance is: **${num}** gems.`)
                .setFooter({ text: `ID: ${user}`})
                return interaction.reply({ embeds: [embed] })
        })
	}
};