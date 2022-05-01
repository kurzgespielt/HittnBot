const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./data/config.json');
const dotenv = require('dotenv');
dotenv.config()

const commands = [
	new SlashCommandBuilder()
	.setName('server')
	.setDescription('Replies with server info!'),
	new SlashCommandBuilder()
	.setName('user')
	.setDescription('Replies with user info!'),
	new SlashCommandBuilder()
	.setName('clear')
	.setDescription('Clears a specific amount of messages!')
	.addNumberOption(option => option
		.setName('count')
		.setDescription('amount of messages to delete')
		.setRequired(true)),
	new SlashCommandBuilder()
	.setName('ticket')
	.setDescription('writes out the support ticket form!'),
	new SlashCommandBuilder()
	.setName('kick')
	.setDescription('kicks a user!')
	.addUserOption(option => option
		.setName('user')
		.setDescription('user to kick')
		.setRequired(true)),
	new SlashCommandBuilder()
	.setName('ban')
	.setDescription('bans a user!')
	.addUserOption(option => option
		.setName('user')
		.setDescription('user to ban')
		.setRequired(true)),
	new SlashCommandBuilder()
	.setName('warn')
	.setDescription('warns a user!')
	.addUserOption(option => option
		.setName('target')
		.setDescription('user to warn')
		.setRequired(true))
	.addStringOption(option => option
		.setName('reason')
		.setDescription('reason of the warn')
		.setRequired(true)),
	new SlashCommandBuilder()
	.setName('ping')
	.setDescription('try it out!'),
]
	.map(command => command.toJSON());
 
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);