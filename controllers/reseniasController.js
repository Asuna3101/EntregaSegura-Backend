const db = require('../database/db');

// Obtener reseñas del usuario
const getResenas = (req, res) => {
    // Verificar si el usuario está definido
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    const usuario_id = req.user.id;

    const query = `
        SELECT r.fecha, r.estrellas, r.comentario, rp.nombre AS repartidor, p.id AS pedido_id
        FROM resenas r
        INNER JOIN pedido p ON r.pedido_id = p.id
        INNER JOIN repartidores rp ON p.repartidor_id = rp.id
        WHERE p.usuario_id = ?
    `;

    db.all(query, [usuario_id], (err, rows) => {
        if (err) {
            console.error('Error al obtener reseñas:', err.message);
            return res.status(500).json({ error: 'Error al obtener reseñas.' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron reseñas para este usuario.' });
        }

        res.status(200).json(rows);
    });
};

// Obtener pedidos del usuario
const getPedidos = (req, res) => {
    // Verificar si el usuario está definido
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Usuario no autenticado.' });
    }

    const usuario_id = req.user.id;

    const query = `
        SELECT p.id, p.fecha_pedido, p.fecha_entrega, p.precio, p.direccion_destino, rp.nombre AS repartidor
        FROM pedido p
        INNER JOIN repartidores rp ON p.repartidor_id = rp.id
        WHERE p.usuario_id = ?
        ORDER BY p.fecha_pedido DESC
    `;

    db.all(query, [usuario_id], (err, rows) => {
        if (err) {
            console.error('Error al obtener pedidos:', err.message);
            return res.status(500).json({ error: 'Error al obtener pedidos.' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pedidos para este usuario.' });
        }

        res.status(200).json(rows);
    });
};

module.exports = { getResenas, getPedidos };
