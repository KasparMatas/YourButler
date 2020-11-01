const { Command } = require('discord.js-commando');
const { MessageEmbed, Collection } = require('discord.js');
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

    reverseCollection(orignal_collection) {
        const new_collection = new Collection();
        orignal_collection.each((value_array, key) => {
            value_array.forEach(value => {
                this.pushToCollectionValue(new_collection, value, key);
            });
        });
        return new_collection;
    }

    pushToCollectionValue(collection, key, value) {
        if (collection.has(key)) {
            const value_list = collection.get(key);
            if (!value_list.includes(value)) {
                value_list.push(value);
                collection.set(key, value_list);
            }
        }
        else {
            collection.set(key, [value]);
        }
    }

    getRandomElementFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    run(message) {
        const provider = message.client.provider;
        const guild = message.guild;
        const available_games = provider.get(guild, 'available_games', []);

        if (available_games.size == 0) {
            return message.say('There are no registrations found!');
        }

        const game_registrations = new Collection();
        available_games.forEach(game => {
            const player_list = provider.get(guild, game, []);
            if (player_list.size != 0) {
                game_registrations.set(game, player_list);
            }
        });

        const player_registrations = this.reverseCollection(game_registrations);

        const game_allocations = new Collection();
        player_registrations.each((game_list, player) => {
            this.pushToCollectionValue(game_allocations, this.getRandomElementFromArray(game_list), player);
        });

        const embed = new MessageEmbed()
            .setColor('#32a858')
            .setTitle('Next game allocations')
            .setDescription('Below you can see which voice channel you should join.')
            .setTimestamp()
            .setFooter('Playtime start:');

        game_allocations.each((player_list, game) => {
            embed.addFields({ name: game, value: player_list });
        });

        return message.channel.send(embed);

    }
};