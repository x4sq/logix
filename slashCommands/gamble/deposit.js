const { ApplicationCommandType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const balSchema = require('../../schemas/balance')
const math = require('mathjs')
const mongo = require('mongoose');
const shortNumber = require('short-number');
const deabbreviate = require('deabbreviate-number')
const isWholeNumber = require('is-whole-number')

module.exports = {
	name: 'deposit',
	description: "Give gems to a user. (OWNER ONLY)",
	type: ApplicationCommandType.ChatInput,
	cooldown: 1,
    default_member_permissions: [PermissionsBitField.Flags.Administrator],
    options: [
        {
    name: 'amount',
    description: 'Amount of gems to deposit.',
    type: 3,
    required: true
        },
        {
    name: 'user',
    description: 'User to give gems to.',
    type: 6,
    required: true
        }
    ],
	run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getString('amount')
        const actualAmount = deabbreviate(amount)


		if(interaction.user.id !== '1040814273422696538'){
            return interaction.reply('You don\'t look like Trav to me')
        }

        if(actualAmount < 0){
            return interaction.reply('Just why')
        }

        if(isWholeNumber(actualAmount) == false){
            return interaction.reply('Only deposit whole numbers.')
        }
		balSchema.findOne({ UserID: user.id }, async (err, data) =>{
			if(!data){
                await balSchema.create({
                    UserID: user.id,
                    Balance: actualAmount
                })
                return interaction.reply({ content: `Gave ${shortNumber(parseInt(actualAmount))} to ${user}`})
			}

            let newBal = math.evaluate(`${data.Balance} + ${actualAmount}`)
            data.Balance = newBal
            await data.save()
            return interaction.reply({ content: `Gave ${shortNumber(parseInt(actualAmount))} to ${user}`})

        
        
        })

	}
}