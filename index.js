// Require the necessary discord.js classes
const { Client, Intents, MessageSelectMenu } = require('discord.js');
const dotenv = require('dotenv');
const config = require('./data/config.json');
const {MessageEmbed, MessageActionRow, MessageButton, Permissions} = require('discord.js');
const { strictEqual } = require('assert');
const fs = require('fs');
dotenv.config()
let commands = {
	ping: require('./Commands/ping'),
	clear: require('./Commands/clear'),
	warn: require('./Commands/warn'),
	server: require('./Commands/server'),
	};
let buttons = {
	ping: require('./Buttons/ping'),
	verify: require('./Buttons/verify')
};
const interactionHandler = require('./Eventhandler/interactionHandler');
const channelHandler = require('./Eventhandler/channelHandler');


// Create a new client instance
const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], 
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true } 
	});

// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('logged in!');

 	
	for(const [key, value] of Object.entries(commands)) {
		client.application.commands.create(value.command, config.guildId);
	}

	
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
	console.log(member);
	let embed = new MessageEmbed()
						.setTitle(`${member.user.username} left ${member.guild.name}.`)
						.setDescription('there are now ' + member.guild.memberCount+ ' members.')
						.setImage(member.user.avatarURL)
						.setColor(config['color-hex'])
						.setFooter({text: client.user.username+ ' by Lukas#6616', iconURL: config.avatar});
			member.guild.channels.cache.get(config['leave-channel']).send({embeds: [embed]})
			.catch(console.error);
	});

client.on('interactionCreate', async (interaction, args) => {
	if (!interaction.isCommand()) return;
		const { commandName } = interaction;
		switch(commandName) {
			case 'ping':
				interactionHandler.interactionLogger(client, interaction, args);
				commands[commandName].run(client, interaction, args);
				break;
			case 'server':
				interactionHandler.interactionLogger(client, interaction, args);
				commands[commandName].run(client, interaction, args);
				break;
			case 'clear':
				interactionHandler.interactionLogger(client, interaction, args);
				commands[commandName].run(client, interaction, args);
				break;
			case 'warn':
				interactionHandler.interactionLogger(client, interaction, args);
				commands[commandName].run(client, interaction, args);
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
	channelHandler.channelHandler(client, 'create', channel);
})

client.on('channelDelete', channel => {
	channelHandler.channelHandler(client, 'delete', channel);
})

client.on('channelUpdate', (oldchannel, newchannel) => {
	channelHandler.channelHandler(client, 'update', newchannel);
})

client.on('interactionCreate', async (interaction, args) => {
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
			interactionHandler.interactionLogger(client, interaction, args);
			buttons[button].run(client, interaction, args);
			break;
		case 'verify':
			interactionHandler.interactionLogger(client, interaction, args);
			buttons[button].run(client, interaction, args);
			//console.log(bot.guilds.cache.get(users[interaction.user.id].guildId).members.cache.get(interaction.user.id));
			//bot.guilds.cache.get(users[interaction.user.id].guildId).members.cache.get(interaction.user.id).roles.add(bot.guilds.cache.get(users[interaction.user.id].guildId).roles.cache.get(config['join-role']));
			break;
	}

	
});




// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
