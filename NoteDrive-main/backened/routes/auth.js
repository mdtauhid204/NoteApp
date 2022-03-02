const router=require('express').Router();
const User=require('../models/User');
const {body,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const {OAuth2Client}=require('google-auth-library');



const client=new OAuth2Client("306729319316-2rr0204q402qn0rrehc62m4i7u5eascg.apps.googleusercontent.com")

router.post('/signup',[body('name', 'Enter a valid name').exists(),
body('email','Enter a valid email').isEmail(),
body('password', 'Enter a valid description').isLength({ min: 5 }),],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {name,email,password}=req.body;
        const user= new User({name,email,password});
        console.log("Hello in request");
        const saveduser=await user.save();
        console.log(saveduser);
        const data={
            user:{
                id:saveduser.id
            }
        }
        const authToken=jwt.sign(data,process.env.JWT_SECRET);
       // console.log(authToken);
        res.json(authToken);

    } catch (error) {
        console.log(error.message);
        res.status(400).json({error:"error"});
    }
   
})

router.get('/getuser',fetchUser,(req,res)=>{
    res.json(req.user);
})

router.post('/login',[
body('email','Enter a valid email').isEmail(),
body('password', 'Enter a valid description').isLength({ min: 5 }),],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {email,password}=req.body;
        const user= await User.findOne({email});
        if(!user)return res.status(400).json({error:"Wrong Credentials"});
        if(user.password!=password) return res.status(400).json({error:"Wrong Credentials"});

        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,process.env.JWT_SECRET);
        
         res.json(authToken);

    } catch (error) {
        console.log(error.message);
        res.status(400).json({error:"error"});
    }
   
})


router.post('/googlelogin', async (req,res)=>{
    const {tokenId}=req.body;
  
     client.verifyIdToken({idToken:tokenId,audience:"306729319316-2rr0204q402qn0rrehc62m4i7u5eascg.apps.googleusercontent.com"}).then(async (response)=>{
      const {email_verified,name,email}=response.payload;
      if(email_verified){
        let user = await User.findOne({email});
        if(user){
          const data = {
            user: {
              id: user.id
            }
          }
          const authToken = jwt.sign(data, process.env.JWT_SECRET);
  
          res.json(authToken);
        }else{
          let password=email+process.env.JWT_SECRET;
         const  user = await User.create({
            name: name,
            email: email,
            password:password
            
          })
          const data = {
            user: {
              id: user.id
            }
          }
          const authToken = jwt.sign(data, process.env.JWT_SECRET);
          res.json(authToken)
        }
      }
    })
    //console.log(tokenId)
  })


module.exports=router;
