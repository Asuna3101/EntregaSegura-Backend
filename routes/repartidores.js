const express = require('express');
const router = express.Router();
const { getRepartidores, getRepartidorById, getReseñasByRepartidor } = require('../controllers/repartidoresController');

// Rutas de repartidores
router.get('/list', getRepartidores);
router.get('/:id', getRepartidorById);
router.get('/:id/resenias', getReseñasByRepartidor);


module.exports = router;
