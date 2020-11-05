const { Command } = require('discord.js-commando');
const { MessageEmbed, Collection } = require('discord.js');
const { pushToCollectionValueList } = require('../../util');
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

    getNextGameBasedOnProbabilites(game_probabilities) {
        const game_list = Object.keys(game_probabilities);
        const random_sum = Math.random();
        let current_sum = 0;
        for (const game of game_list) {
            current_sum += game_probabilities[game];
            if (current_sum > random_sum) {
                return game;
            }
        }
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;
        const registered_players = provider.get(guild, 'registered_players', []);

        if (registered_players.size == 0) {
            return message.say('There are no registrations found!');
        }

        const game_allocations = new Collection();

        registered_players.forEach(player => {
            const current_probabilities = provider.get(guild, player, null);
            if (current_probabilities != null) {
                pushToCollectionValueList(game_allocations, this.getNextGameBasedOnProbabilites(current_probabilities), player);
            }
        });

        const embed = new MessageEmbed()
            .setColor('#32a858')
            .setTitle('Next game allocations')
            .setDescription('Below you can see which voice channel you should join.')
            .setTimestamp()
            .setFooter('Playtime start:');

        game_allocations.each((player_list, game) => {
            embed.addFields({ name: game, value: player_list });
        });

        return message.channel.send(embed);

    }
};