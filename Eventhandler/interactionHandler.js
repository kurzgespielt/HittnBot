const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require('discord.js');
const config = require('../data/config.json');


	function interactionLogger(client,interaction, args) {
	let embed;

	if (interaction.isCommand()) {
		if (interaction.channel) {
			embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Command used.')
			.setDescription(`Command ${interaction.commandName} used by <@${interaction.user.id}> in channel <#${interaction.channel.id.toString()}>`)
			.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
		} else {
			embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Command used.')
			.setDescription(`Command ${interaction.commandName} used by <@${interaction.user.id}> in direct messages`)
			.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
		}
		client.channels.cache.get(config['interactionlog']).send({embeds: [embed]})
		.catch(console.error);
	} else if(interaction.isButton()) {
		if (interaction.channel) {
			embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Button used.')
			.setDescription(`Button ${interaction.customId} used by <@${interaction.user.id}> in channel <#${interaction.channel.id.toString()}>`)
			.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar})
		} else {
			embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Button used.')
			.setDescription(`Button ${interaction.customId} used by <@${interaction.user.id}> in direct messages`)
			.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar})
		}
		client.channels.cache.get(config['interactionlog']).send({embeds: [embed]})
		.catch(console.error);
	}
	
}

module.exports = {
	interactionLogger
}