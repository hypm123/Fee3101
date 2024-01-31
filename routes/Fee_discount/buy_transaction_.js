// callback_query --  buy_transaction_ + 1 / 2 .. 


const user_model = require('../../models/user');

module.exports = function(bot,users_home){
    const fs = require("fs");
    fs.readFile("./config.json", "utf8", function(err, data){
        if(err){throw err};
        var obj = JSON.parse(data); 
        const fee01 = obj.fee.fee01
        const fee02 = obj.fee.fee02
        const fee03 = obj.fee.fee03
        const fee04 = obj.fee.fee04

        const fee11 = obj.fee.fee11
        const fee12 = obj.fee.fee12
        const fee13 = obj.fee.fee13
        const fee14 = obj.fee.fee14

        const fee31 = obj.fee.fee31
        const fee32 = obj.fee.fee32
        const fee33 = obj.fee.fee33
        const fee34 = obj.fee.fee34

        bot.on('callback_query', (callbackQuery) => {
            try {
                var data = callbackQuery.data;
                const chatId = callbackQuery.message.chat.id;
                const messageId = callbackQuery.message.message_id;
                const text_check = callbackQuery.message.text
                var text = callbackQuery.message.text
                if(data.includes("buy_transaction_")){
                    const parts = data.split("_")
                    if (data.includes("buy_transaction_")) {
                        number = parts[2];
                        data = "buy_transaction"
                    }
                    
                    const indexOfAd = text.indexOf("rentals"); 
                    if (indexOfAd !== -1) { 
                        text = text.substring(0, indexOfAd + 10); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                    }
                    
                    main()
                    async function main() {
                        const exit = await user_model.find({id_user:chatId});
                        if(exit.length == 1){
                            var Balance_trx = exit[0].Balance_trx
                            var buy_transaction_01 = "1"
                            var buy_transaction_02 = "2"
                            var buy_transaction_03 = "5"
                            var buy_transaction_04 = "10"
                            var buy_transaction_11 = "2"
                            var buy_transaction_12 = "5"
                            var buy_transaction_13 = "10"
                            var buy_transaction_14 = "50"
                            var buy_transaction_31 = "10"
                            var buy_transaction_32 = "30"
                            var buy_transaction_33 = "50"
                            var buy_transaction_34 = "100"
                            switch (data) {
                            case 'buy_transaction':
                                var Selected = "ERR"
                                var fee = "ERR"
                                var all_vl = 0
                                switch (number) {
                                case '01':
                                    Selected = "1 hour"
                                    vl = "1"
                                    fee = fee01
                                    buy_transaction_01 = "1✅"
                                    break;
                                case '02':
                                    Selected = "1 hour"
                                    vl = "2"
                                    fee = fee02
                                    buy_transaction_02 = "2✅"
                                    break;
                                case '03':
                                    Selected = "1 hour"
                                    vl = "5"
                                    fee = fee03
                                    buy_transaction_03 = "5✅"
                                    break;
                                case '04':
                                    Selected = "1 hour"
                                    vl = "10"
                                    fee = fee04
                                    buy_transaction_04 = "10✅"
                                    break;
                            
                                case '11':
                                    Selected = "1 days"
                                    vl = "2"
                                    fee = fee11
                                    buy_transaction_11 = "2✅"
                                    break;
                                case '12':
                                    Selected = "1 days"
                                    vl = "5"
                                    fee = fee12
                                    buy_transaction_12 = "5✅"
                                    break;
                                case '13':
                                    Selected = "1 days"
                                    vl = "10"
                                    fee = fee13
                                    buy_transaction_13 = "10✅"
                                    break;
                                case '14':
                                    Selected = "1 days"
                                    vl = "50"
                                    fee = fee14
                                    buy_transaction_14 = "50✅"
                                    break;

                                case '31':
                                    Selected = "3 days"
                                    vl = "10"
                                    all_vl = 30
                                    fee = fee31
                                    buy_transaction_31 = "10✅"
                                    break;
                                case '32':
                                    Selected = "3 days"
                                    vl = "30"
                                    all_vl = 90
                                    fee = fee32
                                    buy_transaction_32 = "30✅"
                                    break;
                                case '33':
                                    Selected = "3 days"
                                    vl = "50"
                                    all_vl = 150
                                    fee = fee33
                                    buy_transaction_33 = "50✅"
                                    break;
                                case '34':
                                    Selected = "3 days"
                                    vl = "100"
                                    all_vl = 300
                                    fee = fee34
                                    buy_transaction_34 = "100✅"
                                    break;
                                }
                                var mess = text + "\n\n*Selected: " + Selected
                                    + "\nDiscount transactions: " + vl
                                    + "\nFee: " + fee + " TRX"
                                    + "\nBalance: " + Balance_trx + " TRX"
                                    +"*"
                                    
                                var mess1 = "\n--------"
                                    + "\nDiscount transactions will be reset everyday."
                                    + "\nAll transactions: *" + all_vl + "*"
                                    + "\nPrice/transaction: *≈" + (fee/all_vl).toFixed(2) + " TRX*"
                                    
                                if(all_vl>0){
                                    mess = mess + mess1
                                }
                                    
                                var inlineKeyboard = {
                                    inline_keyboard: [
                                        [{ text: '⬇️Valid for 1 hour⬇️', callback_data: '⬇️' }],
                                        [{ text: buy_transaction_01, callback_data: 'buy_transaction_01' },{ text: buy_transaction_02, callback_data: 'buy_transaction_02' },{ text: buy_transaction_03, callback_data: 'buy_transaction_03' },{ text: buy_transaction_04, callback_data: 'buy_transaction_04' }],
                                        [{ text: '⬇️Valid for 1 days⬇️', callback_data: '⬇️' }],
                                        [{ text: buy_transaction_11, callback_data: 'buy_transaction_11' },{ text: buy_transaction_12, callback_data: 'buy_transaction_12' },{ text: buy_transaction_13, callback_data: 'buy_transaction_13' },{ text: buy_transaction_14, callback_data: 'buy_transaction_14' }],
                                        [{ text: '⬇️Valid for 3 days⬇️', callback_data: '⬇️' }],
                                        [{ text: buy_transaction_31, callback_data: 'buy_transaction_31' },{ text: buy_transaction_32, callback_data: 'buy_transaction_32' },{ text: buy_transaction_33, callback_data: 'buy_transaction_33' },{ text: buy_transaction_34, callback_data: 'buy_transaction_34' }],
                                        [{ text: '✅Confirm', callback_data: '✅Confirm||' + chatId }],
                                        [{ text: '🔙 ⚡Fee discount', callback_data: '⚡Fee discount||'+ chatId}],
                                        [{ text: '❌Cancel', callback_data: '❌Close' }],
                                    ],
                                };
                                
                                var options = {
                                    reply_markup: JSON.stringify(inlineKeyboard),
                                    parse_mode: 'Markdown'
                                };
                                if(text_check!==mess.replace(/\*/g, "")){
                                    bot.editMessageText(mess, { chat_id: chatId, message_id: messageId, reply_markup: options.reply_markup, parse_mode: 'Markdown' }).then(async (sentMessage) => {
                                        // await fast_users(chatId, sentMessage.message_id);
                                        // kh add
                                    })

                                }

                                setTimeout(() => {
                                    bot.deleteMessage(chatId, messageId);
                                }, 10 * 60 * 1000); // 10 phút
                            }
                        }else{
                            bot.sendMessage(chatId, "ERR4!!!").then(async (sentMessage) => {
                                setTimeout(() => {
                                    bot.deleteMessage(chatId, sentMessage.message_id);
                                }, 0.1 * 60 * 1000);
                            })
                        }
                    
                    }
                }
            }catch (error) {
                console.log("ERR buy_transaction_")
            }
        })
    })
}
