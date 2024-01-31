const mongoose = require("mongoose");
const historySchema = new mongoose.Schema({
    type: { type: String, default: '' }, // in , out 
    amt: { type: Number, default: 0 },
    timestamp: { type: String, default: '' },
    selected: { type: String, default: '' }, // thời gian 1 hours, 1 days
    transactions: { type: String, default: '' }, // số lượng giảm giá 1 , 5
    adress: { type: String, default: '' }, // địa chỉ ví nhận
    status: { type: String, default: '' }, // Sucess, Pending
    balance: { type: Number, default: 0 }, // số dư cuối

    orderId: { type: String, default: '' }, //tronfee
    orderMoney: { type: Number, default: 0 }, // fee gốc
    hash: { type: String, default: '' }, // tronfee
    
})
const userSchema = new mongoose.Schema({    
    id_user: String,
    pass: {type: String, default: ''},
    Balance_trx: {type: Number, default: 0},
    Balance_referra: {type: Number, default: 0},
    Balance_usdt: {type: Number, default: 0},

    User_gt: {type: String, default: ''},
    User_gt2: {type: String, default: ''},
    history_list: [historySchema]
});
module.exports = mongoose.model("USER", userSchema);