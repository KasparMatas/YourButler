const { Command } = require('discord.js-commando');
module.exports = class MeowCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add_owner',
            group: 'admin',
            memberName: 'add_owner',
            description: 'Command to add an owner to the bot',
            ownerOnly: true,
            args: [
                {
                    key: 'new_owner',
                    prompt: 'Who do you want to add as an owner?',
                    type: 'user',
                },
            ],
        });
    }

    run(message, { new_owner }) {
        if (message.client.isOwner(new_owner)) {
            return message.say(`${new_owner} is already an owner.`);
        }
        else {
            const currnet_owners = message.client.owners;
            currnet_owners.push(new_owner);
            const new_owner_ids = [];
            currnet_owners.forEach(element => {
                new_owner_ids.push(element.id);
            });
            message.client.provider.set('global', 'owner_id_list', new_owner_ids);
            message.client.options.owner = new_owner_ids;
            return message.say(`Successfully added ${new_owner} to the owners list.`);
        }
    }
};