
// En tu controlador, por ejemplo, reseniasController.js
const db = require('../database/db');
const getReseniasByUsuarioId = (req, res) => {
    const usuario_id = req.params.usuario_id;

    if (!usuario_id) {
        return res.status(400).json({ error: 'El ID del usuario es necesario para realizar la consulta.' });
    }

    const query = `
        SELECT c.id, c.resenia, c.estrella, c.repartidor_id, u.nombre as repartidor_nombre
        FROM calificacion c
        JOIN usuario u ON c.repartidor_id = u.id
        WHERE c.usuario_id = ?
        ORDER BY c.id DESC;  // Ordenando por ID para obtener las más recientes primero
    `;

    db.all(query, [usuario_id], (err, rows) => {
        if (err) {
            console.error('Error al consultar reseñas:', err.message);
            return res.status(500).json({ error: 'Error al recuperar las reseñas.' });
        }
        res.status(200).json(rows);
    });
};

const deleteResenia = (req, res) => {
    const { resenia_id } = req.params; // Obtener el ID de la reseña de los parámetros de la URL

    if (!resenia_id) {
        return res.status(400).json({ error: 'El ID de la reseña es necesario para realizar la operación.' });
    }

    const query = `DELETE FROM calificacion WHERE id = ?`;

    db.run(query, [resenia_id], function (err) {
        if (err) {
            console.error('Error al eliminar la reseña:', err.message);
            return res.status(500).json({ error: 'Error al eliminar la reseña.' });
        }
        if (this.changes > 0) {
            res.status(200).json({ message: 'Reseña eliminada correctamente.' });
        } else {
            res.status(404).json({ error: 'Reseña no encontrada.' });
        }
    });
};


const createResenia = (req, res) => {
    const { usuario_id, repartidor_id, estrella, resenia } = req.body;

    if (!usuario_id || !repartidor_id || estrella == null || !resenia) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const query = `
        INSERT INTO calificacion (usuario_id, repartidor_id, estrella, resenia)
        VALUES (?, ?, ?, ?);
    `;

    db.run(query, [usuario_id, repartidor_id, estrella, resenia], function(err) {
        if (err) {
            console.error('Error al insertar la calificación:', err.message);
            return res.status(500).json({ error: 'Error al crear la calificación.' });
        }
        res.status(201).json({
            id: this.lastID,
            usuario_id,
            repartidor_id,
            estrella,
            resenia
        });
    });
};


module.exports = {
    getReseniasByUsuarioId,
    deleteResenia,
    createResenia,
};
