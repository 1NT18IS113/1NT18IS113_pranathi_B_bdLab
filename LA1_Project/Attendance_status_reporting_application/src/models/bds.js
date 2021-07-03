//Import mongoose.
const mongoose = require("mongoose") ;

//Define schema
const bds_schema = new mongoose.Schema({
    _id:String,
    name:String,
    status:[String]
 },{_id:false});

//Export the schema model to be able to use this schema from other modules of program.
const bds = new mongoose.model("bds",bds_schema);
module.exports=bds;