const express = require("express")
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { authMiddleware } = require("../middleware/authMiddleware")

router.post('/create',authMiddleware, ProductController.createProduct)
router.put('/update/:id',authMiddleware, ProductController.updateProduct)
router.get('/detail/:id', ProductController.getDetailProduct)
router.get('/getAll', ProductController.getAllProduct)
router.delete('/delete/:id',authMiddleware, ProductController.deleteProduct)
router.delete('/softdelete/:id',authMiddleware, ProductController.softDeleteProduct)

module.exports = router