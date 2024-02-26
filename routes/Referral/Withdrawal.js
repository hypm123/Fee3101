// text --  🔗Referral


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
        bot.on('callback_query', (callbackQuery) => {
            try {
                const chatId = callbackQuery.message.chat.id;
                const data = callbackQuery.data;
                const messageId = callbackQuery.message.message_id;
                if(data.includes("⬇️Withdrawal||")){
                    const chatId_check = data.replace("⬇️Withdrawal||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        me(chatId);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR ⬇️Withdrawal")
            }
        })

        async function me(chatId){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                var Balance_referra = exit[0].Balance_referra
                if (Balance_referra < 10 ){
                    bot.sendMessage(chatId, "Minimum withdrawal amount is 10 TRX").then(async (sentMessage) => {
                        var messageId = sentMessage.message_id;
                        await me_users(chatId,messageId)
                    })
                }else{
                    bot.sendMessage(chatId, "This function is currently under maintenance").then(async (sentMessage) => {
                        var messageId = sentMessage.message_id;
                        await me_users(chatId,messageId)
                    })
                }
            }
            
        }

    })
}
