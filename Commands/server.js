const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
	command : {
		name: 'server',
		description: 'Replies with server info',  
	},
	
    run: async(client, interaction, args) => {
        let embed = new MessageEmbed()
					.setTitle('Server informations')
					.addFields (
						{ name: 'Servername', value: `${interaction.guild.name}` },
						{ name: 'Members', value: `${interaction.guild.memberCount} members` },
						{ name: 'Creation time', value: `${interaction.guild.createdAt}` },
						{ name: 'Server description', value: `${interaction.guild.description}` },
					)
					.setColor(config['color-hex'])
					.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar})
				await interaction.reply({ embeds: [embed] })
				.catch(console.error);
    }
};