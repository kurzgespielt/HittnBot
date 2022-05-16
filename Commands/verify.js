const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
	run: async(client, interaction, args) => {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let row = new MessageActionRow()
			.addComponents(
			new MessageButton()
				.setCustomId('verify')
				.setLabel('Verify')
				.setStyle('SUCCESS'),
			);
		    let embed = new MessageEmbed()
		    	.setColor(config['color-hex'])
			    .setTitle('Verify')
			    .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
			await interaction.reply({ephemeral: false,embeds:[embed], components: [row] })
			    .catch(console.error);
        }
        
        }
};