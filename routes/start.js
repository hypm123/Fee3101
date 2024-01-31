// text --  /start

const user_model = require('../models/user');

module.exports = function(bot,users_home){
    require("./Me/Me")(bot,users_home);
    require("./Balance/Balance")(bot,users_home);
    require("./Check_Wallet/Check_Wallet")(bot,users_home);
    require("./Fee_discount/Fee_discount")(bot,users_home);
    require("./Contact_Support/ContactSupport")(bot,users_home);
    require("./Referral/Referra")(bot,users_home);

    async function start_users(user_id,messageId) {
        try {
            if (!users_home[user_id]) {
                users_home[user_id] = {
                    check: "start_users",
                    // messageId: messageId,
                };
                return true
            } else {
                var id = users_home[user_id].messageId
                users_home[user_id].check = "start_users"
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
            const messageId = msg.message_id;
            const username = msg.chat.username
            if(messageText == "/start"){
                start(chatId,username)
                // setTimeout(() => {
                //     bot.deleteMessage(chatId, messageId);
                // }, 0.1 * 60 * 1000); // 10 phút
            }
        });                                                     

        async function check_id(id){
            const exit = await user_model.find({id_user:id});
            if(exit.length == 1){
                return true;
            }else{
                return false;
            }
        }

        async function start(chatId,username){
            var mess = "Hello: " + username
            +"\nWelcome to use: TRX Fee Bot"
            +"\n🤖This robot provides the following functions:"
            // + "\n\n⚡Send USDT TRC20 quickly with the cheapest fee on the market"
            + "\n\n⚡Reduce transaction fees when transferring TRC20 electronic money by up to 85%"
            + "\n\nIf the menu is missing input or click /start"
            + "\n⬇️Please select the following functions to get started⬇️"
            
            const keyboard = [
                [{ text: '⚡Fee discount' }],
                [{ text: '🔎Check Wallet' }],
                [{ text: '💳Balance' }, { text: '🤵Me' }],
                [{ text: '🔗Referral' }],
                [{ text: '👩‍💻Contact Support' }],
                
            ];
            
            const keyboardMarkup = {
                keyboard,
                resize_keyboard: true,
                one_time_keyboard: false,
            };

            const options = {
                reply_markup: keyboardMarkup
            };
            

            var mess1 = "PLEASE ENTER REFERRAL CODE."
                + "\nIf not, please enter: 6450055025"
            user_model.find({id_user:chatId}, async (err, data)=>{
                if(data.length == 0){
                    var newObj = {
                        id_user:chatId,
                    }
                    await user_model.create(newObj);

                    bot.sendMessage(chatId, mess1).then(async (sentMessage) => {
                        var messageId = sentMessage.message_id;
                        await start_users(chatId,messageId)
                        A1_me0(chatId,messageId,0)
                        async function A1_me0(chatId,messageId,check1){
                            let shouldExecuteTextHandler = true;
                            bot.on('callback_query', (callbackQuery) => {
                                if(chatId == callbackQuery.message.chat.id){
                                    shouldExecuteTextHandler = false;
                                }
                            })

                            const exit = await user_model.find({id_user:chatId});
                            if(exit.length == 1){
                                if(exit[0].User_gt !== ""){
                                    shouldExecuteTextHandler = false;
                                }
                            }
    
                            bot.once('text', async (msg) => {
                                const inputText = msg.text;
                                if(chatId !== msg.chat.id){
                                    A1_me0(chatId,messageId,0)
                                }else{
                                    if(!inputText.includes("/") && inputText !== "⚡Fee discount" && inputText !== "🔎Check Wallet" && inputText !== "💳Balance"&& inputText !== "🤵Me" && shouldExecuteTextHandler){
                                        setTimeout(() => {
                                            bot.deleteMessage(chatId, msg.message_id);
                                        }, 0.1 * 60 * 1000);
    
                                        var check = await check_id(inputText);
                                        if(check == false){
                                            bot.sendMessage(chatId, "wrong information. Please re-enter."+ "\nIf not, please enter: 6450055025").then(async (sentMessage) => {
                                                setTimeout(() => {
                                                    bot.deleteMessage(chatId, sentMessage.message_id);
                                                }, 1 * 60 * 1000);
                                            })
                                            if(check1<300){
                                                A1_me0(chatId,messageId,check1+1)
                                            }
                                        }else{
                                            const exit = await user_model.find({id_user:chatId});
                                            if(exit.length == 1){
                                                if(exit[0].User_gt !==""){
                                                    bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                                                        var messageId = sentMessage.message_id;
                                                        await start_users(chatId,"0")
                                                    })
                                                }else{
                                                    await user_model.findOneAndUpdate(
                                                        { id_user:chatId },
                                                        { User_gt: inputText}
                                                    );
                                                    bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                                                        var messageId = sentMessage.message_id;
                                                        await start_users(chatId,"0")
                                                    })
                                                }
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
                }else{
                    if(data[0].User_gt !== ""){
                        bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                            var messageId = sentMessage.message_id;
                            await start_users(chatId,"0")
                        })
                    }else{
                        
                        bot.sendMessage(chatId, mess1).then(async (sentMessage) => {
                            var messageId = sentMessage.message_id;
                            await start_users(chatId,messageId)
                            A1_me0(chatId,messageId,0)
                            async function A1_me0(chatId,messageId,check1){
                                let shouldExecuteTextHandler = true;
                                bot.on('callback_query', (callbackQuery) => {
                                    if(chatId == callbackQuery.message.chat.id){
                                        shouldExecuteTextHandler = false;
                                    }
                                })
    
                                const exit = await user_model.find({id_user:chatId});
                                if(exit.length == 1){
                                    if(exit[0].User_gt !== ""){
                                        shouldExecuteTextHandler = false;
                                    }
                                }
        
                                bot.once('text', async (msg) => {
                                    const inputText = msg.text;
                                    if(chatId !== msg.chat.id){
                                        A1_me0(chatId,messageId,0)
                                    }else{
                                        if(!inputText.includes("/") && inputText !== "⚡Fee discount" && inputText !== "🔎Check Wallet" && inputText !== "💳Balance"&& inputText !== "🤵Me" && shouldExecuteTextHandler){
                                            setTimeout(() => {
                                                bot.deleteMessage(chatId, msg.message_id);
                                            }, 0.1 * 60 * 1000);
        
                                            var check = await check_id(inputText);
                                            if(check == false){
                                                bot.sendMessage(chatId, "wrong information. Please re-enter."+ "\nIf not, please enter: 6450055025").then(async (sentMessage) => {
                                                    setTimeout(() => {
                                                        bot.deleteMessage(chatId, sentMessage.message_id);
                                                    }, 1 * 60 * 1000);
                                                })
                                                if(check1<300){
                                                    A1_me0(chatId,messageId,check1+1)
                                                }
                                            }else{
                                                const exit = await user_model.find({id_user:chatId});
                                                if(exit.length == 1){
                                                    if(exit[0].User_gt !==""){
                                                        bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                                                            var messageId = sentMessage.message_id;
                                                            await start_users(chatId,"0")
                                                        })
                                                    }else{
                                                        await user_model.findOneAndUpdate(
                                                            { id_user:chatId },
                                                            { User_gt: inputText}
                                                        );
                                                        bot.sendMessage(chatId, mess, options).then(async (sentMessage) => {
                                                            var messageId = sentMessage.message_id;
                                                            await start_users(chatId,"0")
                                                        })
                                                    }
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

        bot.on('callback_query', (callbackQuery) => {
            const chatId = callbackQuery.message.chat.id;
            const data = callbackQuery.data;
            const messageId = callbackQuery.message.message_id;
            if (data === '❌Close') {
                bot.deleteMessage(chatId, messageId);
            }
        });
    })
}
