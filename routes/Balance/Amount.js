// callback_query --  TRX_30

module.exports = function(bot,users_home){
    

    async function amount_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "amount_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "amount_users"
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
        const adress_list = obj.adress_list;
        bot.on('callback_query', (callbackQuery) => {
            try {
                const chatId = callbackQuery.message.chat.id;
                const data = callbackQuery.data;
                const messageId = callbackQuery.message.message_id;
                switch (data) {
                    case 'TRX_30':
                        bot.deleteMessage(chatId, messageId);
                        IN_TRX(callbackQuery.message.chat.username,callbackQuery.message.chat.id,"30.00",0,0,0)
                        break;
                    case 'TRX_50':
                        bot.deleteMessage(chatId, messageId);
                        IN_TRX(callbackQuery.message.chat.username,callbackQuery.message.chat.id,"50.00",0,0,0)
                        break;
                    case 'TRX_100':
                        bot.deleteMessage(chatId, messageId);
                        IN_TRX(callbackQuery.message.chat.username,callbackQuery.message.chat.id,"100.00",0,0,0)
                        break;
                    case 'TRX_200':
                        bot.deleteMessage(chatId, messageId);
                        IN_TRX(callbackQuery.message.chat.username,callbackQuery.message.chat.id,"200.00",0,0,0)
                        break;
                    case 'TRX_500':
                        bot.deleteMessage(chatId, messageId);
                        IN_TRX(callbackQuery.message.chat.username,callbackQuery.message.chat.id,"500.00",0,0,0)
                        break;
                    case 'TRX_1000':
                        bot.deleteMessage(chatId, messageId);
                        IN_TRX(callbackQuery.message.chat.username,callbackQuery.message.chat.id,"1000.00",0,0,0)
                        break;
                    case 'TRX_💵Another':
                        var mess = "The recharge amount must be an integer"
                        +"\nPlease enter the trx amount to be recharged:"
                        bot.sendMessage(chatId, mess).then((sentMessage) => {
                            var messageId = sentMessage.message_id;
                            bot.once('text', (msg) => {
                                const inputText = msg.text.trim();
                                const isNaturalNumber = /^[1-9]\d*$/.test(inputText);
                                if(isNaturalNumber){
                                    const number = parseInt(inputText);
                                    if(number<10){
                                        bot.sendMessage(chatId, "Minimum deposit 10 TRX")
                                    }else{
                                        bot.deleteMessage(chatId, messageId+1);
                                        IN_TRX(msg.chat.username,msg.chat.id,number.toFixed(2),0,0,0)
                                    }
                                }else{
                                    bot.sendMessage(chatId, "Please enter an integer amount")
                                }
                            })
                        })
                        break;
                    }
            }catch (error) {
                console.log("ERR Amount")
            }
        })
        

        function IN_TRX(username,chatId,amount,i,n,check){
            const fs = require('fs');
            fs.readFile('1.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error('Không thể đọc tệp tin:', err);
                    return;
                }
                // Tách dữ liệu thành mảng bằng dấu xuống dòng "\n"
                const dataArray = data.split('\n');
                // Loại bỏ các khoảng trắng thừa hoặc dòng trống nếu cần
                const cleanDataArray = dataArray.map(line => line.trim()).filter(line => line !== '');
                if(check == "0"){
                    for ( let ii = 0; ii<cleanDataArray.length; ii++){
                        var indexOfAd1 = cleanDataArray[ii].indexOf("time|"); 
                        var indexOfAd2 = cleanDataArray[ii].indexOf("||amount"); 
                        if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
                            time = cleanDataArray[ii].substring(indexOfAd1+5, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                        }
                        if(Date.now()-Number(time)<=11*60*1000){
                            if(cleanDataArray[ii].includes(amount) && cleanDataArray[ii].includes(adress_list[i].adress)){
                                var indexOfAd1 = cleanDataArray[ii].indexOf("userid|"); 
                                var indexOfAd2 = cleanDataArray[ii].indexOf("||messageId"); 
                                if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
                                    userid = cleanDataArray[ii].substring(indexOfAd1+7, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
                                }
                                
        
                                if(userid == chatId) {
                                    setTimeout(function() {
                                        IN_TRX(username,chatId,amount,i,n,1)
                                    }, 0);  
                                    break;
                                }else{
                                    if( n >= 80 ){
                                        i = i+1
                                        n = 0 
                                        amount = Math.floor(amount).toFixed(2);
                                        setTimeout(function() {
                                            IN_TRX(username,chatId,amount,i,n,check)
                                        }, 0); 
                                        break;
                                    }else{
                                        n = Number((n + 1).toFixed(0))
                                        amount = (Number(amount) + 0.01).toFixed(2)
                                        setTimeout(function() {
                                            IN_TRX(username,chatId,amount,i,n,check)
                                        }, 0);  
                                        break;
                                    } 
                                }
                            }else{
                                if(ii == cleanDataArray.length-1){
                                    console.log(username,chatId,amount,i,n,1)
                                    setTimeout(function() {
                                        IN_TRX(username,chatId,amount,i,n,1)
                                    }, 0); 
                                    break;
                                }
                            }
                        }else{
                            
                            setTimeout(function() {
                                IN_TRX(username,chatId,amount,i,n,1)
                            }, 0); 
                            break;
                        } 
                    }
                }
                
                if(check == "1"){
                    var mess = "✔️After recharging, you will get the account balance of " + amount +" (1:1) TRX"
                        + "\n➖➖➖➖➖➖➖➖➖➖➖"
                        + "\nUsername: " + username
                        + "\nID: " + chatId
                        + "\nDeposit amount: *" + amount + " TRX*"
                        + "\nTransfer address: " + adress_list[i].adress
                        + "\n➖➖➖➖➖➖➖➖➖➖➖"
                        + "\nPayment noted:"
                        + "\nPlease copy the amount, please pay attention to the decimal point: *" + amount + " TRX *cannot be shipped if the amount is wrong"                        
                        + "\n*📋Please copy the address to pay, or scan the QR code above to pay"
                        + "\n⏰Please pay within 10 minutes. If you pay overtime or transfer the wrong account, please contact the administrator.*"
                        
                    var path = require('path');
                    const photo = path.join(__dirname, '../../photo/Balance/adress_list', adress_list[i].photo);
                    var inlineKeyboard = {
                        inline_keyboard: [
                            [{ text: '💳Balance', callback_data: '💳Balance||'+ chatId}],
                        ],
                        
                    };

                    bot.sendPhoto(chatId, photo, {
                        caption: mess,
                        reply_markup: JSON.stringify(inlineKeyboard),
                        parse_mode: 'Markdown',
                    }).then(async (sentMessage) => {
                        var messageId = sentMessage.message_id;
                        var updatedData = "time|" + Date.now() + "||"
                            + "amount|" + amount + "||"
                            + "adress|"+ adress_list[i].adress +"||"
                            + "userid|"+ chatId + "||"
                            + "messageId|"+ messageId + "||."
                            + '\n' + data;


                        fs.writeFile('1.txt', updatedData, 'utf8', (err) => {
                            if (err) {
                                console.error('Không thể ghi vào tệp tin:', err);
                                bot.deleteMessage(chatId, messageId);
                                return;
                            }
                            setTimeout(() => {
                                bot.deleteMessage(chatId, messageId);
                            }, 10 * 60 * 1000); // 10 phút
                        });                                             
                    });  
                }
            });
        }
    })
}