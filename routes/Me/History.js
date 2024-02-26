// callback_query --  📋History|| + chatId 

const user_model = require('../../models/user');

module.exports = function(bot,users_home){
    

    async function me_history_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "me_history_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "me_history_users"
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
                var text = callbackQuery.message.text
                if(data.includes("📋History||")){
                    const chatId_check = data.replace("📋History||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        history(chatId);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR 📋History")
            }
        })
        

        async function history(chatId){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                var data = exit[0].history_list
                var inlineKeyboard = {
                    inline_keyboard: [
                        [{ text: '🔙 🤵Me', callback_data: '🤵Me||'+ chatId}],
                    ],
                    
                };
                var options = {
                    reply_markup: JSON.stringify(inlineKeyboard),
                    parse_mode: 'Markdown'
                };

                if(data.length>0){
                    sl = data.length-1
                    sll = 0
                    if(data.length>9){
                        sll = data.length-9
                    }
                    var mess = ''
                    for(let i >= sl; i=sll;i--){
                        mess = mess
                            + "Order number: " + data[i].orderId + " __ " + i
                            + "\nStatus: " + data[i].status
                            + "\nOrder time: " + data[i].timestamp
                            + "\nReceiving address: " + data[i].adress
                            + "\nRental duration: " + data[i].selected
                            + "\nNumber of transfers possible: " + data[i].transactions
                            + "\nPayment amount: " + data[i].amt + " TRX"
                            + "\nAccount balance: " + data[i].balance + " TRX"
                            + "\n————————————————————"
                            + "\n\n"
                    }
                    
                    bot.sendMessage(chatId, mess,options).then(async (sentMessage) => {
                        var messageId = sentMessage.message_id;
                        await me_history_users(chatId,messageId)
                    })

                }else{
                    var mess = "No data"
                    bot.sendMessage(chatId, mess,options).then(async (sentMessage) => {
                        var messageId = sentMessage.message_id;
                        await me_history_users(chatId,messageId)
                    })
                }
                
            }
        }
    })
}
