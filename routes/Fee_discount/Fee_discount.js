// text --  ⚡Fee discount

const user_model = require('../../models/user');

module.exports = function(bot,users_home){

    require("./Fast1_time")(bot,users_home);
    require("./Time_rental")(bot,users_home);
    require("./Confirm")(bot,users_home);

    async function fee_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "fee_users",
                    messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "fee_users"
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
        const fast1 = obj.fee.adress_fast1
        bot.on('text', (msg) => {
            const chatId = msg.chat.id;
            const messageText = msg.text;
            const messageId = msg.message_id
            const username = msg.chat.username
            if(messageText == "⚡Fee discount"){
                me(chatId,username);
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
                if(data.includes("⚡Fee discount||")){
                    const chatId_check = data.replace("⚡Fee discount||", "")
                    if(chatId == chatId_check){
                        bot.deleteMessage(chatId, messageId);
                        me(chatId,username);
                        return;
                    }
                }
            }catch (error) {
                console.log("ERR ⚡Fee discount")
            }
        })

        async function me(chatId){
            const path = require('path');
            const photo = path.join(__dirname, '../../photo/Fee_discount/Fast', 'Fast1.png');
            var inlineKeyboard = {
                inline_keyboard: [
                    [{ text: '⚡️Fast 1 transaction', callback_data: '⚡️Fast 1 transaction||' + chatId}],
                    [{ text: '⏰Time rental', callback_data: '⏰Time rental||' +  chatId}],
                    [{ text: '❌Close', callback_data: '❌Close' }],
                ],
            };
            
            var mess = "🔋Renting Discount to U does not consume TRX🔋"
                    + "\nPlease transfer TRX to the 🔻 address below to quickly rent discount."
                    + "\nThe robot will automatically send discount to the payment address within 6 seconds."
                    + "\n\n⚡️Discount flash rent address (click to copy)"
                    + "\n\n"+fast1
                    + "\n\n⚠️Note: This is not the redemption address for TRX❗️To redeem TRX, please click Instant Redeem❗️"
                    + "\n\n⚡️ Transfer 5 TRX = one free transfer."
                    + "\n⚡️ Transfer 10 TRX = Two transfers for free."
                    + "\n⚡️ Transfer 15 TRX = Four transfers for free."
                    + "\n\n⚠️Note:"
                    + "\n*1. Transferring money to an address without U requires double the discount."
                    + "\n2. Please use the discount within 1 hour, otherwise it will expire and be recycled."
                    + "\n3. Be sure to transfer a multiple of 6 TRX, otherwise the lease will fail."
                    + "\n4. If you want customized rental, please use the following ✏️number of purchase items, ✏️ number of managed items, ⏰time rental"
                    + "\n*Time rental can directly send the address without clicking the time rental button."
                

            var options = {
                caption: mess,
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(inlineKeyboard),
            };
            bot.sendPhoto(chatId, photo, options).then(async (sentMessage) => {
                var messageId = sentMessage.message_id;
                await fee_users(chatId,messageId)
            })
        }

    })
}