const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({    
    adress:String,
    hash: String,
    trang_thai: String, //Update , Start , ERR , Done_Success , Done_Undef
    timestamp:String
});
module.exports = mongoose.model("TRX_History", userSchema);