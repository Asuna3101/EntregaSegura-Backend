const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); 
const repartidoresRoutes = require('./routes/repartidores');
const usuariosRoutes = require('./routes/usuarios'); // Importa las rutas de usuarios
const coberturaRoutes = require('./routes/cobertura'); // Importa las rutas de cobertura
const pedidoRoutes = require('./routes/pedido');
const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// Rutas
app.use('/api/repartidores', repartidoresRoutes);
app.use('/api/usuarios', usuariosRoutes); 
app.use('/api/cobertura', coberturaRoutes); 
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/api/pedido',pedidoRoutes);
// Ruta raíz
app.get('/', (req, res) => {
  res.send('API de Entrega Segura funcionando correctamente.');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
