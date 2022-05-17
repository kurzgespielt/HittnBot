const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

module.exports = {
    run: async(client, interaction, args) => {
        let verifiedEmbed = new MessageEmbed()
        .setColor(config['color-hex'])
        .setTitle(`You are now verified`)
        .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
        let alreadyVerifiedEmbed = new MessageEmbed()
        .setColor(config['color-hex'])
        .setTitle(`You are already verified.`)
        .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});

        if (interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(config["join-role"])) {
            await interaction.reply({ephemeral: true,embeds:[alreadyVerifiedEmbed]});
        } else {
            interaction.guild.members.cache.get(interaction.user.id).roles.add(config["join-role"]);
            await interaction.reply({ephemeral: true,embeds:[verifiedEmbed]});
        }
        
    }
};