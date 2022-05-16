const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
    run: async(client, interaction, args) => {
        interaction.user.roles.add(config["join-role"]);
    }
};