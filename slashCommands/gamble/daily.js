const { ApplicationCommandType } = require('discord.js');
const balSchema = require('../../schemas/balance')
const db = require('quick.db')

module.exports = {
	name: 'daily',
	description: "Claim your 25M daily gems.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
        const user = interaction.user
		let time = 86400000
        let amount = 25000000
        let daily = await db.get(`daily_${user.id}`)

        let duration = ms(time - (Date.now() - daily), { long: true});

        if(daily !== null && time - (Date.now() - daily) > 0){
            interaction.reply({ content: `You will be able to claim your daily reward after \`${duration}\`** `, ephemeral: true })
        } else {

        }
	}
};