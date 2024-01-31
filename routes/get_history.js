
const history_model = require('../models/history');
function time() {
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
    fs.readFile("./config.json", "utf8", function(err, data){
        if(err){throw err};
        var obj = JSON.parse(data); 
        const adress = obj.adress_list[0].adress;

        async function gethistory(address,hash_last) {

            console.log("gethistory: ",time())
            try {
                const axios = require('axios');
                const apiUrl2 = `https://apilist.tronscanapi.com/api/new/transfer?sort=-timestamp&count=true&limit=50&start=0&toAddress=${address}`;
                // Sử dụng axios để lấy dữ liệu từ URL
                const response2 = await axios.get(apiUrl2);
                const data = response2.data.data
                var hast_check = data[0].transactionHash
                var check = data.length-1
                if(hast_check !== hash_last){
                    if(check<55){
                        up_data(check)
                    }else{
                        var hast_check1 = data[5].transactionHash
                        const exit1 = await history_model.find({hash:hast_check1});     
                        if(exit1.length==1){
                            const st = 7
                            up_data(st)
                            //
                        }else{
                            var hast_check2 = data[20].transactionHash
                            const exit2 = await history_model.find({hash:hast_check2});
                            if(exit2.length==1){
                                const st = 22
                                up_data(st)
                            }else{
                                var hast_check3 = data[47].transactionHash
                                const exit3 = await history_model.find({hash:hast_check3});
                                if(exit3.length==1){
                                    const st = 49
                                    up_data(st)
                                }else{
                                    const st = 49
                                    up_data(st)
                                    //ERRR
                                }
                            }
                        }
                    }
                }else{
                    console.log("no DATA history")
                    setTimeout(function() {
                        gethistory(address,hash_last);
                    }, 15000);
                    
                }
                async function up_data(st){
                    history_model.find({adress:adress}, (err, data_sl)=>{
                        if(err){
                            console.log("ERR")
                        }else{
                            if(data_sl.length == 0){
                                async function delay1() {
                                    for(let i=st; i>=0 ; i--){
                                        await delay(300);
                                        var hash = data[i].transactionHash
                                        var newObj = {
                                            adress:adress,
                                            hash:hash,
                                            timestamp: data[i].timestamp,
                                            trang_thai:'Update'
                                        }
                                        await history_model.create(newObj);
                                        console.log("Update",i,hash)
                                    }
                                    setTimeout(function() {
                                        gethistory(address,"");
                                    }, 5000);
                                }
                                delay1();
                            }else{
                                async function delay2() {
                                    for(let i=st; i>=0 ; i--){
                                        await delay(300);
                                        var hash = data[i].transactionHash
                                        const exit = await history_model.find({hash:hash});
                                        if(exit.length==0){
                                            var newObj = {
                                                adress:adress,
                                                hash:hash,
                                                timestamp: data[i].timestamp,
                                                trang_thai:'Start'
                                            }
                                            await history_model.create(newObj);
                                            console.log("Start",i,hash)
                                        }
                                    };
                                    setTimeout(function() {
                                        gethistory(address,"");
                                    }, 5000);
                                }
                                delay2();
                            }  
                        }
                    })
                }
                // return data
            } catch (error) {
                console.log("gethistory_ERR")
                setTimeout(function() {
                    gethistory(adress,"")
                }, 5000); 
                
            }
            
        }

        gethistory(adress,"")

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    })
}