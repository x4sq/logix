const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')
const mongo = require('mongoose');
const shortNumber = require('short-number');

module.exports = {
	name: 'bal',
	description: "Check your gems balance.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 10000,
    options: [
        {
    name: 'user',
    description: 'User to give gems to.',
    type: 6,
    required: false
        }
    ],
	run: async (client, interaction) => {
        const userToCheck = interaction.options.getUser('user')
		balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            if(err) throw err;

            if(!userToCheck){
                if(!data){
                    await balSchema.create({
                        UserID: interaction.user.id,
                        Balance: 0
                    })
                    const user = interaction.user.id
                    const embed = new EmbedBuilder()
                    .setColor('DarkButNotBlack')
                    .setDescription(`Your balance is: **0** gems.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    return interaction.reply({ embeds: [embed] })
                }
                
                const bal = await data.Balance
                const num2 = parseInt(bal, 10)
                const num = shortNumber(num2)
                    const user = data.UserID
                    const embed = new EmbedBuilder()
                    .setColor('DarkButNotBlack')
                    .setDescription(`Your balance is: **${num}** gems.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    return interaction.reply({ embeds: [embed] })
            }









            
            if(userToCheck !== interaction.user){
                balSchema.findOne({ UserID: userToCheck.id }, async (err, data2) =>{
                    if(!data){
                        await balSchema.create({
                            UserID: userToCheck.id,
                            Balance: 0
                        })
                        const embed = new EmbedBuilder()
                        .setColor('DarkButNotBlack')
                        .setDescription(`${userToCheck}\'s balance is: **0** gems.`)
                        .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                        return interaction.reply({ embeds: [embed] })
                    }
                    if(data){
                        const embed2 = new EmbedBuilder()
                        .setColor('DarkButNotBlack')
                        .setDescription(`${userToCheck}\'s balance is: **${shortNumber(parseInt(data2.Balance))}** gems.`)
                        .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                        return interaction.reply({ embeds: [embed2] })
                    }

                })
            }

                

            
        })
	}
};