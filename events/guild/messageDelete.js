const { MessageEmbed } = require('discord.js')
module.exports = async (message) => {
    const deletedEmbed = new Discord.MessageEmbed()
    .setColor('#000000')
    .setDescription(`**Message Deleted**\n\n**The user ${messageDelete.author.tag} has deleted a message in <#${message.channel.id}>\n**Content:**\n${messageDelete.content}`)
    .setTimestamp()
    .setFooter('Surge Networks', 'https://cdn.discordapp.com/attachments/672465314012987402/733329099807916072/Grey_Background_Logo.jpg');
 client.on("messageDelete", (messageDelete) => {
  bot.channels.cache.get(`746433497455001640`).send(deletedEmbed)
 });

}