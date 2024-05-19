require('dotenv').config();
const mongoose = require('mongoose');
const { optional } = require('zod');
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('connected to Database');
})
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
     },
    firstName:{
       type:String,
       required:true
    },
    lastName:{
      type:String,
      required:true 
    },
    password:{
        type:String,
        required:true
    }
})
const TasksSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
   Alltasks:[
    {
        heading:{
        type:String,
        required:true
    },
    para:{
        type:String, 
        required:true
    },
    color:{
        type:String,
        required:true 
    },
    date:{
        type:Date,
        default:Date.now()
    },
    maskAsCompleted:{
        type:Boolean,
        default:false,
        required:optional 
    },
    importanttasks:{
        type:Boolean,
        default:false,
        required:optional  
    }
}
   ]
})
const User=mongoose.model('User',userSchema);
const Tasks=mongoose.model('Tasks',TasksSchema);
module.exports={Tasks:Tasks,User:User};
