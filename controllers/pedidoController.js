const db = require('../database/db');

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
    // Aquí ya no estamos verificando el token
    const { usuario_id, descripcion, numero_contacto_destino, numero_contacto_recibo, repartidor_id, direccion_origen, direccion_destino, distrito_id_origen, distrito_id_destino } = req.body;

    // Validar datos obligatorios
    if (
        !usuario_id || !descripcion || !numero_contacto_destino || !numero_contacto_recibo ||
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
};

module.exports = {
    createPedido,
};