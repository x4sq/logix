const { ApplicationCommandType, EmbedBuilder } = require('discord.js');
const balSchema = require('../../schemas/balance')

module.exports = {
	name: 'bal',
	description: "Check your gems balance.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 10000,
	run: async (client, interaction) => {
		balSchema.findOne({ UserID: interaction.user.id }, async (err, data) =>{
            if(err) throw err;

            if(!data){
                balSchema.create({
                    UserID: interaction.user.id,
                    Balance: 0
                })
                const newSchemaEmbed = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription('No data found. Creating you a new schema... Please re-run this command if you wish to see your balance.')
                .setFooter({ text: `Create a ticket if this was an error. ID: ${interaction.user.id}`})
                return interaction.reply({embeds: [newSchemaEmbed], ephemeral: true})
            }

            if(data){
                const bal = data.Balance
                const user = data.UserID
                const embed = new EmbedBuilder()
                .setColor('DarkButNotBlack')
                .setDescription(`Your balance is: ${bal} gems.`)
                .setFooter({ text: `ID: ${user}`})
                interaction.reply({ embeds: [embed] })
            }
        })
	}
};