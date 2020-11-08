const { Command } = require('discord.js-commando');
const { MessageEmbed, Collection } = require('discord.js');
const { pushToCollectionValueList, arraysAreEqual } = require('../../util');
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
            // Else should return or throw an error somehow.
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

    updateAllocationProbabilities(game_allocations, provider, guild) {
        game_allocations.each((players_in_lobby, game) => {
            players_in_lobby.forEach(player => {
                const current_probabilities = provider.get(guild, player, null);
                // Else should return or throw an error somehow.
                if (current_probabilities != null) {
                    const game_list = Object.keys(current_probabilities);
                    if (game_list.length != 1) {
                        const current_game_value = current_probabilities[game];
                        const other_games_update_value = current_game_value / (game_list.length - 1);

                        game_list.forEach(potential_next_game => {
                            current_probabilities[potential_next_game] += other_games_update_value;
                        });
                        current_probabilities[game] = 0;

                        provider.set(guild, player, current_probabilities);
                    }
                }
            });
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;
        const registered_players = provider.get(guild, 'registered_players', []);

        if (registered_players.size == 0) {
            return message.say('There are no registrations found!');
        }

        const available_games = provider.get(guild, 'available_games', []);
        const game_roles = provider.get(guild, 'game_roles', new Object());
        if (!arraysAreEqual(available_games, Object.keys(game_roles))) {
            return message.say('Not all roles have been setup yet!');
        }

        const game_allocations = new Collection();
        const lobby_limits = provider.get(guild, 'lobby_limits', null);
        if (lobby_limits == null) {
            console.log('Allocations generated with no limits.');
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

        this.updateAllocationProbabilities(game_allocations, provider, guild);

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