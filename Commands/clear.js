const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
	command : {
		name: 'clear',
		description: 'deletes an amount of messages',
        options: [
            {
                name: 'amount',
                description: 'The amount of deleted Messages',
                choices: [
                    {name: '10 messages', value: 10},
                    {name: '20 messages', value: 20},
                    {name: '50 messages', value: 50},
                    {name: '100 messages', value: 100}
                ],
                type: 'NUMBER',
                required: true
            }
        ]  
	},
	
    run: async(client, interaction, args) => {
        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            interaction.channel.bulkDelete(interaction.options.get('amount', true).value)
            .catch(console.error);
            embed = new MessageEmbed()
                .setColor(config['color-hex'])
                .setTitle(`Successfully deleted ${interaction.options.get('amount', true).value} messages`)
                .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
            await interaction.reply({ephemeral: true,embeds:[embed]})
            .catch(console.error);
        } else {
            embed = new MessageEmbed()
                .setColor(config['color-hex'])
                .setTitle('This feature is for administrators only')
                .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
            await interaction.reply({ephemeral: true,embeds:[embed]})
            .catch(console.error);
        }
    }
};