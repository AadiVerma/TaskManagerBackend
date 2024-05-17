const express=require('express');
const router=express.Router();
const {User} =require('../db');
const  zod=require('zod');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const signupvalidate=zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(), 
    password:zod.string()
})
const signin=zod.object({ 
    username:zod.string().email(),
    password:zod.string()
})
router.post('/signup',async (req,res)=>{
    const {success,error}= signupvalidate.safeParse(req.body); 
    if(!success){
        return res.status(404).json({
            message:error
        })
    }
    const existinguser=await User.findOne({username:req.body.username});
    if(existinguser){
        return res.status(404).json({
            message:"User Already Exists"
        })
    }
    const user= new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password:req.body.password
    }) 
    await user.save();
    return res.status(200).json({
        message:"Data Added successfully",
        user:user._id
    })
})

router.post('/signin',async (req,res)=>{
    const success=signin.safeParse(req.body);
    if(!success){
        return res.status(404).json({
            message:"Data is not Correct"
        })
    }
    const existinguser=await User.findOne({username:req.body.username, password:req.body.password});
    if(!existinguser){
        return res.status(404).json({
            message:"User Does not Exists"
        })
    }
    const token=jwt.sign({userId:existinguser._id},process.env.SECRET_KEY);
    res.setHeader('Authorization',`Bearer ${token}`);
    return res.status(200).json({
        message:"Data Added successfully",
        token:token
    })
})
module.exports=router;