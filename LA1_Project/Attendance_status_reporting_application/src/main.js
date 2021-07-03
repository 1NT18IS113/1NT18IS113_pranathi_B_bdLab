//Import Express.
const express=require("express");

//Import Path.
const { dirname } = require("path");
const path=require("path");

const app=express();

//Import File Server to work with file systems.
const fs = require('fs');

//Import Multer to upload files.
const multer = require('multer');

//Import handlebars.
const hbs=require('hbs');


const mongoose=require("mongoose");

//Import excel-to-json, a middleware used to convert excel to JSON.
const excelToJson = require('convert-excel-to-json');

//Import url.
const { fileURLToPath } = require('url');


//Global Variables.
var username='NULL';
var uname='NULL';
var get_results = [] ;

//Assigning port number to host the website locally.
const port=process.env.PORT || 8000;

//Importing Connection and Schemas from different modules exported .
require("./db/connection");
const Teacher=require('./models/teachers_login');
const Student = require('./models/student_login') ;
const Bds = require('./models/bds') ;
const Cns = require('./models/cns') ;
const Ses = require('./models/ses') ;

//Assigning path of the directories which are required.
const file_path=path.join(__dirname,"..")
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

//To use static files like css.
app.use(express.static(static_path));

//Method to recognize incoming string.
app.use(
    express.urlencoded({
      extended: false //True:any data type False:String/Array
    })
  )

//To listen the connection on the specified host port.
app.listen(port,()=>{
    console.log(`server running at ${port}`)
})


  const schema=new mongoose.Schema({
    _id:String,
   name:String,
   status:[String]
},{_id:false});

//Set the paths
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

//GET request for home page.
app.get('/', (req, res)=> {
    res.render('home');
  })

app.get('/home.hbs', (req, res)=> {
    res.render('home');
  })

//GET request to Login page.
app.get('/login.hbs', (req, res)=> {
    console.log("login");
    res.render('login');
  })

  //TEACHERS MODULE


//GET request for teachers view.
app.get('/teachers_view.hbs', async(req, res)=> {
    const users=new mongoose.model(username,schema);
    module.exports=users;
    var attendance=[];
    var present=[];
    let count=[];
    var results=[];
    let c=1;
    try {
        console.log(username)
        //MongoDB queries.

        //Find all information in users collection.
        const x=await users.find({})

        //Count the total number of classes conducted.
        const y=await users.aggregate([{$project:{status:{$size:"$status"}}}])

        //Count the number of classes the student has attended.
        const z=await users.aggregate([{$project:{status:{$size:{$filter:{input:"$status",as:"item",cond:{$eq:["$$item","p"]}}}}}}])
        
    
        z.forEach(element2=>{
            count.push(c)
            c+=1;
            present.push(element2.status);
        })
        y.forEach(element => {
            attendance.push(element.status);
            z.forEach(element2 => {
                if(element._id===element2._id){
                    let result=(element2.status/element.status)*100; //Find the percentage of attendance.
                    results.push(result)
                }
            });
        });
        console.log(results)

            
            res.render("teachers_view",{
                name:username,
                obj:x,
                result:results,
                attendance:attendance,
                present:present,
                count:count

            })
        get_results=results;
   }
catch (error) {
       res.status(400).send(error);
   }
   });


   //GET request for teachers_view2 page
   app.get('/teachers_view2.hbs', async(req, res)=> {
    const users=new mongoose.model(username,schema);
    module.exports=users;
    var usn=[];
    var results=[];
    var attendance=[];
    try {
       const x=await users.find({})
        const y=await users.aggregate([{$project:{status:{$size:"$status"}}}])
        const z=await users.aggregate([{$project:{status:{$size:{$filter:{input:"$status",as:"item",cond:{$eq:["$$item","p"]}}}}}}])
        y.forEach(element => {
            attendance.push(element.status);
            z.forEach(element2 => {
                if(element._id===element2._id){
                    let result=(element2.status/element.status)*100;
                    if(result<75){
                        usn.push(element._id);
                        results.push(result);
                    }
                }
            });
        });

            res.render("teachers_view2",{
                name:username,
                result:results,
                usn:usn

            })
   }
catch (error) {
       res.status(400).send(error);
   }
   });

   
//GET request for teachers_chart page 
app.get('/teachers_chart.hbs', (req, res)=> {
    var zero_20=0,twenty_40=0,forty_60=0,sixty_80=0,eighty_100=0;
    get_results.forEach(element=>{
        if(element>=0 && element<=20){
            zero_20+=1;
        }
        else if(element>20 && element<=40){
            twenty_40+=1;
        }
        else if(element>40 && element<=60){
            forty_60+=1;
        }
        else if(element>60 && element<=80){
            sixty_80+=1;
        }
        else if(element>80 && element<=100){
            eighty_100+=1;
        }
    })
    res.render('teachers_chart',{
        name:username,
        first:zero_20,
        second:twenty_40,
        third:forty_60,
        fourth:sixty_80,
        fifth: eighty_100
    });
  })

  app.get('/teachers_view2.hbs', (req, res)=> {
    res.render('teachers_view2');
  })


  app.get('/teachers_pass.hbs', (req, res)=> {
    res.render('teachers_pass.hbs');
  })


  app.post("/teachers_change",async(req,res)=>{
    try {
        var stuname = req.body.stuname ;
        var newpass = req.body.newpassword ;
        var old_password=req.body.oldpsw;

        const teacher = await Teacher.findOne({ username: stuname });
        if (teacher.username === stuname && teacher.password === old_password) {
          var update= await Teacher.updateOne({username:stuname},{$set:{password:newpass}});
          console.log(update)
          
          res.render('teachers_pass.hbs',{
              message:"Password updated successfully"
          })
      }
      else{
          res.render('teachers_pass.hbs',{
              message1:"Username or password is wrong!"
          })
      }

    } catch (error) {
      res.render('pass.hbs',{
          message1:"Username or password is wrong"
      })
    }
})


app.get('/data.xlsx', (req, res)=> {
    res.sendFile(file_path+'/Sample DB.xlsx');
  })

//Teacher login Authentication.
app.post('/teacher', async(req, res)=>{
    try {
         username=req.body.username;
        const password=req.body.password;
        const teacher=await Teacher.findOne({username:username});
        if(teacher.username===username && teacher.password===password){
            //console.log(teacher)
            res.render('teachers_page');
        }
        else if(teacher.username != username && teacher.password===password){
            res.render('login',{
                message:"Your password or username is Wrong!!"
            })
        }
        else{
            res.render('login',{
                message:"Your password or username is Wrong!!"
            })
        }
    }
 catch (error) {
        res.status(400).send(error);
    }
    });



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, file_path+ '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});
const upload = multer({storage: storage});

app.post('/upload', upload.single("uploadfile"), (req, res) =>{
    importExcelData2MongoDB(file_path + '/uploads/' + req.file.filename);
        res.render('teachers_page',{
            message: "Succesfully uploaded"
        })

});


function importExcelData2MongoDB(filePath){
    // -> Read Excel File to Json Data
    const excelData = excelToJson({
        source: fs.readFileSync(filePath),
        header:{
        rows: 1
        },
        columnToKey: {
        A: 'usn',
        B: 'name',
        C: 'status'
        }// fs.readFileSync return a Buffer
        });
    console.log(excelData);

        const quotes=new mongoose.model(username,schema);
        module.exports=quotes;
        for(var i in excelData){
                    for ( var j in excelData[i]){
                        console.log(excelData[i][j].name)
                         quotes.updateOne({_id:excelData[i][j].usn,name:excelData[i][j].name},{$push:{status:excelData[i][j].status}},{upsert:true},(err, res) => {
                            if (err){
                                console.log(err);
                            }
                        })}}
        fs.unlinkSync(filePath);
    }

    app.get("/login",(req,res)=>{
        
        res.render("login")
    });
    

            //STUDENT MODULE

    //Student login Authentication
    app.post("/student" , async(req,res)=>{
        try{
            uname = req.body.username ;
            var pass = req.body.password ;
    
        console.log(`${uname} and password is ${pass}`) ;
        
        const stu = await Student.findOne({uname:uname}) ;
        if(stu.uname===uname && stu.password===pass){
            res.render("stuview")
        }
        else{
            res.status(404).send("Username or password incorrect") ;
        }

    }
    catch(error){
        res.status(404).send("User not found") ;
    }
    });


    //GET THE STUDENT VIEW PAGE
   app.get('/studentpage.hbs', async(req, res, next)=> {
        console.log(uname);
        console.log("INSIDE STUDENT") ;
        var alldetails = [] ; //All details array of students
        var statusarr = [];   //All object
        var totclass = [];   //Total number of class attended
        var attclass = [];
        var subarr = ["BD","CNS","SE"] ;
        var perarr = [] ;  //Percentage array
        
        try {
            
            //Get the total number of classes conducted in BD subject
            const tot1 = await  Bds.aggregate([{$match:{_id:uname}},{$project:{count:{$size:"$status"}}}]) ; 

            //Push the count value to total array 
            tot1.forEach((item)=>{    
                totclass.push(item.count);
            })

            //Update alldetails array 
            const use1 = await Bds.aggregate( [{$match : {_id :uname}},{$project:{status:{$size:{$filter:{input:"$status",as:"item",cond:{$eq:["$$item","p"]}}}}}}  ]);            
            alldetails.push(use1) ;

            //Get the total number of classes conducted in CNS subject
            const tot2 = await  Cns.aggregate([{$match:{_id:uname}},{$project:{count:{$size:"$status"}}}]) ; 

             //Push the count value to total array 
            tot2.forEach((item)=>{
                totclass.push(item.count);
            })

           //Update alldetails array 
           const use2 = await Cns.aggregate([ {$match : {_id :uname}},{$project:{status:{$size:{$filter:{input:"$status",as:"item",cond:{$eq:["$$item","p"]}}}}}} ] );
           alldetails.push(use2) ;


           //Get the total number of classes conducted in SE subject
           const tot3 = await  Ses.aggregate([{$match:{_id:uname}},{$project:{count:{$size:"$status"}}}]) ;

           //Push the count value to total array 
           tot3.forEach((item)=>{
            totclass.push(item.count);
        })

          //Update alldetails array 
          const use3 = await Ses.aggregate([ {$match : {_id :uname}},{$project:{status:{$size:{$filter:{input:"$status",as:"item",cond:{$eq:["$$item","p"]}}}}}} ] );
          alldetails.push(use3) ;

          //console.log("Total class : ",totclass) ;

           //console.log("All details",alldetails) ;

           alldetails.forEach((i)=>{
                i.forEach((j)=>{
                let val = j.status;
                attclass.push(j.status);
                let newobj = {"Attended":val}
                statusarr.push(newobj);
                })
                })

            //console.log("Attended classes",attclass);

           

            //console.log("Object Array",statusarr);


            //Calculate percentage
            for(i=0;i<totclass.length;i++)
            {
                var per = attclass[i]/totclass[i] * 100 ;
                perarr.push(per.toFixed(2));
            }


            //Update status array
            for(i=0;i<statusarr.length;i++)
            {
                statusarr[i]["Subject"] = subarr[i];
                statusarr[i]["Total"] = totclass[i] ;
                statusarr[i]["Percentage"] = perarr[i];
            }

            //console.log("Status Array",statusarr);


            //pass the statusarr object to studentpage
            res.render("studentpage",{
                obj:statusarr    
            });  
       }
    catch (error) {
           res.status(400).send(error);
       }
       });


       //GET request for pass.hbs
       app.get('/pass.hbs', (req, res)=> {
        res.render('pass.hbs');
      })


      //POST request for change password form
      app.post("/change",async(req,res)=>{
        try {
            //Get username and newpassword
            var stuname = req.body.stuname ;
            var newpass = req.body.newpassword ;

           //console.log(`New ${stuname} and password ${newpass}`) ;

            if(stuname==uname){
              const update = await Student.updateOne({uname:stuname},{$set:{"password":newpass}}) ;

              if(update){
                 
                    res.render('pass.hbs',{
                        message:"Password updated successfully !"
                    })
               
              }
              else{
               res.render('pass.hbs',{
                   message1:"Unable to update password :("
               })
                
              }
            }
            else{
                res.render('pass.hbs',{
                    message1:"Unable to update password :("
                })
            }
            
        } catch (error) {
            console.log(error);
        }
    })
