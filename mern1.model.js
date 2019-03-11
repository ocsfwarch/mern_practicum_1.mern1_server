const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Mern1 = new Schema({
    file_name:{
        type:String
    },
    file_description:{
        type:String
    },
    file_email:{
        type:String
    },
    file_status:{
        type:String
    }
});

module.exports = mongoose.model('Mern1', Mern1);