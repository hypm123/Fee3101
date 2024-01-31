const history_model = require('../models/history');
const user_model = require('../models/user');
function time1() {
  const moment = require('moment-timezone');
  // Lấy thời gian hiện tại ở múi giờ UTC
  const now = moment.utc();

  // Chuyển sang múi giờ +9 (JST)
  const jstTime = now.tz('Asia/Tokyo');

  // Lấy giờ, phút và giây từ thời gian ở JST
  const hour = jstTime.format('HH');
  const minute = jstTime.format('mm');
  const second = jstTime.format('ss');

  // Tạo chuỗi thời gian
  const time = `${hour}:${minute}:${second}`;

  return time;
}
module.exports = function(bot){
  const fs = require("fs");
  const request = require("request-promise").defaults({jar: true});
  const otplib = require("otplib");
  const cookieJar = request.jar();
  fs.readFile("./config.json", "utf8", function(err, data){
    if(err){throw err};
    var obj = JSON.parse(data); 
    const id_ad = obj.id_tele.tientam1206

    function funcbb() {
      history_model.find({trang_thai:'Start'}, (err, data)=>{
        if(err|| data.length == 0){
          console.log("up_balance: ",time1())
          setTimeout(funcbb, 14000);
        }else{
          var hash = data[0].hash
          var adress = data[0].adress
          var timestamp = data[0].timestamp
          gethistory(adress,timestamp,hash)
        }
      })
    }

    async function gethistory(adress,timestamp,hash) {
      try {
        const axios = require('axios');
        const apiUrl2 = `https://apilist.tronscanapi.com/api/transaction-info?hash=${hash}`;
        // Sử dụng axios để lấy dữ liệu từ URL
        const response2 = await axios.get(apiUrl2);
        const data = response2.data
        var contractType = data.contractType // 1
        var to_address = data.toAddress // adress
        var amount_str = data.contractData.amount/1000000
        if(amount_str>5){
          if(data.contractRet == "SUCCESS"  && data.confirmed == true && contractType == "1" && to_address == adress && data.contractData.to_address == adress){
            
            if(amount_str>5){
              main_Order(hash, adress,timestamp,amount_str.toFixed(2))
            }else{
              await history_model.findOneAndUpdate(
                { hash:hash },
                { trang_thai: "ERR"}
              );
              var mess = "🔴ERR Amt\n\n" + hash + "\n\n*" + amont_str + "* TRX"
              bot.sendMessage(id_ad, mess, {parse_mode: 'Markdown'})
              setTimeout(funcbb, 1000);
            }
          }else{
            if(Date.now()-Number(timestamp)>60*10*1000){
              await history_model.findOneAndUpdate(
                { hash:hash },
                { trang_thai: "ERR"}
              );
              var mess = "🔴ERRaoi\n\n" + hash + "\n\n*" + amount_str + "* TRX"
              bot.sendMessage(id_ad, mess, {parse_mode: 'Markdown'})
              setTimeout(funcbb, 10000);
            }else{
              setTimeout(funcbb, 5000);
            }
          }
        }else{
          await history_model.findOneAndUpdate(
            { hash:hash },
            { trang_thai: "ERR"}
          );
          if(amount_str >=1){
            var mess = "🔴ERRa\n\n" + hash + "\n\n*" + amount_str + "* TRX"
            bot.sendMessage(id_ad, mess, {parse_mode: 'Markdown'})
            setTimeout(funcbb, 10000);
          }else{
            console.log(amount_str)
            setTimeout(funcbb, 10000);
          }
        }
          

      } catch (error) {
        bot.sendMessage(id_ad, "ERR1 \n\n BOT OFF")
      }
      
    }

    async function main_Order(hash, adress, time, amount){
      
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
//Date.now()-Number(time)<=11*60*1000
        for ( let ii = 0; ii<cleanDataArray.length; ii++){
          var indexOfAd1 = cleanDataArray[ii].indexOf("amount|"); 
          var indexOfAd2 = cleanDataArray[ii].indexOf("||adress"); 
          if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
            amount_check = cleanDataArray[ii].substring(indexOfAd1+7, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
          }

          if(cleanDataArray[ii].includes(amount)){

            var indexOfAd1 = cleanDataArray[ii].indexOf("time|"); 
            var indexOfAd2 = cleanDataArray[ii].indexOf("||amount"); 
            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
              time_check = cleanDataArray[ii].substring(indexOfAd1+5, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
            }

            var indexOfAd1 = cleanDataArray[ii].indexOf("adress|"); 
            var indexOfAd2 = cleanDataArray[ii].indexOf("||userid"); 
            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
              adress_check = cleanDataArray[ii].substring(indexOfAd1+7, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
            }

            var indexOfAd1 = cleanDataArray[ii].indexOf("userid|"); 
            var indexOfAd2 = cleanDataArray[ii].indexOf("||messageId"); 
            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
              chatId = cleanDataArray[ii].substring(indexOfAd1+7, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
            }

            var indexOfAd1 = cleanDataArray[ii].indexOf("messageId|"); 
            var indexOfAd2 = cleanDataArray[ii].indexOf("||."); 
            if (indexOfAd1 !== -1 && indexOfAd2 !== -1) { 
              messageId = cleanDataArray[ii].substring(indexOfAd1+10, indexOfAd2); // Lấy phần từ đầu đến "ad" và bao gồm "ad" 
            }
            
            if(amount_check == amount && adress_check == adress ){//&& Number(time)-Number(time_check) > 0 && Number(time)-Number(time_check) < 10*60*1000) {
              bot.deleteMessage(chatId, messageId);
              me11()
              break;
              async function me11(){
                const exit = await user_model.find({id_user:chatId});
                if(exit.length == 1 && Number(amount)>0){
                  balance_new = Number((exit[0].Balance_trx + Number(amount)).toFixed(2))
                  await user_model.findOneAndUpdate(
                    { id_user:chatId },
                    { 
                      Balance_trx: balance_new,
                      $push: {
                        history_list:{
                            type: "in",
                            amt: Number(amount),
                            timestamp:Date.now(),
                            status: "Sucess",
                            balance: balance_new,
                            hash: hash
                        }
                      }
                    }
                  );

                  await history_model.findOneAndUpdate(
                    { hash:hash },
                    { 
                      trang_thai:"Done_Success"
                    }
                  );
                  var mess = "🎉🎉 Recharge successful🎉🎉"
                    + "\n\nID: " + chatId
                    + "\nDeposit amount: " + amount + " TRX"
                    + "\nAccount balance: " + balance_new + " TRX"
                    + "\n\nNoted: You can pay directly with your balance when placing an order!"
                  bot.sendMessage(chatId, mess , {parse_mode: 'Markdown'})
                  setTimeout(funcbb, 10000);                  
                }else{
                  await history_model.findOneAndUpdate(
                    { hash:hash },
                    { trang_thai: "ERR"}
                  );
                  var mess = "🔴ERRa cread data\n\n" + hash + "\n\n*" + amount + "* TRX"
                  bot.sendMessage(id_ad, mess, {parse_mode: 'Markdown'})
                  setTimeout(funcbb, 10000);
                }
              }
            }else{
              me122()
              async function me122(){
                var noted = ""
                if(Number(time)-Number(time_check) <= 0 || Number(time)-Number(time_check) >= 10*60*1000){
                  noted = "🔴ERRa Hết thời gian"
                }else{
                  noted = "🔴ERRa Sai amount or adress"
                }
                await history_model.findOneAndUpdate(
                  { hash:hash },
                  { trang_thai: "ERR"}
                );
                mess = noted + "\n\n" + hash + "\n\n*" + amount + "* TRX"
                bot.sendMessage(id_ad, mess, {parse_mode: 'Markdown'})
                setTimeout(funcbb, 10000);
              }
              break;
            }
          }else{
            if(ii == cleanDataArray.length-1){
              me122()
            }
            async function me122(){
              await history_model.findOneAndUpdate(
                { hash:hash },
                { trang_thai: "ERR"}
              );
              var mess = "🔴ERRa khong tim thay order\n\n" + hash + "\n\n*" + amount + "* TRX"
              bot.sendMessage(id_ad, mess, {parse_mode: 'Markdown'})
              setTimeout(funcbb, 10000);
    
            }
            
          }
        }
      })
        
    }
    setTimeout(funcbb, 4000);

  })
}