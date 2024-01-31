const express = require("express");
const fs = require("fs");
const { resolve } = require("path");
const request = require('request-promise');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
var users_home = {};

fs.readFile("./config.json", "utf8", function(err, data){
    if(err){throw err};
    var obj = JSON.parse(data); 
    const token = obj.token_tele.token
    const opt = {polling: true};
    const bot = new TelegramBot(token, opt);
    bot.onText(/\/id/, (msg) => {
        console.log(msg.chat.id)
        var mess = "ID: " + msg.from.id + "\nID_gr: " + msg.chat.id
        bot.sendMessage(msg.chat.id, mess)
    })

    //mongoose
    var mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://'+obj.mongodb.username+':'+obj.mongodb.password+'@'+obj.mongodb.server+'/'+obj.mongodb.dbname+'?retryWrites=true&w=majority', function(err){
        if(err){throw err;}else{
            console.log("Mongodb connected successfully.");
            require("./routes/start")(bot,users_home);
            require("./routes/get_history")(bot); // check hisrory ví list
            require("./routes/up_balance")(bot); // up số dư lên user sau khi get_history
        }
    });
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});



