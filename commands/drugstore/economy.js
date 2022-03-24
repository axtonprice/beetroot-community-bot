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
            async function economyStartWorking() {
                if (await apiRequest(`requestData?userId=${message.author.id}&fetchData=doesStoreExist`) === "false") {
                    noStoreDisplay();
                    return;
                }
                var authorUserId = message.author.id;
                var authorUserName = message.author.username;
                const data = await getJson(authorUserId);
                json = data;
                var hasCooldownPassed = moment(moment(new Date()).format("YYYY-MM-DD HH:mm:ss")).isAfter(json.components.store_details.work_again_date);
                if (hasCooldownPassed) {
                    function randomInteger(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
                    var randomNum = randomInteger(85, 100);
                    json.components.store_details.store_balance = parseInt(json.components.store_details.store_balance) + randomNum;

                    value = parseInt(json.components.store_details.store_balance) + randomNum;
                    apiRequest(`modifyJson?userId=${authorUserId}&changeKey=store_balance&changeValue=${randomNum}`); // updates store balance
                    apiRequest(`modifyJson?userId=${authorUserId}&changeKey=work_again_date&changeValue=null`); // sets work cooldown

                    const embed = new Discord.MessageEmbed()
                        .setColor('#00ff00')
                        .setDescription(`:dollar: **Axton's Drugstore** earned \`$${randomNum}\` from 5 hours of work!`)
                    message.reply({ embeds: [embed] });
                } else {
                    const json = await getJson(message.author.id);
                    const embed = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setDescription(`<:890516515844157510:954613427991638076> You've already worked today! You can work again **${moment(json.components.store_details.work_again_date).fromNow()}**!`)
                    message.reply({ embeds: [embed] });
                }
            }

            /* 
                Function Loader Handler 
            */

            if (args[0] === "work") {
                economyStartWorking();
                scrubDatabase();
            }

            connection.end();
        };
        await init();
        // message.reactions.removeAll();
    }
}