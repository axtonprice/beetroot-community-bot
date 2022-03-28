
/*  Axton Utilities @ 2021 */

module.exports = (bot, client, message) => {

    // Requirements
    require('dotenv').config()
    const Discord = require('discord.js');
    const { Collection, Intents } = require('discord.js')
    const moment = require('moment');
    const { joinVoiceChannel } = require('@discordjs/voice');
    const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
    const { SlashCommandBuilder } = require('@discordjs/builders');
    // Variables
    let guild = bot.guilds.cache.get.id;
    const env = process.env;
    const prefix = env.PREFIX;
    function debugLog(content) { console.log(`[${new Date().toDateString()} DEBUG] ${content}`); }
    // Startup
    // let statusmessage = `${prefix}drugstore | v1.0.1`;
    let statusmessage = `Beetroot Peeps | v1.0.1`;
    bot.user.setPresence({ statusmessage: "online" }); bot.user.setActivity(statusmessage, { type: "WATCHING" });
    console.log(`\n---\nLogged in as ${bot.user.tag}!\n`);
    /* 
    Custom Event Modules:
    */
    bot.on('messageCreate', message => {
        if (message.content === `<@!${bot.user.id}>`) {
            const embed = new Discord.MessageEmbed()
                .setTitle('Hello! 👋')
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setDescription(`My prefix here is \`${prefix}\`. Use this at the start of your message to execute a command.`)
                .setTimestamp()
            message.reply({ embeds: [embed] });
        }
    })

    // function makeid(length) {
    //     var result = '';
    //     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    //     var charactersLength = characters.length;
    //     for (var i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // }
    // bot.channels.cache.get("957705257952108614").setName(`SID: ${makeid(10)}`);

    /*
    END Custom Event Modules
    */
}