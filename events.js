// Instantiate a Discord Client
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});

// Attach a listener function
client.on('test', console.log);

// Emit the event
client.emit('interaction');