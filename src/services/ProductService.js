const Product = require('../models/ProductModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken,genneralRefreshToken} = require('../services/JwtService')

const createProduct = (newProduct) =>{
    return new Promise(async(resolve,reject)=>{
        const { name,image,type,price,countInStock,rating,description,discount,selled} = newProduct
        try{
            const checkProduct = await Product.findOne({
                name:name
            })
            if(checkProduct !== null){
                resolve({
                    status:"OK",
                    message:"the email is already"
                })
            }
            const createProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                discount,
                selled
            })
            if(createProduct) {
                resolve({
                    status:'OK',
                    message:'SUCCESS',
                    data:createProduct
                })
            }
            resolve({})
        }catch(e){
            reject(e)
        }
    })
}

const updateProduct = (id,data) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status:"404",
                    message:"the product is not defined"
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(id,data,{new:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
                data: updateProduct
            })
        }catch(e){
            reject(e)
        }
    })
}

const getDetailProduct = (id) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const product = await Product.findOne({
                _id: id
            })
            if(product === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            resolve({
                status:"OK",
                message:"SUCCESS",
                data: product
            })
        }catch(e){
            reject(e)
        }
    })
}

const getAllProduct = (limit ,page ) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const totalProduct = await Product.countDocuments()
            const getAllProduct = await Product.find({isDelete:false}).limit(limit).skip(page * limit)
            resolve({
                status:"OK",
                message:"SUCCESS",
                data: getAllProduct,
                total: totalProduct,
                pageCurrent: page + 1,
                totalPage: Math.ceil(totalProduct/limit)
            })
        }catch(e){
            reject(e)
        }
    })
}

const deleteProduct = (id) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            const deleteProduct = await Product.findByIdAndDelete(id)
            resolve({
                status:"OK",
                message:"Delete SUCCESS",
            })
        }catch(e){
            reject(e)
        }
    })
}

const softDeleteProduct = (id) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct === null){
                resolve({
                    status:"404",
                    message:"the user is not defined"
                })
            }
            await Product.findByIdAndUpdate(id,{isDelete:true})
            resolve({
                status:"OK",
                message:"SUCCESS",
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    softDeleteProduct,
    getAllProduct
}