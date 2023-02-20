const { ApplicationCommandType, EmbedBuilder, Embed } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const shortNumber = require('short-number');
const deabbreviate = require('deabbreviate-number')
const isWholeNumber = require('is-whole-number')


module.exports = {
    name: 'bet',
    description: "Bet your gems with a chance of winning or losing.",
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
        const logChannel = client.channels.cache.get('1077048370578849812');
        const user = interaction.user.id
        const bet = interaction.options.getString('amount').toLowerCase()
		const actualBet = deabbreviate(bet)
        if(actualBet > 1e19){
            return interaction.reply('Bruh')
        }
		if(isWholeNumber(actualBet) == false){
			return interaction.reply('Only bet whole numbers.')
		}
        const maxBet = 20000000000
        const minBet = 9999999
        balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            const shortenedBet = shortNumber(parseInt(actualBet))
            if(!data){
                await balSchema.create({
                    UserID: interaction.user.id,
                    Balance: 0
                })
                return interaction.reply('Why you trying to bet 0 gems?')
            }
            if(data){
                if(data.Balance < actualBet){
                    const shortenedBal = shortNumber(parseInt(data.Balance)) 
                    const insufficientEmbed = new EmbedBuilder()
                    .setDescription(`Insufficient balance. Your current balance is **${shortenedBal}** gems.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    .setColor('DarkButNotBlack')
                    return interaction.reply({ embeds: [insufficientEmbed] })
                }
                if(maxBet < actualBet){
                    return interaction.reply({ephemeral: true, embeds: [ new EmbedBuilder()
                        .setColor('DarkButNotBlack')
                        .setDescription(`The maximum bet is **20.0b** gems. You bet **${shortenedBet}** gems. You have not been charged.`)
                        .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    ]}
                    )
                }
                if(actualBet < minBet){
                    return interaction.reply({ ephemeral: true, embeds: [
                        new EmbedBuilder()
                        .setColor('DarkButNotBlack')
                        .setDescription(`You bet below the minimum bet of **10.0m** gems. You have not been charged.`)
                        .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    ]}
                    )
                }
                if(actualBet <= data.Balance){
					const chances = ["win", "lose", "lose"]
					let pick = chances[Math.floor(Math.random() * chances.length)]

					if(pick == "lose"){
						const newBal = await math.evaluate(`${data.Balance} - ${actualBet}`)
						data.Balance = newBal
						await data.save()
                        const lostLogEmbed = new EmbedBuilder()
                        .setColor('DarkButNotBlack')
                        .setFooter({ text: `User\'s ID: ${interaction.user.id}`})
                        .setDescription(`<@${data.UserID}> bet **${shortNumber(parseInt(actualBet))}** (**${actualBet}**) gems.\n\nOutcome: **Lost**\n\nNew Balance: **${shortNumber(parseInt(newBal))}** (**${newBal}**)`)
						logChannel.send({ embeds: [lostLogEmbed]})
                        return interaction.reply({ embeds: [
							new EmbedBuilder()
							.setColor('DarkButNotBlack')
							.setDescription(`**You lost ${shortenedBet} gems.** Your new balance is **${shortNumber(newBal)}** gems.`)
							.setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
						]})
					}
					if(pick == "win"){
						const winnings = await math.evaluate(`${actualBet} * 2`)
						const newBalance = await math.evaluate(`${data.Balance} + ${actualBet}`)
						data.Balance = newBalance
						await data.save()
                        const winLogEmbed = new EmbedBuilder()
                        .setColor('DarkButNotBlack')
                        .setFooter({ text: `User\'s ID: ${interaction.user.id}`})
                        .setDescription(`<@${data.UserID}> bet **${shortNumber(parseInt(actualBet))}** (**${actualBet}**) gems.\n\nOutcome: **Won**\n\nNew Balance: **${shortNumber(parseInt(newBalance))}** (**${newBalance}**)`)
						logChannel.send({ embeds: [winLogEmbed]})
						return interaction.reply({ embeds: [
							new EmbedBuilder()
							.setColor('DarkButNotBlack')
							.setDescription(`**You won ${shortNumber(actualBet)} gems.** Your new balance is **${shortNumber(newBalance)}** gems.`)
							.setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
						]})

					}
                }
            }
        })
    }
};
