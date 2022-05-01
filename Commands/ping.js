const { CommandInteraction, MessageEmbed} = require("discord.js");


module.exports = {
    name: 'ping',
    description: 'Replies with pong',  

    run: async(client, interaction) => {
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