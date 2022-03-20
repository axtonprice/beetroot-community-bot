const Discord = require("discord.js");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
    name: 'pp',
    aliases: ['ppsize'],
    run: async (bot, message, args) => {

        if (args[0] == "<@!543667516728147968>") {
            message.reply(`hmm... atire has a 1 inch wonder :middle_finger:`);
        } else {
            var rand = Math.floor(Math.random() * 10);
            message.reply(`hmm... ${args[0]} you're a solid ${rand} inches :yum:`);
        }

    }
}