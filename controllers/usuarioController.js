const db = require('../database/db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jsonwebtoken = require('jsonwebtoken');

const SECRET_KEY = '12345'; // Cambia esto por una variable de entorno
const REFRESH_TOKEN = '123456789'; // Cambia esto por una variable de entorno

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

const forgotPassword = (req, res) => {
  const { correo } = req.body;

  if (!correo) {
      return res.status(400).json({ error: 'El correo es obligatorio' });
  }

  const query = 'SELECT * FROM usuario WHERE correo = ?';
  db.get(query, [correo], (err, user) => {
      if (err) {
          console.error('Error al consultar la base de datos:', err.message);
          return res.status(500).json({ error: 'Error en el servidor' });
      }

      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const refresh_token = jsonwebtoken.sign(
          { id: user.id, correo: user.correo },
          REFRESH_TOKEN,
          { expiresIn: '30h' }
      );

      const updateQuery = 'UPDATE usuario SET recovery_password = ? WHERE id = ?';
      db.run(updateQuery, [refresh_token, user.id], (err) => {
          if (err) {
              console.error('Error al guardar el token en la base de datos:', err.message);
              return res.status(500).json({ error: 'Error en el servidor' });
          }

          const transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: 'andreaximena2004@gmail.com',
                  pass: 'pojy kqgq tcki egej', // Asegúrate de que esta clave sea correcta.
              },
          });

          const mailOptions = {
              from: 'andreaximena2004@gmail.com',
              to: user.correo,
              subject: 'Recuperación de contraseña',
              text: `Ingrese al siguiente enlace para cambiar su contraseña: http://localhost:3000/reset-password?token=${refresh_token}`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  console.error('Error al enviar el correo:', error.message);
                  return res.status(500).json({ error: 'Error al enviar el correo' });
              }
              res.status(200).json({ message: 'Correo enviado con éxito' });
          });
      });
  });
};


const resetPasswordWithToken = (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña son requeridos.' });
  }

  // Buscar al usuario por el token de recuperación
  const query = 'SELECT * FROM usuario WHERE recovery_password = ?';
  db.get(query, [token], async (err, user) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err.message);
      return res.status(500).json({ error: 'Error en el servidor.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado o token inválido.' });
    }

    try {
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña y limpiar el token de recuperación
      const updateQuery = 'UPDATE usuario SET password = ?, recovery_password = NULL WHERE id = ?';
      db.run(updateQuery, [hashedPassword, user.id], (err) => {
        if (err) {
          console.error('Error al actualizar la contraseña:', err.message);
          return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }
        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
      });
    } catch (error) {
      console.error('Error al encriptar la contraseña:', error.message);
      res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
  });
};

const deleteUser = (req, res) => {
  const authToken = req.headers['authorization'];

  if (!authToken) {
      return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authToken.split(' ')[1];
  const { id } = jsonwebtoken.verify(token, SECRET_KEY);

  const query = 'DELETE FROM usuario WHERE id = ?';
  db.run(query, [id], (err) => {
      if (err) {
          console.error('Error al eliminar usuario:', err.message);
          return res.status(500).json({ error: 'Error en el servidor al eliminar usuario' });
      }
      res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
  });
};


// Actualizar datos del usuario
const updateUser = (req, res) => {
  const authToken = req.headers['authorization'];
  const { nombre, apellido, correo } = req.body;

  if (!authToken) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authToken.split(' ')[1];
  const { id } = jsonwebtoken.verify(token, SECRET_KEY);

  if (!nombre || !apellido || !correo) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  const query = 'UPDATE usuario SET nombre = ?, apellido = ?, correo = ? WHERE id = ?';
  db.run(query, [nombre, apellido, correo, id], (err) => {
    if (err) {
      console.error('Error al actualizar usuario:', err.message);
      return res.status(500).json({ error: 'Error en el servidor al actualizar usuario' });
    }

    res.status(200).json({ message: 'Datos actualizados con éxito' });
  });
};

module.exports = { login, register, getUsuario, changePassword, forgotPassword, resetPasswordWithToken, deleteUser, updateUser};
