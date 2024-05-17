const express=require("express");
require('dotenv').config();
const app=express();
const cors=require("cors");
const router=require("./routes/route");
const loginrouter=require("./routes/loginrouter");
const port=process.env.PORT;
app.use(cors());
app.use(express.json());
app.use('/Task',router);
app.use('/account',loginrouter);
app.listen(port,()=>{
    console.log("server is running on port 8080");
}) 