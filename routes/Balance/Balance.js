// text --  💳Balance

const user_model = require('../../models/user');

module.exports = function(bot,users_home){

    require("./Amount")(bot,users_home);

    async function balance_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "balance_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "balance_users"
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
            if(messageText == "💳Balance"){
                balance(chatId,username);
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
                if(data.includes("💳Balance||")){
                    const chatId_check = data.replace("💳Balance||", "")
                    if(chatId == chatId_check){
                        // bot.deleteMessage(chatId, messageId);
                        balance(chatId,username);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR 💳Balance")
            }
        })

        async function balance(chatId,username){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                var Balance_trx = exit[0].Balance_trx
                var Balance_usdt = exit[0].Balance_usdt
                var Balance_referra = exit[0].Balance_referra
                
                var mess = "The balance can be used for direct consumption conveniently and quickly:"
                    + "\n➖➖➖➖➖➖➖➖"
                    + "\nUsername: " + username
                    + "\nID: " + chatId
                    + "\nTRX balance: "+Balance_trx" TRX " 
                    + "\nUSDT balance: "+Balance_usdt+" USDT"
                    + "\nPlease select the recharge amount"
                var inlineKeyboard = {
                    inline_keyboard: [
                        [{ text: '⬇️Send TRX⬇️', callback_data: '⬇️Send TRX⬇️' }],
                        [{ text: '30', callback_data: 'TRX_30' },{ text: '50', callback_data: 'TRX_50' },{ text: '100', callback_data: 'TRX_100' }],
                        [{ text: '200', callback_data: 'TRX_200' },{ text: '500', callback_data: 'TRX_500' },{ text: '1000', callback_data: 'TRX_1000' }],
                        [{ text: '💵Another', callback_data: 'TRX_💵Another' }],
                        [{ text: '❌Close', callback_data: '❌Close' }],
                    ],
                };
                
                var options = {
                    reply_markup: JSON.stringify(inlineKeyboard),
                };
                bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await balance_users(chatId,messageId)
                })
            }else{
                bot.sendMessage(chatId, "ERR1!!!").then(async (sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await balance_users(chatId,messageId)
                })
            }
        }

    })
}
