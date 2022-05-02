const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
	command : {
		name: 'ban',
		description: 'Bans a user',  
	},
	
    run: async(client, interaction, args) => {
        row = new MessageActionRow()
				.addComponents(
				new MessageButton()
					.setCustomId('ping')
					.setLabel('ping')
					.setStyle('PRIMARY'),
				);
				embed = new MessageEmbed()
				.setColor(config['color-hex'])
				.setTitle('Pong')
				.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar});
				await interaction.reply({ephemeral: false,embeds:[embed], components: [row] })
				.catch(console.error);
    }
};