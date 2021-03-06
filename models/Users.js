const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    //图片
    avatar:{
        type:String,
    },
    //身份
    identity:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = User = mongoose.model("users", UserSchema);