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
        const embed = new MessageEmbed()
            .setColor('#32a858')
            .setTitle('Next game allocations')
            .setDescription('Below you can see which voice channel you should join.')
            .addFields(
                { name: 'CS:GO :gun:', value: ['Player1', 'Player2', 'Player3'] },
                { name: 'Among us :astronaut:', value: 'Player4\nPlayer5\nPlayer6' },
                { name: 'Rocket League :soccer:', value: 'Player7\nPlayer8\nPlayer9' },
            )
            .setTimestamp()
            .setFooter('Playtime start:');

        return message.channel.send(embed);
    }
};