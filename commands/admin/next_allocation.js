const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
module.exports = class NextAllocationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'next_allocation',
            aliases: ['shuffle', 'play', 'games'],
            group: 'admin',
            memberName: 'next_allocation',
            description: 'Command to show guests game allocation',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;
        const available_games = provider.get(guild, 'available_games', []);
        if (available_games.size != 0) {
            const embed = new MessageEmbed()
                .setColor('#32a858')
                .setTitle('Next game allocations')
                .setDescription('Below you can see which voice channel you should join.')
                .setTimestamp()
                .setFooter('Playtime start:');
            available_games.forEach(game => {
                const player_list = provider.get(guild, game, []);
                if (player_list.size != 0) {
                    embed.addFields({ name: game, value: player_list });
                }
            });
            return message.channel.send(embed);
        }
        else {
            return message.say('There are no registrations found!');
        }
    }
};