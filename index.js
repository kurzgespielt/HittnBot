// Require the necessary discord.js classes
const { Client, Intents, MessageSelectMenu } = require('discord.js');
const config = require('./data/config.json');
const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require('discord.js');
const { strictEqual } = require('assert');
const fs = require('fs');
const users = require('./data/users.json');

// Create a new client instance
const bot = new Client({ intents: [Intents.FLAGS.GUILDS], allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });

// When the client is ready, run this code (only once)
bot.once('ready', () => {
	console.log('logged in!');
});


bot.on('guildMemberAdd', member => {
		console.log('user joined');
		let role = member.guild.roles.find('name', 'Besucher');
		member.addRole(role);
		
		let embed = new MessageEmbed()
						.setTitle(member.user.username+ ' joined Hittn.')
						.setDescription('there are cuurently ' + member.guild.memberCount+ ' members.')
						.setImage(member.user.avatarURL)
						.setColor(config['color-hex'])
						.setFooter({text: bot.user.username+ ' by Lukas#6616', iconURL: bot.user.avatarURL});

			member.guild.channels.get(config['welcome-channel']).send({embed: embed});
		});

		bot.on('guildMemberRemove', member => {	
			console.log('member left');
			let embed = new MessageEmbed()
							.setTitle(member.user.username+ ' left Hittn.')
							.setImage(member.user.avatarURL)
							.setColor(config['color-hex'])
							.setFooter({text: bot.user.username+ ' by Lukas#6616', iconURL: bot.user.avatarURL});
		
				member.guild.channels.get(config['leave-channel']).send({embed: embed});
			});

	bot.on('interactionCreate', async interaction => {
		let embed;
		let row;
		if (!interaction.isCommand()) return;
			const { commandName } = interaction;
			switch(commandName) {
				case 'ping':
					sendLog(interaction);
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
					.setFooter({text: bot.user.username+ ' by Lukas#6616', iconURL: 'https://i.imgur.com/hfZ5Sp1.png'});
					await interaction.reply({ephemeral: false,embeds:[embed], components: [row] });
					break;
				case 'server':
					sendLog(interaction);
					embed = new MessageEmbed()
						.setTitle('Server informations')
						.addFields (
							{ name: 'Servername', value: `${interaction.guild.name}` },
							{ name: 'Members', value: `${interaction.guild.memberCount} members` },
							{ name: 'Creation time', value: `${interaction.guild.createdAt}` },
							{ name: 'Server description', value: `${interaction.guild.description}` },
						)
						.setColor(config['color-hex'])
						.setFooter({text: bot.user.username+ ' by Lukas#6616', iconURL: bot.user.avatarURL})
					await interaction.reply({ embeds: [embed] });
					break;
				case 'clear':
					sendLog(interaction);
					if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
						interaction.channel.bulkDelete(interaction.options.get('count', true).value);
						embed = new MessageEmbed()
							.setColor(config['color-hex'])
							.setTitle(`Successfully deleted ${interaction.options.get('count', true).value} messages`)
							.setFooter({text: bot.user.username+' by Lukas#6616', iconURL: bot.user.avatarURL});
						await interaction.reply({ephemeral: true,embeds:[embed]});
					} else {
						embed = new MessageEmbed()
							.setColor(config['color-hex'])
							.setTitle('This feature is for administrators only')
							.setFooter({text: bot.user.username+' by Lukas#6616', iconURL: bot.user.avatarURL});
						await interaction.reply({ephemeral: true,embeds:[embed]});
					}
					break;
				case 'warn':
					sendLog(interaction);
					if(interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
						if(users[interaction.user.id]) {

						} else {
							
						}
					} else {
						embed = new MessageEmbed()
							.setColor(config['color-hex'])
							.setTitle('You do not have the permissions to perform this command')
							.setFooter({text: bot.user.username+' by Lukas#6616', iconURL: bot.user.avatarURL});
						await interaction.reply({ephemeral: true,embeds:[embed]});
					}

			}
		
	});


	bot.on('interactionCreate', async interaction => {
		let embed;
		let row;
		let commandInteraction;
		if (!interaction.isButton()) return; 

		/*if(interaction.isCommand()) commandInteraction = interaction.user.id;
		console.log(commandInteraction);
		if(interaction.user.id != commandInteraction) {
			embed = new MessageEmbed()
				.setColor(config['color-hex'])
				.setTitle('This interaction was not for you')
				.setFooter({text: client.user.username+' by Lukas#6616', iconURL: bot.user.avatarURL});
			await interaction.reply({ephemeral: true,embeds:[embed]});
			return ;
		}*/
		button = interaction.customId;

		switch (button) {
			case 'ping':
				console.log(interaction);
				sendLog(interaction);
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
				.setFooter({text: bot.user.username+' by Lukas#6616', iconURL: bot.user.avatarURL});
				await interaction.reply({ephemeral: false,embeds:[embed], components: [row] });
				break;
		}

		
	});

	function sendLog(interaction) {
		let embed;

		if (interaction.isCommand()) {
			embed = new MessageEmbed()
				.setColor(config['color-hex'])
				.setTitle('Command used.')
				.setDescription(`Command ${interaction.commandName} used by <@${interaction.user.id}> in channel <#${interaction.channel.id.toString()}>`)
				.setFooter({text: bot.user.username+ ' by Lukas#6616', iconURL: 'https://i.imgur.com/hfZ5Sp1.png'});
				bot.channels.cache.get(config['log']).send({embeds: [embed]});
		} else if(interaction.isButton()) {
			embed = new MessageEmbed()
				.setColor(config['color-hex'])
				.setTitle('Button used.')
				.setDescription(`Button ${interaction.customId} used by <@${interaction.user.id}> in channel <#${interaction.channel.id.toString()}>`)
				.setFooter({text: bot.user.username+ ' by Lukas#6616', iconURL: 'https://i.imgur.com/hfZ5Sp1.png'});
				bot.channels.cache.get(config['log']).send({embeds: [embed]});
		}
		
	}


// Login to Discord with your client's token
bot.login(config.token);
