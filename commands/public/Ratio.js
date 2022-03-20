const Discord = require("discord.js");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
    name: 'ratio',
    aliases: ['bamboozle'],
    run: async (bot, message, args) => {
        
        message.channel.send(`stfu ${args[0]} get ratioed fucking loser`);
       
    }
}