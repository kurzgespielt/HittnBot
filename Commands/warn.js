const { MessageActionRow, MessageButton, MessageEmbed, CommandInteraction, Permissions} = require("discord.js");
const config = require('../data/config.json');

const warn1 = '970581860012929054';
const warn2 = '970581829004460062';

module.exports = {
	command : {
		name: 'warn',
		description: 'Warns a user', 
        options: [
            {
                name: 'target',
                description: 'user who gets the warn',
                type: 'USER',
                required: true
            },
            {
                name: 'reason',
                description: 'reason for the warn',
                type: 'STRING',
                required: true
            }
        ] 
	},
	
    run: async(client, interaction, args) => {
        const target = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason");
        let embed;
        let role;
        if(interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
            if(target) {
                console.log(target);
                if (target.roles.cache.has(warn2)) {
                    embed = new MessageEmbed()
                        .setColor(config['color-hex'])
                        .setTitle('user has been kicked because of 3 warns')
                        .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
                    await interaction.reply({ephemeral: true,embeds:[embed]})
                    embed = new MessageEmbed()
                        .setColor(config['color-hex'])
                        .setTitle(`You have been kicken from the server ${interaction.guild.name} because you have recieved too much warns.`)
                        .addFields (
                            {name:'Reason', value: `${reason}- kicked by the bot because of 3 warns`}
                        )
                        .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
                    target.send({ephemeral: true,embeds:[embed]})
                    target.kick(reason+' - kicked by the bot because of 3 warns');
                } else {
                    if (target.roles.cache.has(warn1)) {
                        role = interaction.guild.roles.cache.get(warn1);
                        target.roles.remove(role);
                        role = interaction.guild.roles.cache.get(warn2);
                        target.roles.add(role);
                    } else {
                        role = interaction.guild.roles.cache.get(warn1);
                        target.roles.add(role);
                    }
                    embed = new MessageEmbed()
                        .setColor(config['color-hex'])
                        .setTitle(`user have been warned and now has ${role.name.charAt(4)} warns.`)
                        .setFooter({text: client.user.username+' by Lukas#6616', iconURL: config.avatar});
                    await interaction.reply({ephemeral: true,embeds:[embed]})
                    embed = new MessageEmbed()
                        .setColor(config['color-hex'])
                        .setTitle(`You have been warned on the server ${interaction.guild.name}.`)
                        .addFields (
                            {name:'reason', value:reason},
                            {name:'Warns', value:`You now have ${role.name.charAt(4)} warn/s`}
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
    }
};