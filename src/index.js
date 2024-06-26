const express = require("express");
const dotenv = require('dotenv')
const mongoose = require("mongoose");
// const db = require('./config/db');
const routes = require('./routes');
const bodyParser = require("body-parser");
const cors = require('cors')
const cookieParser = require("cookie-parser")
dotenv.config()

const app = express()
const port = process.env.PORT || 9000

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(cookieParser())

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