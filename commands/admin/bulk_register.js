// const fetch = require('node-fetch');
const { Command } = require('discord.js-commando');
// const { Collection } = require('discord.js');
// const { getGameRegistrations, reverseCollection, generatePlayerProbabilities, arraysAreEqual } = require('../../util');

// This code has been left here since there are a few good things to learn from it.

module.exports = class BulkRegisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bulk_register',
            group: 'admin',
            memberName: 'bulk_register',
            description: 'Command to register all of the players in the attached file to their respective games. This keeps previous registrations.',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        return message.say('This command has been deprecated!');
        /*
        if (message.attachments.size == 0) {
            return message.say('No registration data attachment found!');
        }
        else if (message.attachments.size > 1) {
            return message.say('Too many attachements given!');
        }

        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', []);
        const registered_players = provider.get(guild, 'registered_players', []);
        const updated_players = [];

        const new_game_registrations = new Collection();

        fetch(message.attachments.first().url)
            .then(res => res.text())
            // Parse registration data
            .then(body => {
                Object.entries(JSON.parse(body)).forEach(([game, player_list]) => {
                    const current_player_list = provider.get(guild, game, []);
                    if (!arraysAreEqual(current_player_list, player_list)) {
                        player_list.forEach(new_player => {
                            if (!current_player_list.includes(new_player)) {
                                current_player_list.push(new_player);
                                updated_players.push(new_player);
                            }
                        });
                        provider.set(guild, game, current_player_list);
                        if (player_list.size != 0) {
                            new_game_registrations.set(game, current_player_list);
                        }
                    }
                });
            })
            // Save registration data in alternative forms (Yes, this is a bad idea but a proper DB setup takes time!)
            .then(() => {
                const player_registrations = reverseCollection(getGameRegistrations(message));

                const updated_games = new_game_registrations.keyArray();

                updated_games.forEach(game => {
                    if (!available_games.includes(game)) {
                        available_games.push(game);
                    }
                });

                updated_players.forEach(player => {
                    if (!registered_players.includes(player)) {
                        registered_players.push(player);
                    }
                });

                provider.set(guild, 'available_games', available_games);
                provider.set(guild, 'registered_players', registered_players);

                updated_players.forEach((player) => {
                    generatePlayerProbabilities(player_registrations.get(player), player, message);
                });
            });
        return message.say('Registration data successully added.');
        */
    }
};