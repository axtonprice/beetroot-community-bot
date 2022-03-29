const Discord = require("discord.js");
require("dotenv").config();
const env = process.env;
const prefix = env.PREFIX;
const apitoken = env.APITOKEN;
const webhook = env.WEBHOOK;
const mysql = require("mysql");
const moment = require('moment');
const axios = require("axios");

/*  
    Beetroot Drugstore System
    Axton P.#1234 @ 2022
    https://github.com/axtonprice/beetroot-community-bot
*/

module.exports = {
    name: "store",
    aliases: ['drug', "drugstore", "ds", "str", "stor", "drugs", "druggy", "drugshack", "sell", "buy"],
    run: async (bot, message, args) => {

        // const commandUsage = ;
        const log = function (content) { console.log(`[${moment(new Date()).format("YYYY-MM-DD HH:mm")} DEBUG] ${content} - "${message.content}" « ${message.author.tag}`); }
        var miD = message.author.id;
        var mUs = message.author.username;

        if (message.author.id != "360832097495285761") {
            if (message.author.id != "441994490115391488") {
                if (message.author.id != "610080404908539914") {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ba3c3c')
                        .setDescription(`<a:bangcry:957043444684034148> This module is still under development! \nPlease contact <@360832097495285761> for more information.`);
                    message.reply({ embeds: [embed] });
                    return;
                }
            }
        }

        const preInitializationDate = new Date();

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
                    log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`);
                });
            }
            async function noStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ba3c3c')
                    .setDescription(`<a:bangcry:957043444684034148> You don't own a drugstore! Use \`${prefix}store create\` to create a new drugstore!`)
                    .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                    .setTimestamp();
                message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
            }
            async function userNoStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ba3c3c')
                    .setDescription(`<a:bangcry:957043444684034148> This user doesn't own a drugstore!`)
                    .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                    .setTimestamp();
                message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
            }
            async function alreadyHaveStoreDisplay() {
                const embed = new Discord.MessageEmbed()
                    .setColor('#ba3c3c')
                    .setDescription(`<a:bangcry:957043444684034148> You already fucking own a drugstore! \nUse \`${prefix}store\` to view drugstore commands!`)
                    .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                    .setTimestamp();
                message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
            }
            async function generalDisplay() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                const data = await getJson(message.author.id);
                // Global Stats Variables
                var totalStoreCount = await apiRequest(`requestData?userId=${message.author.id}&fetchData=totalStoreCount`),
                    totalStoresBalance = await apiRequest(`requestData?userId=${message.author.id}&fetchData=totalStoresBalance`);
                // User Stats Variables
                var authorStoreBalance = data.components.store_details.store_balance,
                    authorStoreName = data.components.store_details.store_name,
                    authorStoreDesc = data.components.store_details.store_description,
                    authorTotalSoldItems = Object.keys(data.components.store_customers).length;
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${authorStoreName} <:pepehigh:956696541232529448>`)
                    .setAuthor({ name: message.author.tag, iconURL: message.guild.iconURL() })
                    .setThumbnail(message.author.avatarURL({ dynamic: true }))
                    .setDescription(authorStoreDesc)
                    .addFields(
                        { name: 'Your Statistics :dollar:', value: `Balance: \`$${authorStoreBalance}\`\nSold: \`${authorTotalSoldItems} Drugs\``, inline: true },
                        { name: 'Global Statistics :globe_with_meridians:', value: `Total Stores: \`${totalStoreCount}\`\nGlobal Balance: \`$${totalStoresBalance}\``, inline: true }, // Top User: \`$${highestBalance} - ${highestBalanceUser}\`\n
                        { name: 'Manage Your Store', value: `\`${prefix}store update\` - Update your store details :gear:\n\`${prefix}store delete\` - Permanently delete your store <:trash:957673378821570590>`, inline: false },
                        { name: 'Beetroot Economy', value: `\`${prefix}store view\` - View store page & store inventory :eyes:\n\`${prefix}store work\` - Begin working to earn cash :dollar:\n\`${prefix}store buy\` - Buy an item from a users store :credit_card:\n\`${prefix}store browse\` - View list of popular stores :fire:`, inline: false },
                    )
                    .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                    .setTimestamp();
                message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
            }
            async function myStoreCreate() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "true") {
                    alreadyHaveStoreDisplay();
                    return;
                }
                await apiRequest(`insertData?userId=${message.author.id}&defaultPrefix=${prefix}`); // insert data reqest
                const data = await getJson(message.author.id);
                const embed = new Discord.MessageEmbed()
                    .setColor("#38d15c")
                    .setDescription(`:thumbsup: Successfully created new drugstore!\n\n:gear: To update your store settings, use \`${prefix}store update\`,\n or use \`${prefix}store\` to view drugstore commands!`)
                    .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                    .setTimestamp();
                message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
            }
            async function myStoreUpdate() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                const data = await getJson(message.author.id);
                if (args[1] == "name") {
                    const stringData = args.slice(2).join(' ');
                    if (stringData.length <= 40 && stringData.length > 3) {
                        await apiRequest(`customEndpoint?key=update_store&userId=${message.author.id}&data1=store_name&data2=${encodeURIComponent(stringData)}`);
                        log(`Requested https://api.axtonprice.com/v1/beetroot/customEndpoint?key=update_store&userId=${message.author.id}&data1=store_name&data2=${encodeURIComponent(stringData)}`);
                        const embed = new Discord.MessageEmbed()
                            .setColor('#38d15c')
                            .setDescription(`:thumbsup: Updated your store name to \`${stringData}\`!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                        return;
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#ba3c3c')
                            .setDescription(`<a:bangcry:957043444684034148> Your store name must be less than 40 and more than 4 characters long!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                        return;
                    }
                } else if (args[1] == "desc") {
                    const stringData = args.slice(2).join(' ');
                    if (stringData.length <= 180 && stringData.length > 3) {
                        await apiRequest(`customEndpoint?key=update_store&userId=${message.author.id}&data1=store_description&data2=${encodeURIComponent(stringData)}`);
                        log(`Requested https://api.axtonprice.com/v1/beetroot/customEndpoint?key=update_store&userId=${message.author.id}&data1=store_description&data2=${encodeURIComponent(stringData)}`);
                        const embed = new Discord.MessageEmbed()
                            .setColor('#38d15c')
                            .setDescription(`:thumbsup: Updated your store description to \`${stringData}\`!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                        return;
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#ba3c3c')
                            .setDescription(`<a:bangcry:957043444684034148> Your store description must be less than 180 and more than 4 characters long!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                        return;
                    }
                }
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${data.components.store_details.store_name} <:pepehigh:956696541232529448>`)
                    .setAuthor({ name: message.author.tag, iconURL: message.guild.iconURL() })
                    .setThumbnail(message.author.avatarURL({ dynamic: true }))
                    .setDescription(`Update your drugstore details with the commands below\n`)
                    .addFields({ name: 'Available Commands', value: `\`${prefix}store update name abc123\` - Update your store name\n\`${prefix}store update desc abc123\` - Update your store description`, inline: false },)
                    .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                    .setTimestamp();
                message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
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
                            .setDescription(`Successfully deleted \`${user.username}'s Drug Store\`!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                    } else {
                        await apiRequest(`customEndpoint?key=delete_store&data=${message.author.id}`);
                        const embed = new Discord.MessageEmbed()
                            .setColor('#38d15c')
                            .setDescription(`:thumbsup: Successfully deleted \`${message.author.username}'s Drug Store\`!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                    }
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setColor("#db6c30")
                        .setDescription(`Are you sure you want to delete your drugstore? \nUse \`${prefix}store delete confirm\` to confirm deletion!`)
                        .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                        .setTimestamp();
                    message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                }
            }
            async function economyStoreViewDisplay() {

                let user = await bot.users.fetch(args[1]);

                if (user) {
                    if (await apiRequest(`requestData?userId=${user.id}&fetchData=doesStoreExist`) === "false") {
                        userNoStoreDisplay();
                        return;
                    }
                    const data = await getJson(user.id);
                    var givenUserStoreName = data.components.store_details.store_name;
                    var givenUserStoreDesc = data.components.store_details.store_description;
                    var givenUserStoreBalance = data.components.store_details.store_balance;
                    var givenUserStoreLastPurchase = data.components.store_details.last_purchase;
                    var givenUserInventoryCount = Object.keys(data.components.store_inventory).length;

                    console.log(data.components.store_inventory)["43259"];
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${givenUserStoreName} <:pepehigh:956696541232529448>`)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`"${givenUserStoreDesc}"`)
                        .addFields(
                            { name: 'Store Details', value: `Store Owner: \`${user.tag}\`\nStore Balance: \`$${givenUserStoreBalance}\`\nLast Sale: \`${moment(givenUserStoreLastPurchase).format("Do MMMM YYYY")}\`\nInventory: \`${givenUserInventoryCount} drugs\``, inline: true },
                            { name: 'Store Inventory', value: `a`, inline: true },
                        )
                        .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                        .setTimestamp();
                    message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                } else {
                    if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                        noStoreDisplay();
                        return;
                    }
                    const data = await getJson(message.author.id);
                    var givenUserStoreName = data.components.store_details.store_name;
                    var givenUserStoreDesc = data.components.store_details.store_description;
                    var givenUserStoreBalance = data.components.store_details.store_balance;
                    var givenUserStoreLastPurchase = data.components.store_details.last_purchase;
                    var givenUserInventoryCount = Object.keys(data.components.store_inventory).length;

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${givenUserStoreName} <:pepehigh:956696541232529448>`)
                        .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                        .setDescription(`"${givenUserStoreDesc}"`)
                        .addFields(
                            { name: 'Store Details', value: `Store Owner: \`${message.author.tag}\`\nStore Balance: \`$${givenUserStoreBalance}\`\nLast Sale: \`${moment(givenUserStoreLastPurchase).format("Do MMMM YYYY")}\`\nInventory: \`${givenUserInventoryCount} drugs\``, inline: true },
                            { name: 'Store Inventory', value: `${data.components.store_inventory}`, inline: true },
                        )
                        .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                        .setTimestamp();
                    message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
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
                        .setDescription(`:dollar: **${json.components.store_details.store_name}** earned \`$${randomNum}\` from 5 hours of work!`)
                        .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                        .setTimestamp();
                    message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                } else {
                    const json = await getJson(message.author.id);
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ba3c3c')
                        .setDescription(`<a:bangcry:957043444684034148> You've already worked today! You can work again **${moment(json.components.store_details.work_again_date).fromNow()}**!`)
                        .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                        .setTimestamp();
                    message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                }
            }
            async function economyDailyOffer() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }

                const data = await getJson(message.author.id);
                function randomInteger(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
                const jsonData = 'http://ptero.axtonprice.cf:8880/storage/daily_offers.json';
                const values = Object.values(jsonData);
                const randomValue = values[parseInt(Math.random() * values.length)];

                var getRandomItemName = randomValue["name"];
                var getRandomItemCount = randomInteger(2, 4);
                var getRandomItemSingularPrice = randomValue["single_unit_worth"];
                var getRandomItemTotalPrice = getRandomItemSingularPrice * getRandomItemCount;
                var getUserStoreBalance = data.components.store_details.store_balance;
                var getOfferPurchaseId = randomValue["id"];

                if (args[1] == "purchase" && args[2]) {
                    await apiRequest(`customEndpoint?data=confirm_offer&key=offer_id&data=${getOfferPurchaseId}&data1=${encodeURIComponent(getRandomItemCount)}&userId=${message.author.id}`);
                    return;
                } else {

                    const cooldownDate = await apiRequest(`requestData?userId=${message.author.id}&fetchData=economy_offer_cooldown_date`);
                    if (moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isAfter(cooldownDate)) {

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
                            apiRequest(`modifyJson?userId=${message.author.id}&changeKey=economy_offer_cooldown_date&changeValue=null`).then(
                                log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`) // Log completion
                            ); // sets work cooldown
                        });

                    } else {
                        const json = await getJson(message.author.id);
                        const embed = new Discord.MessageEmbed()
                            .setColor('#ba3c3c')
                            .setDescription(`<a:bangcry:957043444684034148> You've already viewed todays offer! Come back **${moment(cooldownDate).fromNow()}**!`)
                            .setFooter({ text: `Executed in ${(new Date() - preInitializationDate) / 1000}s` })
                            .setTimestamp();
                        message.reply({ embeds: [embed] }).then(msg => { log(`» Executed in ${(new Date() - preInitializationDate) / 1000} seconds`); });
                    }
                }

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
            } else if (args[0] === "update") {
                myStoreUpdate();
            } else if (args[0] === "view") {
                economyStoreViewDisplay();
            } else if (args[0] === "work") {
                economyStartWorking();
            } else if (args[0] === "offer") {
                economyDailyOffer();
            } else {
                generalDisplay();
            }

            connection.end();
        };
        await init();
    }
}