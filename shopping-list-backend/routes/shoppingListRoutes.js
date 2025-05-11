const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/lista', verifyToken, shoppingListController.getShoppingList);
router.post('/lista', verifyToken, shoppingListController.addToShoppingList);
router.delete('/lista/:productId', verifyToken, shoppingListController.removeFromShoppingList);

module.exports = router;