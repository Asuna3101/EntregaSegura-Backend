const db = require("../database/db");
const jsonwebtoken = require("jsonwebtoken");

const SECRET_KEY = "12345"; 


const getReseniasByUsuarioId = (req, res) => {

    const authToken = req.headers.authorization;
    
  const token = authToken.split(" ")[1];

  const { id } = jsonwebtoken.verify(token, SECRET_KEY);
    const query = `
        SELECT c.id, c.resenia, c.estrella, c.repartidor_id, c.usuario_id, r.nombre as repartidor_nombre
        FROM calificacion c
        JOIN repartidor r ON c.repartidor_id = r.id
        WHERE c.usuario_id = ?
        ORDER BY c.id DESC;
    `;

    db.all(query, [id], (err, rows) => {
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
        return res.status(400).json({
            error: "El ID de la reseña es necesario para realizar la operación.",
        });
    }

    const query = `DELETE FROM calificacion WHERE id = ?`;

    db.run(query, [resenia_id], function (err) {
        if (err) {
            console.error("Error al eliminar la reseña:", err.message);
            return res.status(500).json({ error: "Error al eliminar la reseña." });
        }
        if (this.changes > 0) {
            res.status(200).json({ message: "Reseña eliminada correctamente." });
        } else {
            res.status(404).json({ error: "Reseña no encontrada." });
        }
    });
};

const createResenia = (req, res) => {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).json({
            ok: false,
            error: "No authorization token provided."
        });
    }
    
    const token = authToken.split(" ")[1];
    let decoded;

    try {
        decoded = jsonwebtoken.verify(token, SECRET_KEY);
    } catch (error) {
        return res.status(401).json({
            ok: false,
            error: "Invalid token."
        });
    }

    const usuario_id = decoded.id; // Getting the user ID from the token
    const { repartidor_id, estrellas, resenia } = req.body;

    if (!repartidor_id || estrellas == null || !resenia) {
        return res.status(400).json({
            ok: false,
            error: "All fields are required."
        });
    }

    const query = `
        INSERT INTO calificacion (usuario_id, repartidor_id, estrella, resenia)
        VALUES (?, ?, ?, ?);
    `;

    db.run(query, [usuario_id, repartidor_id, estrellas, resenia], function (err) {
        if (err) {
            console.error("Error inserting review:", err.message);
            return res.status(500).json({
                ok: false,
                error: "Error creating the review."
            });
        }

        res.status(201).json({
            ok: true,
            id: this.lastID,
            usuario_id,
            repartidor_id,
            estrella: estrellas,
            resenia,
        });
    });
};


module.exports = {
  getReseniasByUsuarioId,
  deleteResenia,
  createResenia,
};
