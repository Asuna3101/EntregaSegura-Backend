const express = require('express');
const router = express.Router();
const coberturaController = require('../controllers/coberturaController');

// Rutas para obtener los países
router.get('/paises', coberturaController.getPaises);

// Rutas para obtener las ciudades de un país
router.get('/ciudades/:paisId', coberturaController.getCiudadesByPais);

// Rutas para obtener los distritos de una ciudad
router.get('/distritos/:ciudadId', coberturaController.getDistritosByCiudad);

// Rutas para obtener todos los distritos
router.get('/distritos', coberturaController.getAllDistritos);

module.exports = router;
