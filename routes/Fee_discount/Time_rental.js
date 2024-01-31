// callback_query --  ⏰Time rental|| + chatId 

const user_model = require('../../models/user');

module.exports = function(bot,users_home){
    
    require("./buy_transaction_")(bot,users_home);
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
                if(data.includes("⏰Time rental||")){
                    const chatId_check = data.replace("⏰Time rental||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        history(chatId);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR ⏰Time rental")
            }
        })
        

        async function history(chatId){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                var mess = "Please enter your address (you can directly enter the address to place an order)"
                bot.sendMessage(chatId, mess).then(async (sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await me_history_users(chatId,messageId)
                    A1_me0(chatId,messageId,0)
                    async function A1_me0(chatId,messageId,check1){
                        let shouldExecuteTextHandler = true;
                        bot.on('callback_query', (callbackQuery) => {
                            if(chatId == callbackQuery.message.chat.id){
                                shouldExecuteTextHandler = false;
                            }
                        })

                        bot.once('text', async (msg) => {
                            const inputText = msg.text;
                            if(chatId !== msg.chat.id){
                                A1_me0(chatId,messageId,0)
                            }else{
                                if(!inputText.includes("/") && inputText !== "⚡Fee discount" && inputText !== "🔎Check Wallet" && inputText !== "💳Balance"&& inputText !== "🤵Me" && shouldExecuteTextHandler){
                                    setTimeout(() => {
                                        bot.deleteMessage(chatId, msg.message_id);
                                    }, 0.1 * 60 * 1000);

                                    var check = await check_adress(inputText);
                                    if(check == false){
                                        bot.sendMessage(chatId, "This address is not activated, please verify activation and try again").then(async (sentMessage) => {
                                            setTimeout(() => {
                                                bot.deleteMessage(chatId, sentMessage.message_id);
                                            }, 1 * 60 * 1000);
                                        })
                                        if(check1<3){
                                            A1_me0(chatId,messageId,check1+1)
                                        }
                                    }else{
                                        var balance_trx = check.balance_trx
                                        var sl_fee = check.sl_fee
                                        const exit = await user_model.find({id_user:chatId});
                                        if(exit.length == 1){
                                            var Balance_trx = exit[0].Balance_trx
                                            var mess = "Please place an order as needed to avoid waste! Repeatable purchases"
                                                    + "\n➖➖➖➖➖➖➖➖➖➖"
                                                    + "\nReceiving address: " + inputText
                                                    + "\nAddress balance: " + balance_trx + " TRX"
                                                    + "\nAvailable Fee discount: " + sl_fee
                                                    + "\n➖➖➖➖➖➖➖➖➖➖"
                                                    + "\n\n⬇️Please select the rental period and number of rentals⬇️"                                            
                                            var inlineKeyboard = {
                                                inline_keyboard: [
                                                    [{ text: '⬇️Valid for 1 hour⬇️', callback_data: '⬇️' }],
                                                    [{ text: '1', callback_data: 'buy_transaction_01' },{ text: '2', callback_data: 'buy_transaction_02' },{ text: '5', callback_data: 'buy_transaction_03' },{ text: '10', callback_data: 'buy_transaction_04' }],
                                                    [{ text: '⬇️Valid for 1 days⬇️', callback_data: '⬇️' }],
                                                    [{ text: '2', callback_data: 'buy_transaction_11' },{ text: '5', callback_data: 'buy_transaction_12' },{ text: '10', callback_data: 'buy_transaction_13' },{ text: '50', callback_data: 'buy_transaction_14' }],
                                                    [{ text: '⬇️Valid for 3 days⬇️', callback_data: '⬇️' }],
                                                    [{ text: '10', callback_data: 'buy_transaction_31' },{ text: '30', callback_data: 'buy_transaction_32' },{ text: '50', callback_data: 'buy_transaction_33' },{ text: '100', callback_data: 'buy_transaction_34' }],
                                                    [{ text: '🔙 ⚡Fee discount', callback_data: '⚡Fee discount||'+ chatId}],
                                                    [{ text: '❌Close', callback_data: '❌Close' }],
                                                ],
                                            };
                                            
                                            var options = {
                                                reply_markup: JSON.stringify(inlineKeyboard),
                                            };
                                            bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                                                var message_id = sentMessage.message_id
                                                await me_history_users(chatId,message_id)
                                            })
                                            
                                        }else{
                                            bot.sendMessage(chatId, "ERR3!!!").then(async (sentMessage) => {
                                                setTimeout(() => {
                                                    bot.deleteMessage(chatId, sentMessage.message_id);
                                                }, 0.1 * 60 * 1000);
                                            })
                                        }
                                        

                                    }
                                }
                            }
                            
                        
                            

                            
                        })
                    }
                })
                
            }
        }
    })
}

async function check_adress(address) {
    try {
        const axios = require('axios');
        const apiUrl2 = `https://apilist.tronscanapi.com/api/accountv2?address=${address}`;
        // Sử dụng axios để lấy dữ liệu từ URL
        const response2 = await axios.get(apiUrl2);
        const data = response2.data.activated || false
        if(data == false){
            return false
        }else{
            var balance_trx = (response2.data.balance/1000000).toFixed(2)
            var sl_fee = (response2.data.bandwidth.energyRemaining/32000).toFixed(0)
            return{"balance_trx":balance_trx,"sl_fee":sl_fee}
        }
    }catch (error) {
        return false;
    }

}