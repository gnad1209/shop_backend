const express = require("express")
const router = express.Router()
const userController = require('../controllers/UserController')
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const dotenv = require("dotenv")
dotenv.config()

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.put('/update-user/:id', upload.single('avatar'), userController.updateUser)
// router.post('/api/upload',upload.single('image'),userController.uploadImage)
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser)
router.delete('/soft-delete-user/:id', authMiddleware, userController.softDeleteUser)
router.get('/getAll', authMiddleware, userController.getAllUser)
router.get('/get-detail/:id', authUserMiddleware, userController.getDetailUser)
router.get('/get-follower/:id', userController.getFollower)
router.post('/refresh-token', userController.refreshToken)

module.exports = router