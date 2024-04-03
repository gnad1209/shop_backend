const UserService = require('../services/UserService')

const createUser = async (req,res) =>{
    try{
        const {name,email,password,confirmPassword,phone} = req.body
        const reg =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isCheckEmail = reg.test(email)
        if(!name||!email||!password||!confirmPassword||!phone){
            return res.status(400).json({
                status:'err',
                message:'the input reuired'
            })
        }else if(!isCheckEmail){
            return res.status(400).json({
                status:'err',
                message:'the input email'
            })
        }else if(password !== confirmPassword){
            return res.status(400).json({
                status:'err',
                message:'the input password'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const loginUser = async (req,res) =>{
    try{
        const {email,password,phone} = req.body
        const reg =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isCheckEmail = reg.test(email)
        if(!email||!password||!phone){
            return res.status(400).json({
                status:'err',
                message:'the input reuired'
            })
        }else if(!isCheckEmail){
            return res.status(400).json({
                status:'err',
                message:'the input email'
            })
        }
        const response = await UserService.loginUser(req.body)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
const updateUser = async (req,res) =>{
    try{
        const userId = req.params.id
        const data = req.body
        if(!userId){
            return res.status(400).json({
                status:'err',
                message:'the userid is required'
            })
        }
        const response = await UserService.updateUser(userId,data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}

const deleteUser = async (req,res) =>{
    try{
        const userId = req.params.id
        const token = req.headers
        if(!userId){
            return res.status(400).json({
                status:'err',
                message:'the userid is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}

const getAllUser = async (req,res) =>{
    try{
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}

const getDetailUser = async (req,res) =>{
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({
                status:'err',
                message:'the userid is required'
            })
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message:e
        })
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser
}