// text --  🔎Check Wallet
// /check [space] (address)

const user_model = require('../../models/user');

module.exports = function(bot,users_home){

    async function check_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "Check_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "Check_users"
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
            if(messageText == "🔎Check Wallet"){
                me(chatId);
                setTimeout(() => {
                    bot.deleteMessage(chatId, messageId);
                }, 0.1 * 60 * 1000); // 10 phút
                return;
            }
        });

        bot.onText(/\/check (.+)/, async (msg, match) => {
            const chatId = msg.chat.id
            var adress = match[1]
            setTimeout(() => {
                bot.deleteMessage(chatId, msg.message_id);
            }, 0.1 * 60 * 1000);

            var check = await check_adress(adress);
            var balance_trx = check.balance_trx
            var sl_fee = check.sl_fee
            if(check == false){
                bot.sendMessage(chatId, "This address is not activated, please verify activation and try again").then(async (sentMessage) => {
                    setTimeout(() => {
                        bot.deleteMessage(chatId, sentMessage.message_id);
                    }, 0.1 * 60 * 1000);
                })
            }else{
                var mess = "\nAddress: " + adress
                        + "\nAddress balance: *" + balance_trx + " TRX*"
                        + "\nAvailable Fee discount: *" + sl_fee
                        + "\n*➖➖➖➖➖➖➖➖➖➖"
                                        
                
                bot.sendMessage(chatId, mess, {parse_mode: 'Markdown'}).then(async (sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await check_users(chatId,messageId)
                })
            }
            
        })

        

        async function me(chatId){
            const path = require('path');
            const photo = path.join(__dirname, '../../photo/Check_Wallet', 'exam_check.png');
            var mess = "You can use the following command to check the number of discounted transfers."
                    + "\n\n/check [space] (address)"
                    + "\n/check TSTVYwFDp7SBfZk7Hrz3tucwQVASyJdwC7"
                    + "\n\n⬇️➖➖➖➖➖➖➖➖⬇️"
                    + "\nPlease enter your address (you can directly enter the address to check)"
            
            var options = {
                caption: mess
            };
            bot.sendPhoto(chatId, photo, options).then(async (sentMessage) => {
                var messageId = sentMessage.message_id;
                await check_users(chatId,messageId)
                A1_me0(chatId,messageId,0)
                async function A1_me0(chatId,messageId,check1){
                    let shouldExecuteTextHandler = true;
                    bot.on('callback_query', (callbackQuery) => {
                        if(chatId == callbackQuery.message.chat.id){
                            shouldExecuteTextHandler = false;
                        }
                    })

                    bot.once('text', async (msg) => {
                        try{
                            const inputText = msg.text;
                            if(chatId !== msg.chat.id){
                                A1_me0(chatId,messageId,0)
                            }else{
                                if(shouldExecuteTextHandler && !inputText.includes("/") && inputText !== "⚡Fee discount" && inputText !== "🔎Check Wallet" && inputText !== "💳Balance"&& inputText !== "🤵Me"){
                                    setTimeout(() => {
                                        bot.deleteMessage(chatId, msg.message_id);
                                    }, 0.1 * 60 * 1000);

                                    var check = await check_adress(inputText);
                                    var balance_trx = check.balance_trx
                                    var sl_fee = check.sl_fee
                                    if(check == false){
                                        bot.sendMessage(chatId, "This address is not activated, please verify activation and try again").then(async (sentMessage) => {
                                            setTimeout(() => {
                                                bot.deleteMessage(chatId, sentMessage.message_id);
                                            }, 0.3 * 60 * 1000);
                                        })
                                        if(check1<3){
                                            A1_me0(chatId,messageId,check1+1)
                                        }
                                    }else{
                                        var mess = "\nAddress: " + inputText
                                                + "\nAddress balance: *" + balance_trx + " TRX*"
                                                + "\nAvailable Fee discount: *" + sl_fee
                                                + "*\n➖➖➖➖➖➖➖➖➖➖"
                                                            
                                        
                                        bot.sendMessage(chatId, mess, {parse_mode: 'Markdown'}).then(async (sentMessage) => {
                                            var messageId = sentMessage.message_id;
                                            await check_users(chatId,messageId)
                                        })
                                    }
                                }
                            }
                        } catch (error) {
                            console.log("gethistory_ERR")
                            
                        }
                    })
                }
            })
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