const { Command } = require('discord.js-commando');
module.exports = class StopReactionListeningCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'stop_reaction_listening',
            group: 'admin',
            memberName: 'stop_reaction_listening',
            description: 'Command to stop listening to the reactions on the registration message.',
            guildOnly: true,
            adminOnly: true,
        });
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;

        provider.remove(guild, 'listen_to_reactions');
    }
};