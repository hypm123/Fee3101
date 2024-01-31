// text --  👩‍💻Contact Support

const user_model = require('../../models/user');

module.exports = function(bot,users_home){

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
            if(messageText == "👩‍💻Contact Support"){
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
                if(data.includes("👩‍💻Contact Support||")){
                    const chatId_check = data.replace("👩‍💻Contact Support||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        me(chatId);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR 📋History")
            }
        })

        async function me(chatId){
            var mess = "https://t.me/TRX_SP"
            bot.sendMessage(chatId, mess).then(async (sentMessage) => {
                var messageId = sentMessage.message_id;
                await me_users(chatId,messageId)
            })
        }

    })
}