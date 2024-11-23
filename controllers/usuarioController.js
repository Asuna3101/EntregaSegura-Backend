const db = require('../database/db');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const SECRET_KEY = '12345'; // Cambia esto por una variable de entorno

// Login
const login = (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  const query = 'SELECT * FROM usuario WHERE correo = ?';
  db.get(query, [correo], async (err, user) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jsonwebtoken.sign(
      { id: user.id, correo: user.correo },
      SECRET_KEY,
      { expiresIn: '96h' }
    );
    res.status(200).json({ token });
  });
};

// Registro
const register = async (req, res) => {
  const { nombre, apellido, correo, password } = req.body;
  if (!nombre || !apellido || !correo || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const checkQuery = 'SELECT * FROM usuario WHERE correo = ?';
  db.get(checkQuery, [correo], async (err, user) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (user) {
      return res.status(400).json({ error: 'Correo ya registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery =
      'INSERT INTO usuario (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)';
    db.run(insertQuery, [nombre, apellido, correo, hashedPassword], (err) => {
      if (err) {
        console.error('Error al insertar usuario:', err.message);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  });
};

// Obtener usuario por token
const getUsuario = (req, res) => {
  const authToken = req.headers['authorization'];
  if (!authToken) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authToken.split(' ')[1];
  const { id } = jsonwebtoken.verify(token, SECRET_KEY);

  const query = 'SELECT id, nombre, apellido, correo FROM usuario WHERE id = ?';
  db.get(query, [id], (err, user) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  });
};

// Cambiar contraseña
const changePassword = (req, res) => {
  const authToken = req.headers['authorization'];
  const { oldPassword, newPassword } = req.body;

  if (!authToken || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const token = authToken.split(' ')[1];
  const { id } = jsonwebtoken.verify(token, SECRET_KEY);

  const query = 'SELECT * FROM usuario WHERE id = ?';
  db.get(query, [id], async (err, user) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE usuario SET password = ? WHERE id = ?';
    db.run(updateQuery, [hashedPassword, id], (err) => {
      if (err) {
        console.error('Error al actualizar la contraseña:', err.message);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    });
  });
};

module.exports = { login, register, getUsuario, changePassword };
