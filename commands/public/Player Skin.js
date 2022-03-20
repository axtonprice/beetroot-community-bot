const Discord = require("discord.js");
const { del } = require("express/lib/application");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
    name: 'skin',
    aliases: ['playerskin', "playermodel", "getskin"],
    run: async (bot, message, args) => {

        if (!args[1]) {
            message.react(`👍`);
            message.reply(`https://mc-heads.net/body/${args[0]}`); // default right rotated skin
        } else if (args[1] == "-left") {
            message.react(`👍`);
            message.reply(`https://mc-heads.net/body/${args[0]}/left`); // default left rotated skin
        } else {
            if (args[1] == "head") {
                message.react(`👍`);
                message.reply(`https://mc-heads.net/head/${args[0]}`);
            } else if (args[1] == "download") {
                message.react(`👍`);
                message.reply(`https://mc-heads.net/skin/${args[0]}`);
            } else if (args[1] == "front") {
                message.react(`👍`);
                message.reply(`https://mc-heads.net/player/${args[0]}`);
            } else { // no valid argument-- default to right rotated skin
                message.react(`👍`);
                message.reply(`https://mc-heads.net/body/${args[0]}`);
            }
        }

    }
}