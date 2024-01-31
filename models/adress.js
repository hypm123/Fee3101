const mongoose = require("mongoose");

const adressSchema = new mongoose.Schema({    
    id_user: String,

    name1: {type: String, default: ''},
    pass1: {type: String, default: ''},
    adress1: {type: String, default: ''},
    privekey1: {type: String, default: ''},
    id_check1: {type: String, default: ''},
    id_xn1: {type: String, default: ''},

    name2: {type: String, default: ''},
    pass2: {type: String, default: ''},
    adress2: {type: String, default: ''},
    privekey2: {type: String, default: ''},
    id_check2: {type: String, default: ''},
    // ||$ID||1790900||$USER||oke_ahk
    id_xn2: {type: String, default: ''},

    name3: {type: String, default: ''},
    pass3: {type: String, default: ''},
    adress3: {type: String, default: ''},
    privekey3: {type: String, default: ''},
    id_check3: {type: String, default: ''},
    id_xn3: {type: String, default: ''}

});
module.exports = mongoose.model("ADRESS", adressSchema);