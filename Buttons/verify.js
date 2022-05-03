const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
    run: async(client, interaction, args) => {
        let user = client.guilds.cache.get(config.guildId).members.fetch(interaction.user.id);
        console.log(user);
        user.roles.add(config["join-role"]);
    }
};