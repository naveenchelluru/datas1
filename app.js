require('dotenv').config()
const express=require("express")
const body_parser=require("body-parser")
const ejs=require("ejs");
const { default: mongoose } = require("mongoose");
const encrypt=require("mongoose-encryption")
const app=express();


console.log(process.env.API);


app.use(body_parser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine",'ejs');

mongoose.connect("mongodb://localhost:27017/userdb")
//const { Schema } = mongoos
//new  mongoose.Schema(json)
const userSchema=new mongoose.Schema({
    email :String,
    password:String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

const User=mongoose.model("User",userSchema)

app.get("/",(req,res)=>{
res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
    })

app.get("/register",(req,res)=>{
        res.render("register")
        })


app.post("/register",(req,res)=>{ 
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err)=>{
       if(err){ console.log(err);}
       else{
        res.render("secrets")
       }
    })
})

app.listen(3000,()=>{
    console.log("server is running");
})

app.post("/login",(req,res)=>{
    const uname =req.body.username;
    const pass=req.body.password;
  User.findOne({email:uname},(err,sol)=>{
    if(err){res.send("error")}
    else{
        if(sol){
            if(sol.password==pass)
            {
                res.render("secrets")
            }
            else{res.send("<h1><center>error<h1>")}
        }
    }
  })  
})