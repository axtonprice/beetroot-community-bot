const Discord = require("discord.js");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
    name: 'mow',
    aliases: ['mowlawn'],
    run: async (bot, message, args) => {
        
        if(message.author.id === "543667516728147968"){
          var items = ["https://tenor.com/view/tall-grass-cut-grass-trim-mow-lawn-grass-gif-11944116", "https://tenor.com/view/moe-the-lawn-gif-18558554", "https://tenor.com/view/mow-the-lawn-peter-draws-cutting-the-grass-lawn-mower-mowing-gif-19920702", "https://tenor.com/view/lawn-mower-fast-honda-fun-riding-gif-22519899", "https://tenor.com/view/discoholic-lawnmower-mowing-lawn-lawnmowing-gif-19273180"];
        var item = items[Math.floor(Math.random()*items.length)];
        message.channel.send(`<@!711329136387293245> go mow my lawn bitch\n${item}`);
            
        } else{
            message.channel.send("only atire owns estelic!");
}
       
    }
}
