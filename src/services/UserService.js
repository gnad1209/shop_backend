const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken,genneralRefreshToken} = require('../services/JwtService')
const jwt = require("jsonwebtoken")

const createUser = (newUser) =>{
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
const loginUser = (userLogin) =>{
    return new Promise(async(resolve,reject)=>{
        const { name, email, password, phone} = userLogin
        try{
            const checkUser = await User.findOne({
                email:email
            })
            if(checkUser === null){
                resolve({
                    status:"OK",
                    message:"the email is not defined"
                })
            }
            const comparePassword = bcrypt.compareSync(password,checkUser.password)
            if(!comparePassword){
                resolve({
                    status:"OK",
                    message:"the password is incorrect"
                })
            }
            const access_token = await genneralAccessToken({
                id:checkUser.id,
                isAdmin:checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id:checkUser.id,
                isAdmin:checkUser.isAdmin
            })
            console.log(access_token);
            resolve({
                status:"OK",
                message:"SUCCESS",
                access_token,
                refresh_token,
            })
        }catch(e){
            reject(e)
        }
    })
}

const updateUser = (id,data) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            const updateUser = await User.findByIdAndUpdate(id,data,{new:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
                data: updateUser
            })
        }catch(e){
            reject(e)
        }
    })
}

const deleteUser = (id) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            const deleteUser = await User.findByIdAndDelete(id)
            resolve({
                status:"OK",
                message:"Delete SUCCESS",
            })
        }catch(e){
            reject(e)
        }
    })
}

const softDeleteUser = (id) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            const softDeleteUser = await User.findByIdAndUpdate(id,{isDelete:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
            })
        }catch(e){
            reject(e)
        }
    })
}

const getAllUser = () =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const getAllUser = await User.find({isDelete:false})
            resolve({
                status:"OK",
                message:"SUCCESS",
                data: getAllUser
            })
        }catch(e){
            reject(e)
        }
    })
}

const getDetailUser = (id) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const user = await User.findOne({
                _id: id
            })
            if(user === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            resolve({
                status:"OK",
                message:"SUCCESS",
                data: user
            })
        }catch(e){
            reject(e)
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    softDeleteUser,
}