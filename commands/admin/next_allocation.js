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

    allocatePlayersToLobbies(player_list, game_allocations, provider, guild) {
        player_list.forEach(player => {
            const current_probabilities = provider.get(guild, player, null);
            if (current_probabilities != null) {
                pushToCollectionValueList(game_allocations, this.getNextGameBasedOnProbabilites(current_probabilities), player);
            }
        });
    }

    checkLobbyAgainstMaxLimit(game_allocations, unallocated_players, lobby_limits) {
        game_allocations.each((players_in_lobby, game) => {
            if (Object.keys(lobby_limits).includes(game)) {
                if (players_in_lobby.length < lobby_limits[game].min) {
                    // console.log(game, players_in_lobby.length, '<', lobby_limits[game].min);
                    game_allocations.get(game).forEach(player => {
                        unallocated_players.push(player);
                    });
                    game_allocations.delete(game);
                }
            }
        });
    }

    checkLobbyAgainstMinLimit(game_allocations, unallocated_players, lobby_limits) {
        game_allocations.each((players_in_lobby, game) => {
            if (Object.keys(lobby_limits).includes(game)) {
                if (players_in_lobby.length > lobby_limits[game].max) {
                    // console.log(game, players_in_lobby.length, '>', lobby_limits[game].max);
                    game_allocations.get(game).forEach(player => {
                        unallocated_players.push(player);
                    });
                    game_allocations.delete(game);
                }
            }
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;
        const registered_players = provider.get(guild, 'registered_players', []);

        if (registered_players.size == 0) {
            return message.say('There are no registrations found!');
        }

        const game_allocations = new Collection();
        const lobby_limits = provider.get(guild, 'lobby_limits', null);
        if (lobby_limits == null) {
            console.log('No limits found?');
            this.allocatePlayersToLobbies(registered_players, game_allocations, provider, guild);
        }
        else {
            let unallocated_players = registered_players;
            let run_count;
            for (run_count = 0; unallocated_players.length != 0 && run_count < 1000; run_count++) {
                let attempt_count;
                game_allocations.clear();
                unallocated_players = registered_players;
                for (attempt_count = 0; unallocated_players.length != 0 && attempt_count < 100; attempt_count++) {
                    this.allocatePlayersToLobbies(unallocated_players, game_allocations, provider, guild);
                    unallocated_players = [];
                    this.checkLobbyAgainstMaxLimit(game_allocations, unallocated_players, lobby_limits);
                    this.checkLobbyAgainstMinLimit(game_allocations, unallocated_players, lobby_limits);
                }
            }
            if (unallocated_players.length != 0) {
                return message.say('Sorry failed to allocate due to limitis!');
            }
        }

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