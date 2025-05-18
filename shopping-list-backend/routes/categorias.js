const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/users/:id/categorias', verifyToken, categoriasController.getCategoriasByUserId);
router.post('/users/:id/categorias', verifyToken, categoriasController.addCategoriaToUser);
router.delete('/users/:id/categorias', verifyToken, categoriasController.removeCategoriaFromUser);

module.exports = router;