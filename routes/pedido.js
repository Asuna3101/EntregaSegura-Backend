const express = require('express');
const router = express.Router();
const { createPedido, getPedidosByUsuarioId,deletePedido,getSeguimientoPedido } = require('../controllers/pedidoController');

// Ruta para crear un pedido
router.post('/', createPedido);
router.get('/usuario/:usuario_id', getPedidosByUsuarioId);
router.delete('/:pedido_id', deletePedido); 
router.get('/:pedido_id', getSeguimientoPedido); 
module.exports = router;
