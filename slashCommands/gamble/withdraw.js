const { ApplicationCommandType, EmbedBuilder, PermissionsBitField, Embed } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const mongo = require('mongoose');
const shortNumber = require('short-number');
const deabbreviate = require('deabbreviate-number')
const isWholeNumber = require('is-whole-number')
const id = "1040814273422696538"

module.exports = {
	name: 'withdraw',
	description: "Withdraw your gems for gems in PSX.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 30000,
    options: [
                {
            name: 'amount',
            description: 'Amount of gems to withdraw.',
            type: 3,
            required: true
                },
                {
            name: 'username',
            description: 'Roblox username. NOT DISPLAY NAME',
            type: 3,
            required: true
                }
            ],
	run: async (client, interaction) => {
        const amount = interaction.options.getString('amount')
        const username = interaction.options.getString('username')
        const actualAmountToWithdraw = deabbreviate(amount)
        if(actualAmountToWithdraw < 0){
            return interaction.reply('Just why')
        }
        if(isWholeNumber(actualAmountToWithdraw) == false){
            return interaction.reply('Only gift whole numbers.')
        }
        const insufficientEmbed = new EmbedBuilder()
        .setDescription(`Insufficient balance. Your current balance is **0** gems.`)
        .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
        .setColor('DarkButNotBlack')
        balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            if(err) throw err;

			if(!data){
                await balSchema.create({
                    UserID: interaction.user.id,
                    Balance: 0
                })
                return interaction.reply({ embeds: [insufficientEmbed] })
            }
            if(data.Balance < amount){
                return interaction.reply({ embeds: [insufficientEmbed] })
            }
            if(data.Balance >= amount){
                let newBal = math.evaluate(`${data.Balance} - ${actualAmountToWithdraw}`)
                data.Balance = newBal
                await data.save()
                const embed = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`**${interaction.user}** (${interaction.user.id}) has withdrawn **${actualAmountToWithdraw}** (${shortNumber(parseInt(actualAmountToWithdraw))} shortened) gems.\n\nUsername: **${username}**`)
                client.users.send(id, { embeds: [embed] });
                const success = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`You have successfully withdrawn **${shortNumber(parseInt(actualAmountToWithdraw))}** gems.`)
                .setFooter({ text:  `Create a ticket if this was an error. ID: ${interaction.user.id}` })
                return interaction.reply({ embeds: [success] })

            }
        })
    }
}
