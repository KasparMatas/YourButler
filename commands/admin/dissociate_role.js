const { Command } = require('discord.js-commando');
module.exports = class DissociateRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dissociate_role',
            aliases: ['disassociate_role'],
            group: 'admin',
            memberName: 'dissociate_role',
            description: 'Command to dissociate a role from the specified game lobby.',
            ownerOnly: true,
            guildOnly: true,
            args: [
                {
                    key: 'role',
                    prompt: 'Which role do you want to unregister?',
                    type: 'role',
                },
                {
                    key: 'game_name',
                    prompt: 'Which game do you want to remove the role from?',
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
            if (game_roles[game_name] == role.id) {
                delete game_roles[game_name];
                provider.set(guild, 'game_roles', game_roles);
                return message.say(`${game_name} is no longer associated with ${role.name}`);
            }
            else {
                return guild.roles.fetch(game_roles[game_name])
                    .then(found_role => message.say(`${game_name} is associated with ${found_role.name} instead.`));
            }
        }
        else {
            return message.say(`${game_name} doesn't have any roles associated with it.`);
        }
    }
};