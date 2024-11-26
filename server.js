const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const repartidoresRoutes = require('./routes/repartidores');
const usuariosRoutes = require('./routes/usuarios'); // Importa las rutas de usuarios
const coberturaRoutes = require('./routes/cobertura'); // Importa las rutas de cobertura
const pedidoRoutes = require('./routes/pedido'); // Importar rutas de pedidos
const reseniusRoutes = require('./routes/resenias'); // Importar rutas de reseñas
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/repartidores', repartidoresRoutes);
app.use('/api/usuarios', usuariosRoutes); // Agrega las rutas de usuarios
app.use('/api/cobertura', coberturaRoutes); // Agrega las rutas de cobertura
app.use('/api/pedido', pedidoRoutes); // Usar rutas de pedidos
app.use('/api/resenias', reseniusRoutes); // Usar rutas de reseñas

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API de Entrega Segura funcionando correctamente.');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


