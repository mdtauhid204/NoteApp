const mongoose= require('mongoose');

const ConnectToMongo= async (uri)=>{
  await   mongoose.connect(uri,()=>{
        console.log("Connected")
    })
   
}

module.exports=ConnectToMongo;
