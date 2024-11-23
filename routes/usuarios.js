const express = require('express');
const {
  login,
  register,
  getUsuario,
  changePassword,
} = require('../controllers/usuarioController');

const router = express.Router();

router.post('/login', login); // Login
router.post('/register', register); // Registro
router.get('/me', getUsuario); // Obtener usuario actual
router.put('/change-password', changePassword); // Cambiar contraseña

module.exports = router;
