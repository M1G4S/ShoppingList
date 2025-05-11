const express = require('express');
const router = express.Router();
const { createProduct, getProdutos, updateProduct, deleteProduct } = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/produtos', verifyToken, createProduct);
router.get('/produtos', verifyToken, getProdutos);
router.put('/produtos/:id', verifyToken, updateProduct);
router.delete('/produtos/:id', verifyToken, deleteProduct);

module.exports = router;
