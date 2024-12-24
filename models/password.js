const { default: mongoose } = require("mongoose");

const passwordSchema=new mongoose.Schema({
    website:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true,
        minLength:1,
        maxLength:100,
    },
    password:{
        type:String,
        required:true,
    },
    id:{
        type:String,
        required:true,
        minLength:1,
        maxLength:100,
    },
    uid:{
        type:String,
        required:true,
        minLength:1,
        maxLength:100,
    },
    
})
const Password=mongoose.model("Password",passwordSchema);
module.exports=Password;