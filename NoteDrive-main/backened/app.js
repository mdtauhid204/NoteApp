const express= require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');
const path = require("path")
const ConnectToMongo=require('./mongoose');
dotenv.config();

const app=express();


app.use(express.json());
app.use(cors());
//api
app.use('/api/notes',require('./routes/notes'));
app.use('/api/auth',require('./routes/auth'))

const URI=process.env.mongooseURI;
// const URI="mongodb+srv://mehulagarwal0001:mehul123@cluster0.wuv1v.mongodb.net/NoteDrive?retryWrites=true&w=majority";
ConnectToMongo(URI);


app.get("/mehul",(req,res)=>{

    res.send("hiii")
})

// app.use(express.static('client/build'));
//     app.get('*', (req, res) => {
//       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });

if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }


const port= process.env.PORT || 5000;

app.listen(port,()=>{
    console.log("Backened running");
})