const {Tasks} = require('../db');
const express = require('express');
const router = express.Router();
const authMiddleware=require ('./MiddleWare')
const zod = require('zod');
const TaskCheck = zod.object({
    heading: zod.string(),
    para: zod.string(),
    color: zod.string(),
    date:zod.string().date()
})
const EditCheck=zod.object({
    heading: zod.string().optional(),
    para: zod.string().optional(),
    color: zod.string().optional(),
    markAsCompleted: zod.boolean()
})
router.post('/add', async (req, res) => {
    const { success } = TaskCheck.safeParse(req.body);
    if (!success) {
        return res.status(404).json({
            message: "Data is not Correct"
        })
    }
    let tasks=await Tasks.findOne({userId:'663dd5f4471103e72f3221e7'});
    if (!tasks) {
        tasks = new Tasks({
            userId: '663dd5f4471103e72f3221e7',
            Alltasks: [{ 
                heading: req.body.heading,
                para: req.body.para,
                color: req.body.color,
                date:req.body.date
            }]
        });

        await tasks.save(); 
    } else {
        const newTask = {
            heading: req.body.heading,
            para: req.body.para,
            color: req.body.color,
            date:req.body.date
        };

        tasks.Alltasks.push(newTask);
        await tasks.save(); 
    }

    return res.status(200).json({
        message: "Data is Correct",
        Task: tasks
    });
})
router.put('/edit/:taskId',authMiddleware,async (req,res)=>{
  const success=EditCheck.safeParse(req.body);
  if(!success){
    return res.status(404).json({
        message: "Data is not Correct"  
    })
  }
  const taskId=req.params.taskId;
  try{
   const query = { userId: req.userId, 'Alltasks._id': taskId };
   const update = {
     $set: {
       'Alltasks.$.heading': req.body.heading,
       'Alltasks.$.para': req.body.para,
       'Alltasks.$.color': req.body.color
     }
   };

   const task = await Tasks.findOneAndUpdate(query, update, { new: true });
    res.status(200).json({
        message:"Update Successfully",
        task

    })
  }catch(error){
    return res.status(500).json({
        message:"Internal Server Error"
    })
  }
})
router.delete('/delete/:taskId',async(req,res)=>{
 const userId='663dd5f4471103e72f3221e7';
 if(!userId){
    return res.status(404).json({
        message:"User not found",
    })
 }
 const taskId=req.params.taskId;
  try{
    const result = await Tasks.findOneAndUpdate(
        { userId: userId },
        { $pull: { Alltasks: { _id: taskId } } },
        { new: true });
    res.status(200).json({
        message:"Delete Successfully",
        result
    })
  }catch(error){
    return res.status(500).json({
        message:"Internal Server Error"
    })
  }
})
router.get('/get',async(req,res)=>{
    const userId='663dd5f4471103e72f3221e7';
    if(!userId){
       return res.status(404).json({
           message:"User not found",
       })
    }

    try {
        const data=await Tasks.findOne({userId:userId});
        return res.status(200).send(data);
    } catch (error) {
        return res.status(401).json({
            message:"Internal Server Error",
        })
    }
})
router.get('/important',async(req,res)=>{
    const userId='663dd5f4471103e72f3221e7';
    if(!userId){
       return res.status(404).json({
           message:"User not found",
       })
    }
    try {
        const data=await Tasks.findOne({userId:userId});
        const impdata=data.Alltasks.filter(task => task.importanttasks);
        return res.status(200).send(impdata);
    } catch (error) {
        return res.status(401).json({
            message:"Internal Server Error",
        })
    }
})
router.get('/completed',async(req,res)=>{
    const userId='663dd5f4471103e72f3221e7';
    if(!userId){
       return res.status(404).json({
           message:"User not found",
       })
    }
    try {
        const data=await Tasks.findOne({userId:userId});
        const impdata=data.Alltasks.filter(task => task.maskAsCompleted);
        return res.status(200).send(impdata);
    } catch (error) {
        return res.status(401).json({
            message:"Internal Server Error",
        })
    }
})
router.get('/progress',async(req,res)=>{
    const userId='663dd5f4471103e72f3221e7';
    if(!userId){
       return res.status(404).json({
           message:"User not found",
       })
    }
    try {
        const data=await Tasks.findOne({userId:userId});
        const impdata=data.Alltasks.filter(task => !task.maskAsCompleted);
        return res.status(200).send(impdata);
    } catch (error) {
        return res.status(401).json({
            message:"Internal Server Error",
        })
    }
})



module.exports = router;
