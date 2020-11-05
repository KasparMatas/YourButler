const { Command } = require('discord.js-commando');
module.exports = class AddLimitCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add_limit',
            group: 'admin',
            memberName: 'add_limit',
            description: 'Command to add lobby limits to games',
            ownerOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to add limits to?',
                    type: 'string',
                },
                {
                    key: 'max',
                    prompt: 'What do you want the max lobby size to be for the specified game?',
                    type: 'integer',
                },
                {
                    key: 'min',
                    prompt: 'What do you want the min lobby size to be for the specified game?',
                    type: 'integer',
                },
            ],
        });
    }

    run(message, { game_name, max, min }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', []);

        if (!available_games.includes(game_name)) {
            return message.say('Sorry the specified game doesn\'t have any registrations at the moment!');
        }
        const new_limits = new Object();
        new_limits.min = min;
        new_limits.max = max;
        const lobby_limits = provider.get(guild, 'lobby_limits', new Object());
        lobby_limits[game_name] = new_limits;
        provider.set(guild, 'lobby_limits', lobby_limits);
        return message.say('New lobby limits saved!');
    }
};