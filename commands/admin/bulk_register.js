const fetch = require('node-fetch');
const { Command } = require('discord.js-commando');
const { Collection } = require('discord.js');
const { reverseCollection } = require('../../util');
module.exports = class BulkRegisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bulk_register',
            group: 'admin',
            memberName: 'bulk_register',
            description: 'Command to register all of the players in the attached file to their respective games. This does overwrite previous registrations!',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    run(message) {
        if (message.attachments.size == 0) {
            return message.say('No registration data attachment found!');
        }
        else if (message.attachments.size > 1) {
            return message.say('Too many attachements given!');
        }

        const provider = message.client.provider;
        const guild = message.guild;
        const game_registrations = new Collection();

        fetch(message.attachments.first().url)
            .then(res => res.text())
            // Parse registration data
            .then(body => {
                Object.entries(JSON.parse(body)).forEach(([game, player_list]) => {
                    provider.set(guild, game, player_list);
                    if (player_list.size != 0) {
                        game_registrations.set(game, player_list);
                    }
                });
            })
            // Save registration data in alternative forms (Yes, this is a bad idea but a proper DB setup takes time!)
            .then(() => {
                const player_registrations = reverseCollection(game_registrations);

                provider.set(guild, 'available_games', game_registrations.keyArray());
                provider.set(guild, 'registered_players', player_registrations.keyArray());

                player_registrations.each((game_list, player) => {
                    const player_game_probabilities = new Object();
                    const base_probability = 1 / game_list.length;
                    game_list.forEach(game => {
                        player_game_probabilities[game] = base_probability;
                    });
                    provider.set(guild, player, player_game_probabilities);
                });
            });

        return message.say('Registration data successully replaced.');

    }
};