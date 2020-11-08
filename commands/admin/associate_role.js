const { Command } = require('discord.js-commando');
module.exports = class AssociateRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'associate_role',
            group: 'admin',
            memberName: 'associate_role',
            description: 'Command to associate a role with the specified game lobby.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'Which role do you want to register?',
                    type: 'role',
                },
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to add the role for?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { role, game_name }) {
        const provider = message.client.provider;
        const guild = message.guild;

        const available_games = provider.get(guild, 'available_games', new Object());
        if (!Object.keys(available_games).includes(game_name)) {
            return message.say(`${game_name} is not available!`);
        }

        const game_roles = provider.get(guild, 'game_roles', new Object());
        if (Object.keys(game_roles).includes(game_name)) {
            return guild.roles.fetch(game_roles[game_name])
                .then(found_role => message.say(`${game_name} already has the role ${found_role.name}`));
        }
        else {
            game_roles[game_name] = role.id;
            provider.set(guild, 'game_roles', game_roles);
            return message.say('Association added.');
        }
    }
};