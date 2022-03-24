const Discord = require("discord.js");
require("dotenv").config();
const env = process.env;
const prefix = env.PREFIX;
const mysql = require("mysql");
const moment = require('moment');
const log = console.log.bind(console);
const axios = require("axios");

/*  
    Beetroot Drugstore System
    Axton P.#1234 @ 2022
    https://github.com/axtonprice/beetroot-community-bot
*/

module.exports = {
    name: "drugstore",
    aliases: ['drug', "store", "ds"],
    run: async (bot, message, args) => {
        // message.react("<a:loading:956273050482008074>");
        const init = () => {
            var connection = mysql.createConnection({ host: 'plesk.oxide.host', user: 'surgenet_test', password: 'Hf2i0#6a', database: 'beetroot_store' });
            connection.connect();
            var authorUserId = message.author.id;
            var authorUserName = message.author.username;

            /* 
                Core Functions
            */

            const apiRequest = async path => {
                try {
                    const resp = await axios.get(`https://api.axtonprice.com/v1/beetroot/${path}&auth=ytUbHkrHsFmJyErr`);
                    // log(resp.data.data);
                    return resp.data.data
                } catch (err) {
                    console.error(err)
                }
            }
            const getJson = async user => {
                try {
                    const resp = await axios.get(`https://api.axtonprice.com/v1/beetroot/requestData?fetchData=store_data&userId=${user}&auth=ytUbHkrHsFmJyErr`);
                    return resp.data
                } catch (err) {
                    console.error(err)
                }
            }
            async function scrubDatabase() {
                connection.query("ALTER TABLE `drug_stores` AUTO_INCREMENT = 0;", (error, results, fields) => {
                    if (error) throw error;
                    log("» Database Cleaned");
                });
            }
            async function noStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`<:890516515844157510:954613427991638076> You don't own a drugstore! Use \`${prefix}drugstore create\` to create a new drugstore!`);
                message.reply({ embeds: [embed] });
            }
            async function alreadyHaveStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription(`<:890516515844157510:954613427991638076> You already own a drugstore! Use \`${prefix}drugstore\` to view drugstore commands!`);
                message.reply({ embeds: [embed] });
            }
            async function generalDisplay() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                const data = await getJson(message.author.id);
                json = data;
                // Global Stats Variables
                var highestBalance = 0;
                var highestBalanceUser = "Artisan_#4387";
                var highestBalanceStoreName = `Artisan_'s Store`;
                var totalStoreCount = "1";
                var totalStoresBalance = "100";
                // User Stats Variables
                var authorStoreBalance = json.components.store_details.store_balance;
                var authorStoreName = data.components.store_details.store_name;
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

            }
            async function myStoreCreate() {
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;

                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "true") {
                    alreadyHaveStoreDisplay();
                    return;
                }
                await apiRequest(`insertData?userId=${authorUserId}`); // insert data reqest
                const embed = new Discord.MessageEmbed()
                    .setTitle('Beetroot Drugstore :pill:')
                    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Successfully created \`${authorUserName}'s Drug Store\`! \nUse \`${prefix}drugstore\` to view drugstore commands!`);
                message.reply({ embeds: [embed] });
            }
            async function myStoreDelete() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
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
                            .setColor('#00ff00')
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
            async function test() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                const embed = new Discord.MessageEmbed()
                    .setDescription(`Success! Response: \`${await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`)}\``);
                message.reply({ embeds: [embed] });
            }

            /* 
                Function Loader Handler 
            */

            if (args[0] === "create") {
                myStoreCreate();
                scrubDatabase();
            } else if (args[0] === "delete") {
                myStoreDelete();
                scrubDatabase();
            } else if (args[0] === "test") {
                test();
                scrubDatabase();
            } else {
                generalDisplay();
            }

            connection.end();
        };
        await init();
        // message.reactions.removeAll();
    }
}