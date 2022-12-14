// Require the necessary discord.js classes
const { Client, Intents, MessageSelectMenu, MessageEmbed} = require('discord.js');
const dotenv = require('dotenv');
const config = require('./data/config.json');
const fs = require('fs');


let commands = fs.readdirSync('./Commands');
let buttons = fs.readdirSync('./Buttons');
const interactionHandler = require('./Eventhandler/interactionHandler');
const channelHandler = require('./Eventhandler/channelHandler');
dotenv.config();

let jsonCommands = {};
for (const element of commands) {
	jsonCommands[element.split('.')[0]] = require('./Commands/'+element);
}
let jsonButtons = {};
for (const element of buttons) {
	jsonButtons[element.split('.')[0]] = require('./Buttons/'+element);
}

// Create a new client instance
const client = new Client({ 
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS], 
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true } 
	});

// When the client is ready, run this code (only once)
client.on('ready', () => {
	console.log('logged in!'); 	
	for(const [key,value] of Object.entries(jsonCommands)) {
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
				jsonCommands[commandName].run(client, interaction, args);
				break;
			case 'server':
				interactionHandler.interactionLogger(client, interaction, args);
				jsonCommands[commandName].run(client, interaction, args);
				break;
			case 'clear':
				interactionHandler.interactionLogger(client, interaction, args);
				jsonCommands[commandName].run(client, interaction, args);
				break;
			case 'warn':
				interactionHandler.interactionLogger(client, interaction, args);
				jsonCommands[commandName].run(client, interaction, args);
			case 'verify':
				interactionHandler.interactionLogger(client, interaction, args);
				jsonCommands[commandName].run(client, interaction, args);
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
	channelHandler.channelHandler(client, 'create', null, channel);
})

client.on('channelDelete', channel => {
	channelHandler.channelHandler(client, 'delete', null, channel);
})

client.on('channelUpdate', (oldchannel, newchannel) => {
	channelHandler.channelHandler(client, 'update', oldchannel, newchannel);
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
			break;
	}

	
});




// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
