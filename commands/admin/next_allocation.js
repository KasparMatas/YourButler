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

    checkLobbiesAgainstMaxLimit(game_allocations, unallocated_players, lobby_limits) {
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

    checkLobbiesAgainstMinLimit(game_allocations, unallocated_players, lobby_limits) {
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

    checkLobbiesAgainstLinkedGame(game_allocations, unallocated_players, linked_games, lobby_limits) {
        game_allocations.keyArray().forEach(game => {
            if (Object.keys(linked_games).includes(game)) {
                if (!game_allocations.keyArray().includes(linked_games[game])) {
                    game_allocations.get(game).forEach(player => {
                        unallocated_players.push(player);
                    });
                    game_allocations.delete(game);
                }
                else if ((game_allocations.get(game).lenght + game_allocations.get(linked_games[game]).lenght) > Math.max(lobby_limits[game].max, lobby_limits[linked_games[game]].max)) {
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

    async run(message) {
        const provider = message.client.provider;
        const guild = message.guild;
        const registered_players = provider.get(guild, 'registered_players', []);

        if (registered_players.size == 0) {
            return message.say('There are no registrations found!');
        }

        const available_games = provider.get(guild, 'available_games', new Object());
        if (Object.keys(available_games).length == 0) {
            return message.say('No games have been made available yet!');
        }
        const game_roles = provider.get(guild, 'game_roles', new Object());
        if (!arraysAreEqual(Object.keys(available_games), Object.keys(game_roles))) {
            return message.say('Not all roles have been setup yet!');
        }
        const game_channels = provider.get(guild, 'game_channels', new Object());
        if (!arraysAreEqual(Object.keys(available_games), Object.keys(game_channels))) {
            return message.say('Not all channels have been setup yet!');
        }
        const main_channel_id = provider.get(guild, 'main_room', null);
        if (main_channel_id == null) {
            return message.say('Main channel hasn\'t been setup yet!');
        }
        const main_channel = guild.channels.cache.get(main_channel_id);

        const game_allocations = new Collection();
        const linked_games = provider.get(guild, 'linked_games', new Object());
        const lobby_limits = provider.get(guild, 'lobby_limits', null);
        if (lobby_limits == null) {
            console.log('Allocations generated with no limits.');
            const unallocated_players = registered_players.filter(player_id => main_channel.members.keyArray().includes(player_id));
            this.allocatePlayersToLobbies(unallocated_players, game_allocations, provider, guild);
        }
        else {
            let unallocated_players = registered_players.filter(player_id => main_channel.members.keyArray().includes(player_id));
            let run_count;
            for (run_count = 0; unallocated_players.length != 0 && run_count < 1000; run_count++) {
                let attempt_count;
                game_allocations.clear();
                unallocated_players = registered_players.filter(player_id => main_channel.members.keyArray().includes(player_id));
                for (attempt_count = 0; unallocated_players.length != 0 && attempt_count < 100; attempt_count++) {
                    this.allocatePlayersToLobbies(unallocated_players, game_allocations, provider, guild);
                    unallocated_players = [];
                    this.checkLobbiesAgainstLinkedGame(game_allocations, unallocated_players, linked_games, lobby_limits);
                    this.checkLobbiesAgainstMaxLimit(game_allocations, unallocated_players, lobby_limits);
                    this.checkLobbiesAgainstMinLimit(game_allocations, unallocated_players, lobby_limits);
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


        await guild.members.fetch({ user: registered_players });

        game_allocations.each((player_id_list, game) => {
            if (Object.keys(linked_games).includes(game)) {
                const player_list = [];
                player_id_list.forEach(player_id => {
                    const player = guild.members.cache.get(player_id);
                    Object.keys(game_roles).forEach(game_with_role => {
                        player.roles.remove(game_roles[game_with_role]);
                    });
                    player.roles.add(game_roles[game]);
                    player_list.push(player);
                });
                game_allocations.get(linked_games[game]).forEach(player_id => {
                    const player = guild.members.cache.get(player_id);
                    Object.keys(game_roles).forEach(game_with_role => {
                        player.roles.remove(game_roles[game_with_role]);
                    });
                    player.roles.add(game_roles[game]);
                    player_list.push(player);
                });
                embed.addFields({ name: `${game} & ${linked_games[game]}`, value: player_list });
                game_allocations.delete(game);
                game_allocations.delete(linked_games[game]);
            }
        });

        game_allocations.each((player_id_list, game) => {
            const player_list = [];
            player_id_list.forEach(player_id => {
                const player = guild.members.cache.get(player_id);
                Object.keys(game_roles).forEach(game_with_role => {
                    player.roles.remove(game_roles[game_with_role]);
                });
                player.roles.add(game_roles[game]);
                player_list.push(player);
            });
            embed.addFields({ name: game, value: player_list });
        });

        return message.channel.send(embed);

    }
};