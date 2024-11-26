const express = require('express');
const router = express.Router();
const { createPedido } = require('../controllers/pedidoController');

// Ruta para crear un pedido
router.post('/', createPedido);

module.exports = router;
