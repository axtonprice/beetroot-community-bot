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
            const emotes = [":smiling_face_with_3_hearts:", ":innocent:", ":yum:", ":partying_face:", ":nerd:", ":sneezing_face:", ":thermometer_face:"];
            const randEmote = Math.floor(Math.random() * emotes.length);
            message.reply(`hmm... ${args[0]} you're a solid ${rand} inches ${randEmote, emotes[randEmote]}`);
        }

    }
}