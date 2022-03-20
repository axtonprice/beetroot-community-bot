const Discord = require("discord.js");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
    name: 'say',
    aliases: ['saymessage', 'msg', 'repeat', 'repeatmessage', 'simonsays'],
    run: async (bot, message, args) => {

        if (message.member.id !== "360832097495285761") {
            return;
        }

        if (message.member.permissions.has("ADMINISTRATOR")) {
            message.delete();
        }

        message.channel.send(message.content.slice(5));
    }
}