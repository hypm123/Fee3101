// callback_query --  ⚡️Fast 1 transaction|| + chatId 
// ✅Confirm||

const user_model = require('../../models/user');

module.exports = function(bot,users_home){
    

    


    async function fast_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "fast_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "fast_users"
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
        const fast1 = obj.fee.fee_fast1
        const fee_hh = obj.fee.fee_gt


        bot.on('callback_query', (callbackQuery) => {
            try {
                const chatId = callbackQuery.message.chat.id;
                const data = callbackQuery.data;
                const messageId = callbackQuery.message.message_id;
                var text = callbackQuery.message.text
                if(data.includes("⚡️Fast 1 transaction||")){
                    const chatId_check = data.replace("⚡️Fast 1 transaction||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        history(chatId);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR ⚡️Fast 1 transaction||")
            }
        })
        
        async function history(chatId){
            const exit = await user_model.find({id_user:chatId});
            if(exit.length == 1){
                const path = require('path');
                const photo = path.join(__dirname, '../../photo/Fee_discount/Fast', 'exam_buy.png');
                var mess ="You can use the following command for quick ordering" 
                + "\n /buy [space] (address)"
                + "\n /buy TSTVYwFDp7SBfZk7Hrz3tucwQVASyJdwC7"

                + "\n\n⬇️➖➖➖➖➖➖➖➖⬇️"
                +"\nPlease enter your address (you can directly enter the address to place an order)"
                
                var inlineKeyboard = {
                    inline_keyboard: [
                        [{ text: '🔙 ⚡Fee discount', callback_data: '⚡Fee discount||'+ chatId}],
                    ],
                    
                };

                var options = {
                    reply_markup: JSON.stringify(inlineKeyboard),
                    caption: mess
                };

                bot.sendPhoto(chatId, photo, options).then(async(sentMessage) => {
                    var messageId = sentMessage.message_id;
                    await fast_users(chatId,messageId)
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
                                            if(Balance_trx>=Number(fast1)){
                                                var mess = "Please place an order as needed to avoid waste! Repeatable purchases"
                                                    + "\n➖➖➖➖➖➖➖➖➖➖"
                                                    + "\nReceiving address: " + inputText
                                                    + "\nAddress balance: " + balance_trx + " TRX"
                                                    + "\nAvailable Fee discount: " + sl_fee
                                                    + "\n➖➖➖➖➖➖➖➖➖➖"

                                                    +"\n\n*Selected: " + "1 hours"
                                                    + "\nDiscount transactions: " + "1"
                                                    + "\nFee: " + fast1 + " TRX"
                                                    + "\nBalance: " + Balance_trx + " TRX"
                                                    +"*"
                                                var inlineKeyboard = {
                                                    inline_keyboard: [
                                                        [{ text: '✅Confirm', callback_data: '✅Confirm||' + chatId }],
                                                        [{ text: '❌Cancel', callback_data: '❌Close' }],
                                                    ],
                                                };
                                                var options = {
                                                    reply_markup: JSON.stringify(inlineKeyboard),
                                                    parse_mode: 'Markdown'
                                                };
                                                bot.sendMessage(chatId, mess,options).then(async (sentMessage) => {
                                                    var message_id = sentMessage.message_id
                                                    await fast_users(chatId,message_id)
                                                })
                                            }else{
                                                bot.sendMessage(chatId, "If the balance is insufficient, please recharge and try again.").then(async (sentMessage) => {
                                                    setTimeout(() => {
                                                        bot.deleteMessage(chatId, sentMessage.message_id);
                                                    }, 0.3 * 60 * 1000);
                                                })
                                            }
                                            
                                        }else{
                                            bot.sendMessage(chatId, "ERR2!!!").then(async (sentMessage) => {
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

        bot.onText(/\/buy (.+)/, (msg, match) => {
            const chatId = msg.chat.id
            setTimeout(() => {
                bot.deleteMessage(chatId, msg.message_id);
            }, 0.3 * 60 * 1000);

            async function main() {
                var adress = match[1]
                var a =  await check_adress(adress);
                var b = 1;
                const fee = fast1
                const transactions = 1
                if(a != false && !isNaN(fee) && !isNaN(transactions)){
                    const exit = await user_model.find({id_user:chatId});
                    if(Number(fee) > 0 && Number(transactions)>0 && Number(b)>0 && exit.length == 1) {
                        var balance_new = Number((exit[0].Balance_trx - Number(fee)).toFixed(2))
                        if (balance_new>=0){
                            var buy_en = await buy_enn(transactions,b,adress)
                            if(buy_en!= false){
                                var orderId = buy_en.orderId
                                var orderMoney = buy_en.orderMoney
                                var hash = buy_en.hash[0]
                                await user_model.findOneAndUpdate(
                                    { id_user:chatId },
                                    { 
                                        Balance_trx: balance_new,
                                        $push: {
                                            history_list:{
                                                type: "out",
                                                amt: Number(fee),
                                                timestamp:Date.now(),
                                                selected: "1 hour",
                                                transactions: "1",
                                                adress: adress,
                                                status: "Sucess",
                                                balance: balance_new,

                                                orderId: orderId,
                                                orderMoney: orderMoney,
                                                hash: hash
                                            }
                                        }
                                    }
                                );

                                var mess = "🎉🎉 Successful 🎉🎉"
                                    +"\nOrder number: " + orderId
                                    +"\nUsername: " + msg.chat.username
                                    +"\nReceiving address: " + adress
                                    +"\nRental duration: " + "1 hour"
                                    +"\nNumber of transfers possible: " + transactions
                                    +"\nPayment amount: " + fee + " TRX"
                                    +"\nAccount balance: " + balance_new + " TRX"
                                    +"*\nNoted: Please use energy within 1 hour of validity!*"
                                bot.sendMessage(chatId, mess , {parse_mode: 'Markdown'}).then(async (sentMessage) => {
                                    // var message_id = sentMessage.message_id
                                    // await fast_users(chatId,message_id)
                                    await balance_fee_gt(chatId,fee,fee_hh)
                                })
                            }else{
                                bot.sendMessage(chatId, "ERR1231").then(async (sentMessage) => {
                                    setTimeout(() => {
                                        bot.deleteMessage(chatId, sentMessage.message_id);
                                    }, 0.1 * 60 * 1000);
                                })
                            }
                        }else{
                            bot.sendMessage(chatId, "If the balance is insufficient, please recharge and try again.").then(async (sentMessage) => {
                                setTimeout(() => {
                                    bot.deleteMessage(chatId, sentMessage.message_id);
                                }, 0.3 * 60 * 1000);
                            })
                        }
                       
                    }else{
                        bot.sendMessage(chatId, "ERR1231").then(async (sentMessage) => {
                            setTimeout(() => {
                                bot.deleteMessage(chatId, sentMessage.message_id);
                            }, 0.1 * 60 * 1000);
                        })
                    }
                }else{
                    bot.sendMessage(chatId, "This address is not activated, please verify activation and try again").then(async (sentMessage) => {
                        setTimeout(() => {
                            bot.deleteMessage(chatId, sentMessage.message_id);
                        }, 0.3 * 60 * 1000);
                    })
                }
            }
            
            main();
        })
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

async function buy_enn(transactions,time,address){
    const axios = require('axios');
    const requestData = {
        username: "hypm123",
        password: "Tien12062000",
        resType: "ENERGY",
        payNums: Number((32000*Number(transactions)).toFixed(0)), 
        rentTime: Number(time), // hours
        resLock: 0,
        receiveAddress: address
    };
    const url = "https://tronfee.io/api/pay";
    try {
        const response = await axios.post(url, requestData);
        if (response.data.code === 10000) {
            const balance = (response.data.data.balance / 1000000).toFixed(2);
            const fee = response.data.data.orderMoney;
            const yourOrderId = response.data.data.orderId;
            return response.data.data
            /*
            {
                orderId: '1704766920344164',
                balance: 239140000,
                orderMoney: 1.5,
                hash: [
                    'bc75e67c845b62c8ab2becb3d0602177372c9f164caff7843f0feaddec3ffef3'
                ]
            }
            */
        } else {
            console.log(response.data.msg)
            return false
        }
    } catch (error) {
        console.error("Lỗi:", error);
        return false
    }
}
// const fee_hh = obj.fee.fee_gt
// await balance_fee_gt(chatId,fee,fee_hh)
async function balance_fee_gt(user_id,amount,fee) {
    try {
        const exit = await user_model.find({id_user:user_id});
        if(exit.length == 1){
            const exit1 = await user_model.find({id_user:exit[0].User_gt});
            if(exit1.length == 1){
                var Balance_referra = exit1[0].Balance_referra
                var amount_add = (Number(amount)*Number(fee)/100).toFixed(2)
                balance_new = Number((Number(Balance_referra) + Number(amount_add)).toFixed(2))

                await user_model.findOneAndUpdate(
                    { id_user:exit[0].User_gt },
                    { Balance_referra: balance_new}
                );
            }
        }

    } catch (error) {
        return false
    }
}