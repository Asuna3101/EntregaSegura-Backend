// En tu archivo de rutas, por ejemplo, reseniasRoutes.js

const express = require('express');
const router = express.Router();
const reseniasController = require('../controllers/reseniasController');

router.get('/usuario/:usuario_id', reseniasController.getReseniasByUsuarioId);
router.delete('/resenia/:resenia_id', reseniasController.deleteResenia);
router.post('/resenia', reseniasController.createResenia);
module.exports = router;
