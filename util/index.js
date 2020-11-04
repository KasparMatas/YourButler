const { Collection } = require('discord.js');

const pushToCollectionValueList = (collection, key, value) => {
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
};

const reverseCollection = (orignal_collection) => {
    const new_collection = new Collection();
    orignal_collection.each((value_array, key) => {
        value_array.forEach(value => {
            pushToCollectionValueList(new_collection, value, key);
        });
    });
    return new_collection;
};

exports.reverseCollection = reverseCollection;
exports.pushToCollectionValueList = pushToCollectionValueList;