const express = require("express");
const dotenv = require('dotenv')
const mongoose = require("mongoose");
// const db = require('./config/db');
const routes = require('./routes');
const bodyParser = require("body-parser");
dotenv.config()

const app = express()
const port = process.env.PORT || 9000

app.get('/',(req,res)=>{
    return res.send('1312321')
})

app.use(bodyParser.json())

routes(app)

mongoose.connect(`${process.env.MONGO_db}`)
.then(()=>{
    console.log('Connected db success');
})
.catch((err)=>{
    console.log(err);
})


app.listen(port, () =>{
    console.log(`server is running with port: ${port}`)
})