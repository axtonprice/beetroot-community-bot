const Discord = require("discord.js");
require("dotenv").config();
const env = process.env;
const prefix = env.PREFIX;
const apitoken = env.APITOKEN;
const webhook = env.WEBHOOK;
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

        var miD = message.author.id;
        var mUs = message.author.username;

        if (message.author.id != "360832097495285761") {
            if (message.author.id != "441994490115391488") {
                message.channel.send("<a:bangcry:957043444684034148> You do not have permission to use this command! `ERR_DEVELOPMENT`");
                return;
            }
        }

        const preInitializationDate = new Date();
        // const thinkingEmbed = new Discord.MessageEmbed().setDescription(`Gimme a sec bro..`);
        // const thinking = await message.reply({ embeds: [thinkingEmbed] });

        const init = () => {
            var connection = mysql.createConnection({ host: 'plesk.oxide.host', user: 'surgenet_test', password: 'Hf2i0#6a', database: 'beetroot_store' });
            connection.connect();

            /* 
                Core Functions
            */

            const apiRequest = async path => {
                try {
                    const resp = await axios.get(`https://api.axtonprice.com/v1/beetroot/${path}&auth=${apitoken}`);
                    // log(resp.data);
                    return resp.data.data
                } catch (err) {
                    console.error(err)
                }
            }
            const getJson = async user => {
                try {
                    const resp = await axios.get(`https://api.axtonprice.com/v1/beetroot/requestData?fetchData=store_data&userId=${user}&auth=${apitoken}`);
                    return resp.data
                } catch (err) {
                    console.error(err)
                }
            }
            async function scrubDatabase() {
                connection.query("ALTER TABLE `drug_stores` AUTO_INCREMENT = 0;", (error, results, fields) => {
                    if (error) throw error;
                    log("» Database Cleaned");
                    log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                });
            }
            async function noStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ba3c3c')
                    .setDescription(`<a:bangcry:957043444684034148> You don't own a drugstore! Use \`${prefix}store create\` to create a new drugstore!`);
                message.channel.send({ embeds: [embed] });
                log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
            }
            async function alreadyHaveStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ba3c3c')
                    .setDescription(`<a:bangcry:957043444684034148> You fucking already own a drugstore! Use \`${prefix}store\` to view drugstore commands!`);
                message.channel.send({ embeds: [embed] });
                log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
            }
            async function sendWebhook(webhook, json) {
                const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
                var URL = webhook;
                fetch(URL, {
                    "method": "POST",
                    "headers": { "Content-Type": "application/json" },
                    "body": JSON.stringify(json)
                }).then(res => { console.log(res); }).catch(err => console.error(err));
            }
            async function generalDisplay() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                const data = await getJson(message.author.id);
                // Global Stats Variables
                var highestBalance = await apiRequest(`requestData?userId=${message.author.id}&fetchData=highestBalance`),
                    highestBalanceUser = await apiRequest(`requestData?userId=${message.author.id}&fetchData=highestBalanceUser`),
                    totalStoreCount = await apiRequest(`requestData?userId=${message.author.id}&fetchData=totalStoreCount`),
                    totalStoresBalance = await apiRequest(`requestData?userId=${message.author.id}&fetchData=totalStoresBalance`);
                // User Stats Variables
                var authorStoreBalance = data.components.store_details.store_balance,
                    authorStoreName = data.components.store_details.store_name,
                    authorTotalSoldItems = 0;
                const embed = new Discord.MessageEmbed()
                    .setTitle('Beetroot Drugstore <:pepehigh:956696541232529448>')
                    .setAuthor({ name: message.author.tag, iconURL: message.guild.iconURL() })
                    .setThumbnail(message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Manage your drugstore or view economy commands to buy or browse that good shit\n`)
                    .addFields(
                        { name: 'Your Statistics', value: `Balance: \`$${authorStoreBalance}\`\nName: \`${authorStoreName}\`\nSold: \`${authorTotalSoldItems} Items\``, inline: true },
                        { name: 'Global Statistics', value: `Total Stores: \`${totalStoreCount}\`\nGlobal Balance: \`$${totalStoresBalance}\``, inline: true }, // Top User: \`$${highestBalance} - ${highestBalanceUser}\`\n
                        { name: 'Manage Your Store', value: `\`${prefix}store update\` - Update your store details\n\`${prefix}store delete\` - Delete your store`, inline: false },
                        { name: 'Beetroot Economy', value: `\`${prefix}store work\` - Begin working to earn cash\n\`${prefix}store buy\` - Buy an item from a users store\n\`${prefix}store browse\` - View list of popular stores`, inline: false },
                    );
                message.channel.send({ embeds: [embed] });
                log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
            }
            async function myStoreCreate() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "true") {
                    alreadyHaveStoreDisplay();
                    return;
                }
                await apiRequest(`insertData?userId=${message.author.id}`); // insert data reqest
                const data = await getJson(message.author.id);
                const embed = new Discord.MessageEmbed()
                    .setColor("#38d15c")
                    .setDescription(`Successfully created your new store: \`${data.components.store_details.store_name}\`! \nUse \`${prefix}store\` to view drugstore commands!`);
                message.channel.send({ embeds: [embed] });
                log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
            }
            async function myStoreDelete() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                if (args[1] === "confirm") {
                    if (message.author.id === "360832097495285761" && args[2] === "-f") {
                        let user = bot.users.cache.get(args[3]);
                        await apiRequest(`customEndpoint?key=delete_store&data=${args[3]}`);
                        const embed = new Discord.MessageEmbed()
                            .setTitle('Beetroot Drugstore <:pepehigh:956696541232529448>')
                            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                            .setDescription(`Successfully deleted \`${user.username}'s Drug Store\`!`);
                        message.channel.send({ embeds: [embed] });
                        log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                    } else {
                        await apiRequest(`customEndpoint?key=delete_store&data=${message.author.id}`);
                        const embed = new Discord.MessageEmbed()
                            .setColor('#38d15c')
                            .setDescription(`Successfully deleted \`${message.author.username}'s Drug Store\`!`);
                        message.channel.send({ embeds: [embed] });
                        log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                    }
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#db6c30")
                        .setDescription(`Are you sure you want to delete your drugstore? \nUse \`${prefix}store delete confirm\` to confirm deletion!`);
                    message.channel.send({ embeds: [embed] });
                    log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                }
            }
            async function economyStartWorking() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                const json = await getJson(message.author.id);
                var hasCooldownPassed = moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isAfter(json.components.store_details.work_again_date);
                if (hasCooldownPassed) {
                    function randomInteger(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
                    var randomNum = randomInteger(85, 100);
                    json.components.store_details.store_balance = parseInt(json.components.store_details.store_balance) + randomNum;

                    value = parseInt(json.components.store_details.store_balance) + randomNum;
                    apiRequest(`modifyJson?userId=${message.author.id}&changeKey=store_balance&changeValue=${randomNum}`); // updates store balance
                    apiRequest(`modifyJson?userId=${message.author.id}&changeKey=work_again_date&changeValue=null`); // sets work cooldown

                    const embed = new Discord.MessageEmbed()
                        .setColor('#38d15c')
                        .setDescription(`:dollar: **Axton's Drugstore** earned \`$${randomNum}\` from 5 hours of work!`)
                    message.channel.send({ embeds: [embed] });
                    log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                } else {
                    const json = await getJson(message.author.id);
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ba3c3c')
                        .setDescription(`<a:bangcry:957043444684034148> You've already worked today! You can work again **${moment(json.components.store_details.work_again_date).fromNow()}**!`)
                    message.channel.send({ embeds: [embed] });
                    log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                }
            }
            async function economyDailyOffer() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }

                const cooldownDate = await apiRequest(`requestData?userId=${message.author.id}&fetchData=economy_offer_cooldown_date`);
                if (moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isAfter(cooldownDate)) {

                    if (args[1] == "purchase" && args[2]) {
                        // confirm purchase
                        var getOfferPurchaseId = randomValue["id"];
                        await apiRequest(`customEndpoint?data=confirm_offer&key=offer_id&value=${getOfferPurchaseId}`);
                        return;
                    }

                    const data = await getJson(message.author.id);
                    function randomInteger(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
                    const jsonData = require('./data/daily_offers.json');
                    const values = Object.values(jsonData);
                    const randomValue = values[parseInt(Math.random() * values.length)];

                    var getRandomItemName = randomValue["name"];
                    var getRandomItemCount = randomInteger(2, 4);
                    var getRandomItemSingularPrice = randomValue["single_unit_worth"];
                    var getRandomItemTotalPrice = getRandomItemSingularPrice * getRandomItemCount;
                    var getUserStoreBalance = data.components.store_details.store_balance;
                    var getOfferPurchaseId = randomValue["id"];

                    var webhookUrl = `https://discord.com/api/webhooks/${webhook}`;
                    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
                    fetch(webhookUrl, {
                        "method": "POST",
                        "headers": { "Content-Type": "application/json" },
                        "body": JSON.stringify(
                            {
                                "content": "\"*Hola amigo vengo con una oferta de canje que no querrás perderte!*\"\nThe strange man appears to be offering **" + getRandomItemName + " (x" + getRandomItemCount + ")**.",
                                "embeds": [
                                    {
                                        "title": "Accept Daily Offer? :dollar:",
                                        "description": "» This transaction will cost you `$" + getRandomItemTotalPrice + "`. \n» Your current store balance is `$" + getUserStoreBalance + "`. \n» This offer of **" + getRandomItemName + " (x" + getRandomItemCount + ")** is worth `$" + getRandomItemTotalPrice + "`. \n\nType `.store offer purchase " + getOfferPurchaseId + "` to accept this offer.",
                                        "color": null
                                    }
                                ],
                                "username": "El Estelic Chapo [NPC]",
                                "avatar_url": "https://raw.githubusercontent.com/axtonprice/beetroot-community-bot/main/commands/drugstore/images/npc0" + randomInteger(1, 9) + ".jpg"
                            }
                        )
                    }).then(res => {
                        apiRequest(`modifyJson?userId=${message.author.id}&changeKey=economy_offer_cooldown_date&changeValue=null`); // sets work cooldown
                        log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                    }).catch(err => console.error(err));

                } else {
                    const json = await getJson(message.author.id);
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ba3c3c')
                        .setDescription(`<a:bangcry:957043444684034148> You've already viewed todays offer! Come back **${moment(cooldownDate).fromNow()}**!`)
                    message.channel.send({ embeds: [embed] });
                    log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                }

            }
            async function test() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }

                const embed = new Discord.MessageEmbed()
                    .setDescription(`Success! Response: \`${123}\``);
                message.channel.send({ embeds: [embed] });
                log(`Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
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
            } else if (args[0] === "work") {
                economyStartWorking();
                scrubDatabase();
            } else if (args[0] === "offer") {
                economyDailyOffer();
                scrubDatabase();
            } else if (args[0] === "test") {
                test();
            } else if (args[0] === "npc") {
                testNpc();
            } else {
                generalDisplay();
            }

            connection.end();
        };
        await init();
        // message.reactions.removeAll();
        // setTimeout(() => {
        //     thinking.delete();
        // }, 800);
    }
}