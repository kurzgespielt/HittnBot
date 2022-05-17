const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
	command : {
		name: 'verify',
		description: 'Admin-Only Command, Bot writes out verify message in the channel where command is sent.',  
	},
	run: async(client, interaction, args) => {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
		    let embed = new MessageEmbed()
		    	.setColor(config['color-hex'])
			    .setTitle('Sending verify panel...')
			    .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
			await interaction.reply({ephemeral: true,embeds:[embed]})
			let row = new MessageActionRow()
			.addComponents(
			new MessageButton()
				.setCustomId('verify')
				.setLabel('Verify')
				.setStyle('SUCCESS'),
			);
		    embed = new MessageEmbed()
		    	.setColor(config['color-hex'])
			    .setTitle('Verify')
				.setDescription('**YOU**! Verify yourself! **NOW**')
				.setImage('https://i.imgur.com/TneKxIZ.jpg')
			    .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
			await interaction.channel.send({embeds:[embed], components: [row] })
			    .catch(console.error);
        }
        
        }
};