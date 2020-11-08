const { Command } = require('discord.js-commando');
module.exports = class SetupGameRegistrationCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setup_game_registration',
            group: 'admin',
            memberName: 'setup_game_registration',
            description: 'Command to setup game registrations.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to make available?',
                    type: 'string',
                },
                {
                    key: 'emoji',
                    prompt: 'Which emoji do you want to attach to a game?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { game_name, emoji }) {

        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        available_games[game_name] = emoji;
        provider.set(guild, 'available_games', available_games);
        return message.say(`${game_name} setup with ${emoji}`);
    }
};