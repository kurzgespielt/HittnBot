const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require('discord.js');
const config = require('../data/config.json');

	function channelHandler(client, action, oldchannel, channel) {
		switch(action.toLowerCase()) {
			case 'create':
				embed = new MessageEmbed()
					.setColor(config['color-hex'])
					.setTitle(`Channel has been created.`)
					.addFields (
						{name: 'reference', value: `<#${channel.id}>`},
						{name: 'name', value: `${channel.name}`},
						{name: 'type', value: `${channel.type.split('_')[1].toLowerCase()}-channel`}
					)
					.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
				client.channels.cache.get(config['channellog']).send({embeds: [embed]})
					.catch(console.error);
				break;
			case 'delete':
				embed = new MessageEmbed()
					.setColor(config['color-hex'])
					.setTitle(`Channel has been deleted.`)
					.addFields (
						{name: 'reference', value: `<#${channel.id}>`},
						{name: 'name', value: `${channel.name}`},
						{name: 'type', value: `${channel.type.split('_')[1].toLowerCase()}-channel`}
					)
					.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
				client.channels.cache.get(config['channellog']).send({embeds: [embed]})
					.catch(console.error);
				break;
			case 'update':
				embed = new MessageEmbed()
					.setColor(config['color-hex'])
					.setTitle(`Channel has been updated.`)
					.addFields (
						{name: 'reference', value: `<#${channel.id}>`},
						{name: 'name', value: `${channel.name}`},
						{name: 'type', value: `${channel.type.split('_')[1].toLowerCase()}-channel`}
					)
					.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
				client.channels.cache.get(config['channellog']).send({embeds: [embed]})
					.catch(console.error);
				break;
			
		}
	}


module.exports = {
	channelHandler
}