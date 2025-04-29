import express from 'express';
import cors from "cors"
import { gid } from './utils/helper.js';
import Valkey from 'ioredis'
import dotenv from 'dotenv'
import { log } from 'console';
dotenv.config()

const app = express();
app.use(express.json())
app.use(cors())
const serviceUri = process.env.serviceUri
const PORT = process.env.PORT || 4445;



const redis = new Valkey(serviceUri);



app.get("/generate",async(req,res)=>{
     const id = gid();
    await redis.set(`${id}`,"true")
    // console.log(id);
    
    res.json({id})
return 
})

app.get("/:id",async(req,res)=>{
    const id = req.params.id 
const data = await redis.get(id)
// console.log(data);

res.json({id:data})
return
})

// all the middleware and routes will be declared here like app.get or app.post

app.listen(PORT ,()=>{
// console.log("http server started");

})
export default app;