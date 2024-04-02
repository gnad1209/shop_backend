const express = require('express')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const port = process.env.PORT || 9000

app.get('/',(req,res)=>{
    return res.send('1312321')
})

app.listen(port, () =>{
    console.log(`server is running with port: ${port}`)
})