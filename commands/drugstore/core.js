const Discord = require("discord.js");
require("dotenv").config();
const env = process.env;
const prefix = env.PREFIX;
const mysql = require("mysql");
const moment = require('moment');
const log = console.log.bind(console);

module.exports = {
    name: "drugstore",
    aliases: ['drug', "store", "ds"],
    run: (bot, message, args) => {
        const init = () => {
            var connection = mysql.createConnection({ host: 'plesk.oxide.host', user: 'surgenet_test', password: 'Hf2i0#6a', database: 'beetroot_store' });
            connection.connect();
            var authorUserId = message.author.id;
            var authorUserName = message.author.username;

            /*  Beetroot Drugstore System
            Axton P.#1234 @ 2022
            https://github.com/axtonprice/beetroot-drugstore
            */

            function main(){

            }
            function createShop() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                var jsonData = "{\r\n \"components\": {\r\n \"store_details\": {\r\n \"store_name\": \"Axtons Meth Lab\",\r\n \"store_description\": \"Come get yo ass meth n shit bruv dickhead\",\r\n \"last_purchase\": \"2022-03-19 03:42:21.000000\"\r\n },\r\n \"store_menu\": {\r\n \"001\": {\r\n \"drug_name\": \"Weed\",\r\n \"drug_description\": \"Devils lettuce blud\",\r\n \"date_added\": \"2022-03-19 03:42:21.000000\"\r\n }\r\n },\r\n \"store_customers\": {\r\n \"441994490115391488\": {\r\n \"item_id_purchase\": \"001\",\r\n \"sales_price\": \"100\",\r\n \"purchase_date\": \"2022-03-19 03:42:21.000000\"\r\n }\r\n }\r\n }\r\n}";
                connection.query("INSERT INTO `drug_stores` (`store_owner_id`, `store_data`, `store_balance`) VALUES ('" + authorUserId + "', '" + jsonData + "', '100');", (error, results, fields) => { });
                const embed = new Discord.MessageEmbed()
                    .setTitle('Beetroot Drugstore :pill:')
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Successfully created \`${authorUserName}'s Drug Store\`! \nUse \`${prefix}drugstore\` to view drugstore commands!`);
                message.reply({ embeds: [embed] });
            }
            function deleteShop() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                if (args[1] === "confirm") {
                    connection.query("DELETE FROM `drug_stores` WHERE `store_owner_id` = '" + authorUserId + "'", (error, results, fields) => { });
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Beetroot Drugstore :pill:')
                        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`Successfully deleted \`${authorUserName}'s Drug Store\`! \nUse \`${prefix}drugstore\` to view drugstore commands!`);
                    message.reply({ embeds: [embed] });
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Beetroot Drugstore :pill:')
                        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`Are you sure you want to delete your drugstore? \nUse \`${prefix}drugstore delete confirm\` to confirm deletion!`);
                    message.reply({ embeds: [embed] });
                }
            }

            if (args[0] === "create") {
                createShop();
            } else if (args[0] === "delete") {
                deleteShop();
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle('Beetroot Drugstore :pill:')
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Use \`${prefix}drugstore\` to view drugstore commands!`);
                message.reply({ embeds: [embed] });
            }

            connection.end();
        };
        init();
    }
}