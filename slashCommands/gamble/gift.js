const { ApplicationCommandType, EmbedBuilder, Embed } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const mongo = require('mongoose');
const shortNumber = require('short-number');
const deabbreviate = require('deabbreviate-number')
const isWholeNumber = require('is-whole-number')
module.exports = {
	name: 'gift',
	description: "Send your friends gifts of gems!",
	type: ApplicationCommandType.ChatInput,
	cooldown: 60000,
    options: [
        {
            name: 'user',
            description: 'User to gift gems to.',
            type: 9,
            required: true
        },
        {
            name: 'amount',
            description: 'Amount of gems to gift.',
            type: 3,
            required: true
        },
            ],
	run: async (client, interaction) => {
        const userToGiftTo = interaction.options.getMentionable('user')
        const amount = interaction.options.getString('amount')
        const actualAmountToGift = deabbreviate(amount)
        if(userToGiftTo.id == interaction.user.id){
            return interaction.reply({ embeds: [
                new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`You cannot gift to yourself.`)
                .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
            ], ephemeral: true })
        }
        if(actualAmountToGift > 1e19){
            return interaction.reply({ embeds: [
                new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`Gift value must be under 1e18.`)
                .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
            ], ephemeral: true })
        }
        balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            if(err) throw err;

			if(!data){
                await balSchema.create({
                    UserID: interaction.user.id,
                    Balance: 0
                })
                return interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setDescription(`Insufficient balance. Your current balance is **0** gems.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    .setColor('DarkButNotBlack')
                ], ephemeral: true })
			}
            if(actualAmountToGift < 0){
                return interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setColor('DarkButNotBlack')
                    .setDescription(`Gift value must be greater than 0.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                ]})
            }
            if(isWholeNumber(actualAmountToGift) == false){
                return interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setColor('DarkButNotBlack')
                    .setDescription(`Gift value must be a whole number.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                ]})
            }
            if(data){
                let balance = data.Balance
                const userID = data.UserID
                if(actualAmountToGift > balance){
                    const insufficientEmbed = new EmbedBuilder()
                    .setDescription(`Insufficient balance. Your current balance is **${shortNumber(parseInt(balance))}** gems.`)
                    .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                    .setColor('DarkButNotBlack')
                    return interaction.reply({ ephemeral: true, embeds: [insufficientEmbed] })
                }
                if(actualAmountToGift <= balance){
                    balSchema.findOne({ UserID: userToGiftTo.id }, async (err, data2) =>{
                        if(!data2){
                            await balSchema.create({
                                UserID: userToGiftTo.id,
                                Balance: 0
                            })
                        }
                        let newBal = math.evaluate(`${balance} - ${actualAmountToGift}`)
                        data.Balance = newBal
                        await data.save()
                        let doneeNewBal = math.evaluate(`${data2.Balance} + ${actualAmountToGift}`)
                        data2.Balance = doneeNewBal
                        await data2.save()
                        return interaction.reply({ embeds: [
                            new EmbedBuilder()
                            .setColor('DarkButNotBlack')
                            .setDescription(`Successfully gifted **${shortNumber(parseInt(actualAmountToGift))}** gems to <@${data2.UserID}>.`)
                            .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                        ]})
                        
                    })
                }
            }
        })
    }
}