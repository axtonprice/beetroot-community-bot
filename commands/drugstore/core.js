const Discord = require("discord.js");
require("dotenv").config();
const env = process.env;
const prefix = env.PREFIX;
const mysql = require("mysql");
const moment = require('moment');
const log = console.log.bind(console);


/*  
    Beetroot Drugstore System
    Axton P.#1234 @ 2022
    https://github.com/axtonprice/beetroot-community-bot
*/

module.exports = {
    name: "drugstore",
    aliases: ['drug', "store", "ds"],
    run: (bot, message, args) => {
        const init = () => {
            var connection = mysql.createConnection({ host: 'plesk.oxide.host', user: 'surgenet_test', password: 'Hf2i0#6a', database: 'beetroot_store' });
            connection.connect();
            var authorUserId = message.author.id;
            var authorUserName = message.author.username;

            /* 
                Core Functions
            */

            function mainDisplayPage() {
                // Global Stats Variables
                var highestBalance = 0;
                var highestBalanceUser = "Kenzie";
                var highestBalanceStoreName = `${highestBalanceUser}'s Store`;
                // User Stats Variables
                var authorStoreBalance = 0;
                var authorStoreName = `${authorUserName }'s Store`;

                const embed = new Discord.MessageEmbed()
                    .setTitle('Beetroot Drugstore :pill:')
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Welcome back, store owner **${authorUserName}**!\n`)
                    .addFields(
                        { name: 'Your Statistics', value: `\`\`\`Your Store Balance: $${authorStoreBalance}  \`\`\``, inline: true },
                        { name: 'Global Statistics', value: `\`\`\`Top Balance: $${highestBalance} - ${highestBalanceStoreName}\`\`\``, inline: true },
                        { name: 'Manage Your Store', value: `\`\`\`${prefix}drugstore work - Begin working to earn cash\n${prefix}drugstore buy <store-id> <item-id> - Buy an item from a store\n${prefix}drugstore delete - Delete your store\`\`\``, inline: false },
                    );
                message.reply({ embeds: [embed] });
            }
            function createShop() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                var jsonData = JSON.stringify("{\n \"components\": {\n \"store_details\": {\n \"store_name\": \"Axtons Meth Lab\",\n \"store_description\": \"Come get yo ass meth n shit bruv dickhead\",\n \"last_purchase\": \"2022-03-19 03:42:21.000000\",\n \"store_balance\": \"0\"\n },\n \"store_menu\": {\n \"001\": {\n \"drug_name\": \"Weed\",\n \"drug_description\": \"Devils lettuce blud\",\n \"date_added\": \"2022-03-19 03:42:21.000000\"\n }\n },\n \"store_customers\": {\n \"441994490115391488\": {\n \"item_id_purchase\": \"001\",\n \"sales_price\": \"100\",\n \"purchase_date\": \"2022-03-19 03:42:21.000000\"\n }\n }\n }\n}\n");
                connection.query("INSERT INTO `drug_stores` (`store_owner_id`, `store_data`) VALUES ('" + authorUserId + "', '" + jsonData + "');", (error, results, fields) => { });
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

            /* 
                Function Loader Handler 
            */
            if (args[0] === "create") {
                createShop(); // Create a new drugstore
            } else if (args[0] === "delete") {
                deleteShop(); // Delete users drugstore
            } else {
                mainDisplayPage(); // User has a store, display main page
            }

            connection.end();
        };
        init();
    }
}