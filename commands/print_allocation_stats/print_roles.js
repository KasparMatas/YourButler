const { Command } = require('discord.js-commando');
module.exports = class PrintRolesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'print_roles',
            group: 'print_allocation_stats',
            memberName: 'print_roles',
            description: 'Command to print created roles',
            ownerOnly: true,
            guildOnly: true,
        });
    }

    async run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        const game_roles = provider.get(guild, 'game_roles', new Object());

        if (Object.keys(game_roles).length == 0) {
            return message.say('No roles found');
        }

        let response_string = '';

        await Object.keys(game_roles).reduce(async (promise, game) => {
            await promise;
            const role = await guild.roles.fetch(game_roles[game]);
            response_string += `${game}: "${role.name}"\n`;
        }, Promise.resolve());

        return message.say(response_string);
    }
};
