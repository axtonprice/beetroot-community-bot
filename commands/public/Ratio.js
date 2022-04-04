const Discord = require("discord.js");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
    name: 'ratio',
    aliases: ['bamboozle'],
    run: async (bot, message, args) => {
        
        if(!args[0]) return;
        message.channel.send(`stfu ${args[0]} get ratioed fucking loser`);
       
    }
}
