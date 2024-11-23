const express = require('express');
const router = express.Router();
const { getRepartidores, getRepartidorById, getReseñasByRepartidor } = require('../controllers/repartidoresController');

// Rutas de repartidores
router.get('/', getRepartidores);
router.get('/:id', getRepartidorById);
router.get('/:id/resenas', getReseñasByRepartidor); // Cambiando "reseñas" a "resenas"
 // Nueva ruta para obtener reseñas

module.exports = router;
