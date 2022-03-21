
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
    let statusmessage = `${prefix}drugstore | v1.0.1`;
    bot.user.setPresence({ statusmessage: "online" }); bot.user.setActivity(statusmessage, { type: "WATCHING" });
    console.log(`\n---\nLogged in as ${bot.user.tag}!\n`);

    /* 
    Custom Event Modules:
    */
    bot.on('messageCreate', message => {
        if (message.content === "<@!949884881486372924>") {
            const embed = new Discord.MessageEmbed()
                .setTitle('Hello! 👋')
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setDescription(`My prefix here is \`${prefix}\`. Use this at the start of your message to execute a command. **Need extra support?** Join the [Discord](https://discord.gg/dP3MuBATGc)`)
                .setTimestamp()
                .setFooter(bot.user.username, bot.user.avatarURL({ dynamic: true }));
            message.reply({ embeds: [embed] });
        }
    })

    bot.on("ready", () => {
        var channel = client.channels.cache.get("954596313197080586");
        channel.send("Online and waiting..");
    })
    /*
    END Custom Event Modules
    */
}