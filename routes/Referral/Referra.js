// text --  🔗Referral


const user_model = require('../../models/user');

module.exports = function(bot,users_home){

    require("./Withdrawal")(bot,users_home);

    async function me_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "me_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "me_users"
                users_home[user_id].messageId = messageId
                await bot.deleteMessage(user_id, id)
                return true
            }
        } catch (error) {
            return false
        }
    }

    const fs = require("fs");
    fs.readFile("./config.json", "utf8", function(err, data){
        if(err){throw err};
        var obj = JSON.parse(data); 
        bot.on('text', (msg) => {
            const chatId = msg.chat.id;
            const messageText = msg.text;
            const messageId = msg.message_id
            if(messageText == "🔗Referral"){
                me(chatId);
                setTimeout(() => {
                    bot.deleteMessage(chatId, messageId);
                }, 0.1 * 60 * 1000); // 10 phút
                return;
            }
        });

        bot.on('callback_query', (callbackQuery) => {
            try {
                const chatId = callbackQuery.message.chat.id;
                const data = callbackQuery.data;
                const messageId = callbackQuery.message.message_id;
                if(data.includes("🔗Referral||")){
                    const chatId_check = data.replace("🔗Referral||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        me(chatId);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR 🔗Referral")
            }
        })

        async function me(chatId){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                const path = require('path');
                const photo = path.join(__dirname, '../../photo/Referral', 'Referral.png');

                var Balance_referra = exit[0].Balance_referra
                var mess = "*REFERRAL PROGRAM*"
                    + "\n➖➖➖➖➖➖➖➖"
                    + "\n\nBalance REFERRAL: *" + Balance_referra + " TRX*"
                    + "\n\nID REFERRAL: " + chatId
                    + "\n➖➖➖➖➖➖➖➖"
                var inlineKeyboard = {
                    inline_keyboard: [
                            [{ text: '️️⬇️Withdrawal', callback_data: '⬇️Withdrawal||'+chatId }],
                            [{ text: '❌Close', callback_data: '❌Close' }],
                        ],
                    };
                
                var options = {
                    caption: mess,
                    parse_mode: 'Markdown',
                    reply_markup: JSON.stringify(inlineKeyboard),
                };
                bot.sendPhoto(chatId, photo, options).then(async (sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await me_users(chatId,messageId)
                })
            }else{
                bot.sendMessage(chatId, "ERR1!!!").then(async (sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await me_users(chatId,messageId)
                })
            }
        }

    })
}