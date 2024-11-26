const express = require('express');
const {
    getResenas, 
    getPedidos // Nueva función para recuperación de contraseña
} = require('../controllers/reseniasController');

const router = express.Router();

router.post('/resenias', getResenas); // Login
router.post('/pedidos', getPedidos); // Registro

module.exports = router;
