const express = require('express');
const router = express.Router();
const db = require('../database/db');

// todos los paises
router.get('/paises', (req, res) => {
    const query = 'SELECT id, nombre FROM pais';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching countries:', err.message);
            return res.status(500).json({ error: 'Error fetching countries' });
        }
        res.status(200).json(rows);
    });
});

// departamentos del pais
router.get('/ciudades/:paisId', (req, res) => {
    const { paisId } = req.params;
    const query = 'SELECT id, nombre FROM ciudad WHERE pais_id = ?';
    db.all(query, [paisId], (err, rows) => {
        if (err) {
            console.error('Error fetching cities:', err.message);
            return res.status(500).json({ error: 'Error fetching cities' });
        }
        res.status(200).json(rows);
    });
});

// distritos de la ciudad
router.get('/distritos/:ciudadId', (req, res) => {
    const { ciudadId } = req.params;
    const query = 'SELECT id, nombre FROM distrito WHERE ciudad_id = ?';
    db.all(query, [ciudadId], (err, rows) => {
        if (err) {
            console.error('Error fetching districts:', err.message);
            return res.status(500).json({ error: 'Error fetching districts' });
        }
        res.status(200).json(rows);
    });
});



// todos los distritos



router.get('/distritos', (req, res) => {
    const query = 'SELECT id, nombre FROM distrito';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching countries:', err.message);
            return res.status(500).json({ error: 'Error fetching countries' });
        }
        res.status(200).json(rows);
    });
});

module.exports = router;
