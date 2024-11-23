const db = require('../database/db');

// Obtener todos los repartidores
const getRepartidores = (req, res) => {
  const query = `
    SELECT r.id, r.nombre, r.apellido, r.foto, 
           COALESCE(AVG(c.estrella), 0) AS estrellas_promedio, 
           e.descripcion AS estado
    FROM repartidor r
    LEFT JOIN calificacion c ON r.id = c.repartidor_id
    JOIN estado_repartidor e ON r.estado_id = e.id
    GROUP BY r.id, e.descripcion;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      res.status(500).json({ error: 'Error al obtener los repartidores.' });
    } else {
      res.json(rows);
    }
  });
};

// Obtener un repartidor por ID
const getRepartidorById = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT r.id, r.nombre, r.apellido, r.foto, 
           COALESCE(AVG(c.estrella), 0) AS estrellas_promedio, 
           e.descripcion AS estado
    FROM repartidor r
    LEFT JOIN calificacion c ON r.id = c.repartidor_id
    JOIN estado_repartidor e ON r.estado_id = e.id
    WHERE r.id = ?
    GROUP BY r.id, e.descripcion;
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.message);
      res.status(500).json({ error: 'Error al obtener el repartidor.' });
    } else if (!row) {
      res.status(404).json({ error: 'Repartidor no encontrado.' });
    } else {
      res.json(row);
    }
  });
};

// Obtener reseñas por repartidor
const getReseñasByRepartidor = (req, res) => {
  const { id } = req.params; // ID del repartidor
  const query = `
    SELECT c.id, u.nombre AS autor, r.nombre AS repartidor, 
           c.estrella, c.resenia AS comentario
    FROM calificacion c
    JOIN usuario u ON c.usuario_id = u.id
    JOIN repartidor r ON c.repartidor_id = r.id
    WHERE r.id = ?;
  `;

  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error('Error al obtener reseñas:', err.message);
      res.status(500).json({ error: 'Error al obtener las reseñas.' });
    } else {
      res.json(rows);
    }
  });
};

// Exportar todas las funciones
module.exports = { getRepartidores, getRepartidorById, getReseñasByRepartidor };
