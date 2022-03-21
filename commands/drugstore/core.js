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

            function generalDisplay() {
                connection.query("SELECT `store_data` as response FROM `drug_stores` WHERE `store_owner_id`='" + message.author.id + "'", (error, results, fields) => {
                    json = JSON.parse(results[0].response);

                    // Global Stats Variables
                    var highestBalance = 0;
                    var highestBalanceUser = "Artisan_#4387";
                    var highestBalanceStoreName = `Artisan_'s Store`;
                    var totalStoreCount = "1";
                    var totalStoresBalance = "100";
                    // User Stats Variables
                    var authorStoreBalance = json.components.store_details.store_balance;
                    var authorStoreName = json.components.store_details.store_name;
                    var authorTotalSoldItems = 0;
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Beetroot Drugstore :pill:')
                        .setAuthor(message.author.tag, message.guild.iconURL())
                        .setThumbnail(message.author.avatarURL({ dynamic: true }))
                        .setDescription(`Manage your drugstore or view economy commands to buy or browse items!\n`)
                        .addFields(
                            { name: 'Your Statistics', value: `Balance: \`$${authorStoreBalance}\`\nName: \`${authorStoreName}\`\nSold: \`${authorTotalSoldItems} Items\``, inline: true },
                            { name: 'Global Statistics', value: `Top User: \`$${highestBalance} - ${highestBalanceUser}\`\nTotal Stores: \`${totalStoreCount} ($${totalStoresBalance})\``, inline: true },
                            { name: 'Manage Your Store', value: `\`\`\`${prefix}store work      » Begin working to earn cash\n${prefix}store delete    » Delete your store\`\`\``, inline: false },
                            { name: 'Beetroot Economy', value: `\`\`\`${prefix}store buy       » Buy an item from a users store\n${prefix}store browse    » View list of popular stores\`\`\``, inline: false },
                        );
                    message.reply({ embeds: [embed] });
                });
            }
            function myStoreCreate() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                var jsonData = "{\n \"components\": {\n \"store_details\": {\n \"store_name\": \"My Methlab\",\n \"store_description\": \"My awesome drugstore!\",\n \"last_purchase\": \"2022-03-19 03:42:21.000000\",\n \"store_balance\": \"0\"\n },\n \"store_menu\": {\n \"001\": {\n \"drug_name\": \"Weed\",\n \"drug_description\": \"Green devils lettuce\",\n \"date_added\": \"2022-03-19 03:42:21.000000\"\n }\n },\n \"store_customers\": {\n \"441994490115391488\": {\n \"item_id_purchase\": \"001\",\n \"sales_price\": \"100\",\n \"purchase_date\": \"2022-03-19 03:42:21.000000\"\n }\n }\n }\n}\n";
                connection.query("INSERT INTO `drug_stores` (`store_owner_id`, `store_data`) VALUES ('" + authorUserId + "', '" + jsonData + "');", (error, results, fields) => { });
                const embed = new Discord.MessageEmbed()
                    .setTitle('Beetroot Drugstore :pill:')
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Successfully created \`${authorUserName}'s Drug Store\`! \nUse \`${prefix}drugstore\` to view drugstore commands!`);
                message.reply({ embeds: [embed] });
            }
            function myStoreDelete() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                if (args[1] === "confirm") {
                    if (message.author.id === "360832097495285761" && args[2] === "-f") {
                        let user = bot.users.cache.get(args[3]);
                        connection.query("DELETE FROM `drug_stores` WHERE `store_owner_id` = '" + args[3] + "'", (error, results, fields) => { });
                        const embed = new Discord.MessageEmbed()
                            .setTitle('Beetroot Drugstore :pill:')
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setDescription(`Successfully deleted \`${user.username}'s Drug Store\`! \nUse \`${prefix}drugstore\` to view drugstore commands!`);
                        message.reply({ embeds: [embed] });
                    } else {
                        connection.query("DELETE FROM `drug_stores` WHERE `store_owner_id` = '" + authorUserId + "'", (error, results, fields) => { });
                        const embed = new Discord.MessageEmbed()
                            .setTitle('Beetroot Drugstore :pill:')
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setDescription(`Successfully deleted \`${authorUserName}'s Drug Store\`! \nUse \`${prefix}drugstore\` to view drugstore commands!`);
                        message.reply({ embeds: [embed] });
                    }
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Beetroot Drugstore :pill:')
                        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`Are you sure you want to delete your drugstore? \nUse \`${prefix}drugstore delete confirm\` to confirm deletion!`);
                    message.reply({ embeds: [embed] });
                }
            }
            function economyStartWorking() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;

                connection.query("SELECT `store_data` as response FROM `drug_stores` WHERE `store_owner_id`='" + authorUserId + "'", (error, results, fields) => {

                    json = JSON.parse(results[0].response);
                    log(json);
                    // function randomInteger(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
                    // var randomNum = randomInteger(85, 100);
                    // json.components.store_details.store_balance = parseInt(json.components.store_details.store_balance) + randomNum;

                    // const embed = new Discord.MessageEmbed()
                    //     .setTitle('Beetroot Drugstore :pill:')
                    //     .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    //     .setDescription(`:thumbsup: You worked for 5 hours and received \`+ $${randomNum}\`!`);
                    // message.reply({ embeds: [embed] });

                });
            }

            function testGetJson() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                var randomNumber = Math.floor(Math.random() * 10);

                connection.query("SELECT `store_data` as response FROM `drug_stores` WHERE `store_owner_id`='" + authorUserId + "'", (error, results, fields) => {
                    json = JSON.parse(results[0].response);
                    log(json.components);
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Beetroot Drugstore :pill:')
                        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`response = ${json.components.store_details.store_name}`);
                    message.reply({ embeds: [embed] });
                });

            }

            /* 
                Function Loader Handler 
            */

            if (args[0] === "create") {
                myStoreCreate(); // Create a new drugstore
            } else if (args[0] === "delete") {
                myStoreDelete(); // Delete users drugstore
            } else if (args[0] === "work") {
                economyStartWorking(); // Delete users drugstore
            } else if (args[0] === "test") {
                testGetJson(); // test function
            } else {
                generalDisplay(); // User has a store, display main page
            }

            connection.end();
        };
        init();
    }
}