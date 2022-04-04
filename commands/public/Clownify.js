const Discord = require("discord.js");
require('dotenv').config()
const env = process.env;
const prefix = env.PREFIX;

module.exports = {
  name: 'clown',
  aliases: ['clownify'],
  run: async (bot, message, args) => {

    if (!args[0]) return;
    message.channel.send(`ur such a clown ${args[0]}\nhttps://cdn.axtonprice.com/file/tgWwBBWyd6.mp4`);

  }
}
