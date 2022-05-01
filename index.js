// Require the necessary discord.js classes
const { Client, Intents, MessageSelectMenu } = require('discord.js');
const dotenv = require('dotenv');
const config = require('./data/config.json');
const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require('discord.js');
const { strictEqual } = require('assert');
const fs = require('fs');
let users = require('./data/users.json');
dotenv.config()

// Create a new client instance
const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], 
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true } 
	});

// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('logged in!');

	/*for (const cmd of commands) {
		
	}*/
});
client.on('guildMemberAdd', member => {
		let embed = new MessageEmbed()
						.setTitle(`${member.user.username} joined ${member.guild.name}.`)
						.setDescription('there are currently ' + member.guild.memberCount+ ' members.')
						.setImage(member.user.avatarURL)
						.setColor(config['color-hex'])
						.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar});
			member.guild.channels.cache.get(config['welcome-channel']).send({embeds: [embed]})
			.catch(console.error);
			users[member.user.id]= {
				'guildId':member.guild.id,
				'username':member.user.username,
				'warns':0,
				'bot': member.user.bot
			};
			fs.writeFile('./data/users.json', JSON.stringify(users), err=>{
				if(err){
				  console.log("Error writing file" ,err);
				}});
		if(!member.user.bot) {
			embed = new MessageEmbed()
						.setTitle(`Verify.`)
						.setDescription(`Hey ${member.user}!:hand_splayed:\n Thanks for joining ${member.guild.name}!:flame:\nPlease verify that you are not a bot by pressing the "Verify"-Button.`)
						.setImage(member.user.avatarURL)
						.setColor(config['color-hex'])
						.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar});
			row = new MessageActionRow()
						.addComponents(
						new MessageButton()
							.setCustomId('verify')
							.setLabel('Verify')
							.setStyle('SUCCESS'),);
			member.send({embeds: [embed], components: [row]})
			.catch(console.error);
		}
		
		});

client.on('guildMemberRemove', member => {	
	console.log('member left');
	let embed = new MessageEmbed()
						.setTitle(`${member.user.username} left ${member.guild.name}.`)
						.setDescription('there are now ' + member.guild.memberCount+ ' members.')
						.setImage(member.user.avatarURL)
						.setColor(config['color-hex'])
						.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar});
			member.guild.channels.cache.get(config['leave-channel']).send({embeds: [embed]})
			.catch(console.error);
	});

client.on('interactionCreate', async interaction => {
	let embed;
	let row;
	if (!interaction.isCommand()) return;
		const { commandName } = interaction;
		switch(commandName) {
			case 'ping':
				interactionLogger(interaction);
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
				break;
			case 'server':
				interactionLogger(interaction);
				embed = new MessageEmbed()
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
				break;
			case 'clear':
				interactionLogger(interaction);
				if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					interaction.channel.bulkDelete(interaction.options.get('count', true).value)
					.catch(console.error);
					embed = new MessageEmbed()
						.setColor(config['color-hex'])
						.setTitle(`Successfully deleted ${interaction.options.get('count', true).value} messages`)
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
				break;
			case 'warn':
				interactionLogger(interaction);
				const target = interaction.options.getMember("target");
				const reason = interaction.options.getString("reason");
				if(interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
					if(users[target.id]) {
						if (users[target.id].warns == 2) {
							target.kick(reason+' - banned by the bot because of 3 warns');
							users[target.id] = null;
							fs.writeFile('./data/users.json', JSON.stringify(users), err=> {
								if(err){
								  console.log("Error writing file" ,err);
								}});
							embed = new MessageEmbed()
								.setColor(config['color-hex'])
								.setTitle('user has been kicked because of 3 warns')
								.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
							await interaction.reply({ephemeral: true,embeds:[embed]})
							embed = new MessageEmbed()
								.setColor(config['color-hex'])
								.setTitle(`You have been warned on the server ${interaction.guild.name}.`)
								.addFields (
									{name:'reason', description:reason}
								)
								.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
							target.send({ephemeral: true,embeds:[embed]})
						} else {
							users[target.id].warns = users[target.id].warns + 1;
							fs.writeFile('./data/users.json', JSON.stringify(users), err=> {
								if(err){
								  console.log("Error writing file" ,err);
								}});
							embed = new MessageEmbed()
								.setColor(config['color-hex'])
								.setTitle(`user have been warned and now has ${user[target.id].warns} warns.`)
								.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
							await interaction.reply({ephemeral: true,embeds:[embed]})
							embed = new MessageEmbed()
								.setColor(config['color-hex'])
								.setTitle(`You have been warned on the server ${interaction.guild.name}.`)
								.addFields (
									{name:'reason', description:reason},
									{name:'Warns', description:`You now have ${user[target.id].warns} warn/s`}
								)
								.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
							target.send({ephemeral: true,embeds:[embed]})
						}
					} else {
						embed = new MessageEmbed()
								.setColor(config['color-hex'])
								.setTitle(`ivalid user`)
								.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
						await interaction.reply({ephemeral: true,embeds:[embed]})
					}
				} else {
					embed = new MessageEmbed()
						.setColor(config['color-hex'])
						.setTitle('You do not have the permissions to perform this command')
						.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
					await interaction.reply({ephemeral: true,embeds:[embed]})
					.catch(console.error);
				}
			break;

		}
	
});

client.on('guildBanAdd', async (ban) => {
	console.log(ban);
})

client.on('guildBanRemove' , async (ban) => {
	console.log(ban);
})


client.on('channelCreate', channel => {
	embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Channel update.')
			.setDescription(`Channel <#${channel.id}> has been created.`)
			.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
	client.channels.cache.get(config['log']).send({embeds: [embed]})
	.catch(console.error);
})

client.on('channelDelete', channel => {
	embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Channel update.')
			.setDescription(`Channel ${channel.name} has been deleted.`)
			.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
	client.channels.cache.get(config['log']).send({embeds: [embed]})
	.catch(console.error);
})

client.on('channelUpdate', (oldchannel, newchannel) => {
	embed = new MessageEmbed()
			.setColor(config['color-hex'])
			.setTitle('Channel update.')
			.setDescription(`Channel <#${newchannel.id}> has been updated.`)
			.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
	client.channels.cache.get(config['log']).send({embeds: [embed]})
	.catch(console.error);
})

client.on('interactionCreate', async interaction => {
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
			.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
		await interaction.reply({ephemeral: true,embeds:[embed]});
		return ;
	}*/
	button = interaction.customId;

	switch (button) {
		case 'ping':
			interactionLogger(interaction);
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
			.setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
			await interaction.reply({ephemeral: false,embeds:[embed], components: [row] })
			.catch(console.error);
			break;
		case 'verify':
			interactionLogger(interaction);
			console.log(client.guilds.cache.get(users[interaction.user.id].guildId).members.fetch(interaction.user.id))
			//console.log(bot.guilds.cache.get(users[interaction.user.id].guildId).members.cache.get(interaction.user.id));
			//bot.guilds.cache.get(users[interaction.user.id].guildId).members.cache.get(interaction.user.id).roles.add(bot.guilds.cache.get(users[interaction.user.id].guildId).roles.cache.get(config['join-role']));
			client.guilds.cache.get(users[interaction.user.id].guildId).members.fetch(interaction.user.id).roles.add(client.guilds.cache.get(users[interaction.user.id].guildId).roles.cache.get(config['join-role']))
			.catch(console.error);
			break;
	}

	
});

function interactionLogger(interaction) {
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
			.setDescription(`Command ${interaction.commandName} used by <@${interaction.user.id}> in direct messages with <@${interaction.id}>`)
			.setFooter({text: client.user.username+ ' by Lukas#6616 •', iconURL: config.avatar});
		}
		client.channels.cache.get(config['log']).send({embeds: [embed]})
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
		client.channels.cache.get(config['log']).send({embeds: [embed]})
		.catch(console.error);
	}
	
}


// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
