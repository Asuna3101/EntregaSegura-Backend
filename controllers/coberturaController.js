const db = require('../database/db');

// Obtener todos los países
const getPaises = (req, res) => {
    const query = 'SELECT id, nombre FROM pais';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching countries:', err.message);
            return res.status(500).json({ error: 'Error fetching countries' });
        }
        res.status(200).json(rows);
    });
};

// Obtener las ciudades de un país
const getCiudadesByPais = (req, res) => {
    const { paisId } = req.params;
    const query = 'SELECT id, nombre FROM ciudad WHERE pais_id = ?';
    db.all(query, [paisId], (err, rows) => {
        if (err) {
            console.error('Error fetching cities:', err.message);
            return res.status(500).json({ error: 'Error fetching cities' });
        }
        res.status(200).json(rows);
    });
};

// Obtener los distritos de una ciudad
const getDistritosByCiudad = (req, res) => {
    const { ciudadId } = req.params;
    const query = 'SELECT id, nombre FROM distrito WHERE ciudad_id = ?';
    db.all(query, [ciudadId], (err, rows) => {
        if (err) {
            console.error('Error fetching districts:', err.message);
            return res.status(500).json({ error: 'Error fetching districts' });
        }
        res.status(200).json(rows);
    });
};

// Obtener todos los distritos
const getAllDistritos = (req, res) => {
    const query = 'SELECT id, nombre FROM distrito';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching districts:', err.message);
            return res.status(500).json({ error: 'Error fetching districts' });
        }
        res.status(200).json(rows);
    });
};

// Exportar todas las funciones del controlador
module.exports = {
    getPaises,
    getCiudadesByPais,
    getDistritosByCiudad,
    getAllDistritos,
};
