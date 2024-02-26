// text --  🤵Me

const user_model = require('../../models/user');

module.exports = function(bot,users_home){

    require("./History")(bot,users_home);

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
            const username = msg.chat.username
            if(messageText == "🤵Me"){
                me(chatId,username);
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
                const username = callbackQuery.message.chat.username;
                if(data.includes("🤵Me||")){
                    const chatId_check = data.replace("🤵Me||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        me(chatId,username);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR 📋History")
            }
        })

        async function me(chatId,username){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                var Balance_trx = exit[0].Balance_trx
                var Balance_usdt = exit[0].Balance_usdt
                var Balance_referra = exit[0].Balance_referra
                var mess = "personal information:"
                    + "\n➖➖➖➖➖➖➖➖"
                    + "\nNickname: " + username
                    + "\nID: " + chatId
                    + "\n\nBalance TRX: " + Balance_trx + " TRX"
                    + "\nBalance USDT: " + Balance_usdt + " USDT"
                    + "\nBalance REFERRAL: " + Balance_referra + " TRX"
                    + "\n➖➖➖➖➖➖➖➖"
                var inlineKeyboard = {
                    inline_keyboard: [
                            [{ text: '📋History', callback_data: '📋History||'+chatId }],
                            [{ text: '❌Close', callback_data: '❌Close' }],
                        ],
                    };
                
                var options = {
                    reply_markup: JSON.stringify(inlineKeyboard),
                };
                bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
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
