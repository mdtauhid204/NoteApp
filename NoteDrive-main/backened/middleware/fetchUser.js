const jwt=require('jsonwebtoken');

const fetchUser=(req,res,next)=>{
    //Get the user from the jwt token and id to req object
    const token = req.header('auth-token');
    if (!token) {
      return   res.status(401).send({ error: "Please authenticate with valid email" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
      return   res.status(401).send({ error: "Please authenticate with a valid id" });
    }
}


module.exports=fetchUser;