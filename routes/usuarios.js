const express = require('express');
const {
  login,
  register,
  getUsuario,
  changePassword,
  forgotPassword,
  resetPasswordWithToken,
  deleteUser,
  updateUser // Nueva función para recuperación de contraseña
} = require('../controllers/usuarioController');

const router = express.Router();

router.post('/login', login); // Login
router.post('/register', register); // Registro
router.get('/me', getUsuario); // Obtener usuario actual
router.put('/change-password', changePassword); // Cambiar contraseña (usuario logueado)
router.post('/forgot-password', forgotPassword); // Recuperación de contraseña
router.put('/reset-password-with-token', resetPasswordWithToken); // Resetear contraseña con token
router.delete('/delete-account', deleteUser);// Ruta para eliminar la cuenta
router.put('/update', updateUser); //Ruta para actualizar datos del usuario
module.exports = router;
