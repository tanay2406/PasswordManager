const { default: mongoose } = require("mongoose");

const authSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
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
    
})
const auth=mongoose.model("auth",authSchema);
module.exports=auth;