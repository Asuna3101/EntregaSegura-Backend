const db = require('../database/db');
const jwt = require('jsonwebtoken');

// Función para calcular el precio
const calcularPrecio = () => Math.random() * (100 - 10) + 10;

// Función para calcular la fecha de entrega
const calcularFechaEntrega = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0];
};

// Crear un pedido
const createPedido = (req, res) => {
    const token = req.headers.authorization;

    // Verificar si se proporcionó un token
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado. Por favor, inicie sesión.' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token.split(' ')[1], 'SECRET_KEY'); // Cambia 'SECRET_KEY' por tu clave secreta
        const usuario_id = decoded.id;

        const {
            descripcion,
            numero_contacto_destino,
            numero_contacto_recibo,
            repartidor_id,
            direccion_origen,
            direccion_destino,
            distrito_id_origen,
            distrito_id_destino,
        } = req.body;

        // Validar datos obligatorios
        if (
            !descripcion || !numero_contacto_destino || !numero_contacto_recibo ||
            !repartidor_id || !direccion_origen || !direccion_destino ||
            !distrito_id_origen || !distrito_id_destino
        ) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Fecha actual como fecha del pedido
        const fecha_pedido = new Date().toISOString().split('T')[0];

        // Calcular precio y fecha de entrega
        const precio = calcularPrecio().toFixed(2);
        const fecha_entrega = calcularFechaEntrega();

        const query = `
            INSERT INTO pedido (
                descripcion, fecha_pedido, fecha_entrega,
                numero_contacto_destino, numero_contacto_recibo,
                usuario_id, repartidor_id, direccion_origen,
                direccion_destino, distrito_id_origen,
                distrito_id_destino, estado_id, precio
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `;

        db.run(
            query,
            [
                descripcion,
                fecha_pedido,
                fecha_entrega,
                numero_contacto_destino,
                numero_contacto_recibo,
                usuario_id,
                repartidor_id,
                direccion_origen,
                direccion_destino,
                distrito_id_origen,
                distrito_id_destino,
                precio,
            ],
            function (err) {
                if (err) {
                    console.error('Error al insertar pedido:', err.message);
                    return res.status(500).json({ error: 'Error al crear pedido.' });
                }
                res.status(201).json({
                    id: this.lastID,
                    descripcion,
                    fecha_pedido,
                    fecha_entrega,
                    precio,
                });
            }
        );
    } catch (error) {
        console.error('Error al verificar token:', error.message);
        return res.status(401).json({ error: 'Token no válido. Por favor, inicie sesión nuevamente.' });
    }
};

module.exports = {
    createPedido,
};
