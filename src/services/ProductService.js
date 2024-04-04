const Product = require('../models/ProductModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken,genneralRefreshToken} = require('../services/JwtService')
const jwt = require("jsonwebtoken")

const createProduct = (newUser) =>{
    return new Promise(async(resolve,reject)=>{
        const { name, email, password, confirmPassword, phone} = newUser
        try{
            const checkUser = await User.findOne({
                email:email
            })
            if(checkUser !== null){
                resolve({
                    status:"OK",
                    message:"the email is already"
                })
            }
            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if(createUser) {
                resolve({
                    status:'OK',
                    message:'SUCCESS',
                    data:createUser
                })
            }
            resolve({})
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
}