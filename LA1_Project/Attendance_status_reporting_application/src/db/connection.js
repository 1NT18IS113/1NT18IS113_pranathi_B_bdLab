// Import mongoose 
const mongoose=require("mongoose");

//Connect to database gansample and display the status of connection.
mongoose.connect("mongodb://localhost:27017/gansample",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log(`connection successful`)
}).catch(()=>{
    console.log(`no connection`)
});