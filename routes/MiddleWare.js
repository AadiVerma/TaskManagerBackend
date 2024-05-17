const jwt =require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const authMiddleware =(req,res,next)=>{
   const token =req.headers.authorization;
   if(!token || !token.startsWith('Bearer ')){
    return res.status(401).json({
        message:"Unauthorized"
    })
   }
   const jwttoken=token.split(' ')[1];
   const verify= jwt.verify(jwttoken,SECRET_KEY);
   if(!verify.userId){
    return res.status(401).json({
        message:"Unauthorized"
    })
   }  
   req.userId=verify.userId;
   next(); 
}
module.exports = authMiddleware;