const mongoose = require("mongoose") ;

const st_login_schema = new mongoose.Schema({
    uname : {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const Student = new mongoose.model("Student",st_login_schema);
module.exports=Student ;