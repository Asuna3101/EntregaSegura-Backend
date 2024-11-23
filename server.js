const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const repartidoresRoutes = require('./routes/repartidores');
const usuariosRoutes = require('./routes/usuarios'); // Importa las rutas de usuarios

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/repartidores', repartidoresRoutes);
app.use('/api/usuarios', usuariosRoutes); // Agrega las rutas de usuarios

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API de Entrega Segura funcionando correctamente.');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
