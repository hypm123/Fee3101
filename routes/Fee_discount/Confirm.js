// callback_query --  ✅Confirm||   + chatId


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

        bot.on('callback_query', (callbackQuery) => {
            try {
                const chatId = callbackQuery.message.chat.id;
                const data = callbackQuery.data;
                const messageId = callbackQuery.message.message_id;
                const username = callbackQuery.message.chat.username
                var text = callbackQuery.message.text
                if(data.includes("✅Confirm||")){
                    const chatId_check = data.replace("✅Confirm||", "")
                    if(chatId == chatId_check){
                        const chatId = callbackQuery.message.chat.id;
                        const data = callbackQuery.data;
                        const messageId = callbackQuery.message.message_id;
                        var text = callbackQuery.message.text
                    
                        if(text.includes("Receiving address:") && text.includes("Address balance:")&&text.includes("Discount transactions:")){
                            var indexOfAd1 = text.indexOf("Receiving address: "); 
                            var indexOfAd2 = text.indexOf("\nAddress balance:"); 
                            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
                                adress = text.substring(indexOfAd1+19, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                            }
                            var indexOfAd1 = text.indexOf("Selected: "); 
                            var indexOfAd2 = text.indexOf("\nDiscount transactions:"); 
                            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
                                selected = text.substring(indexOfAd1+10, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                            }
                            var indexOfAd1 = text.indexOf("Discount transactions: "); 
                            var indexOfAd2 = text.indexOf("\nFee:"); 
                            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
                                transactions = text.substring(indexOfAd1+23, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                            }
                            var indexOfAd1 = text.indexOf("Fee: "); 
                            var indexOfAd2 = text.indexOf(" TRX\nBalance:"); 
                            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
                                fee = text.substring(indexOfAd1+5, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                            }

                            function check_hours(inputStr) {
                                const letters = inputStr.match(/[a-zA-Z]+/g)[0];
                                const numbers = inputStr.match(/\d+/g)[0];
                                if(!isNaN(numbers)&&(letters.includes("hour")||letters.includes("days"))){
                                    if(letters.includes("hour") && Number(numbers)>0){
                                        return Number(numbers)
                                    }else{
                                        if(letters.includes("days") && Number(numbers)>0){
                                            return Number(numbers)*24
                                        }else{
                                            return false
                                        }
                                    }
                                }else{
                                    return false
                                }
                            }

                            async function main() {
                                var a = await check_adress(adress);
                                var b = await check_hours(selected);
                                if(a != false && b != false&& !isNaN(fee) && !isNaN(transactions)){
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
                                                                selected: selected,
                                                                transactions: transactions,
                                                                adress:adress,
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
                                                    +"\nUsername: " + username
                                                    +"\nReceiving address: " + adress
                                                    +"\nRental duration: " + selected
                                                    +"\nNumber of transfers possible: " + transactions
                                                    +"\nPayment amount: " + fee + " TRX"
                                                    +"\nAccount balance: " + balance_new + " TRX"
                                                    +"*\nNoted: Please use energy within "+ selected +" of validity!*"
                                                
                                                await fast_users(chatId,"")
                                                bot.sendMessage(chatId, mess,{parse_mode: 'Markdown'})
                                                // bot.editMessageText(mess, { chat_id: chatId, message_id: messageId, parse_mode: 'Markdown' });

                                            }else{
                                                bot.sendMessage(chatId, "ERR1231").then(async (sentMessage) => {
                                                    setTimeout(() => {
                                                        bot.deleteMessage(chatId, sentMessage.message_id);
                                                    }, 0.3 * 60 * 1000);
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
                                            }, 0.3 * 60 * 1000);
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
                            
                        }
                    }
                }
            }catch (error) {
                console.log("ERR ✅Confirm")
            }
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