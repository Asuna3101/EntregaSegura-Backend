const db = require("../database/db");
const jsonwebtoken = require("jsonwebtoken");

const SECRET_KEY = "12345"; // Cambia esto por una variable de entorno

// Función para calcular el precio
const calcularPrecio = () => Math.random() * (100 - 10) + 10;

// Función para calcular la fecha de entrega
const calcularFechaEntrega = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + 1);
  return fecha.toISOString().split("T")[0];
};

// Crear un pedido
const createPedido = (req, res) => {
  const {
    usuario_id,
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
    !usuario_id ||
    !descripcion ||
    !numero_contacto_destino ||
    !numero_contacto_recibo ||
    !repartidor_id ||
    !direccion_origen ||
    !direccion_destino ||
    !distrito_id_origen ||
    !distrito_id_destino
  ) {
    return res
      .status(400)
      .json({ error: "Todos los campos son obligatorios." });
  }

  // Fecha actual como fecha del pedido
  const fecha_pedido = new Date().toISOString().split("T")[0];

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
        console.error("Error al insertar pedido:", err.message);
        return res.status(500).json({ error: "Error al crear pedido." });
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

// Función para obtener todos los pedidos de un usuario específico
const getPedidosByUsuarioId = (req, res) => {
  const authToken = req.headers.authorization;

  const token = authToken.split(" ")[1];

  const { id } = jsonwebtoken.verify(token, SECRET_KEY);

  const query = `
        SELECT p.*, e.descripcion AS estado_descripcion
        FROM pedido p
        JOIN estado_pedido e ON p.estado_id = e.id
        WHERE usuario_id = ?
    `;

  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error("Error al consultar pedidos:", err.message);
      return res.status(500).json({ error: "Error al recuperar los pedidos." });
    }
    res.status(200).json(rows);
  });
};

// Eliminar un pedido específico
const deletePedido = (req, res) => {
  const { pedido_id } = req.params; // Obtener el ID del pedido de los parámetros de la URL

  if (!pedido_id) {
    return res.status(400).json({
      error: "El ID del pedido es necesario para realizar la operación.",
    });
  }

  const query = `DELETE FROM pedido WHERE id = ?`;

  db.run(query, [pedido_id], function (err) {
    if (err) {
      console.error("Error al eliminar el pedido:", err.message);
      return res.status(500).json({ error: "Error al eliminar el pedido." });
    }
    if (this.changes > 0) {
      res.status(200).json({ message: "Pedido eliminado correctamente." });
    } else {
      res.status(404).json({ error: "Pedido no encontrado." });
    }
  });
};

const getSeguimientoPedido = (req, res) => {
  const pedido_id = req.params.pedido_id;

  if (!pedido_id) {
    return res.status(400).json({
      error: "El ID del pedido es necesario para realizar la consulta.",
    });
  }

  const query = `
        SELECT sp.id, sp.creado_en, sp.latitud, sp.longitud, r.nombre, r.apellido, r.foto
        FROM seguimiento_pedido sp
        JOIN pedido p ON sp.pedido_id = p.id
        JOIN repartidor r ON p.repartidor_id = r.id
        WHERE sp.pedido_id = ?
    `;

  db.get(query, [pedido_id], (err, row) => {
    if (err) {
      console.error(
        "Error al consultar el seguimiento del pedido:",
        err.message
      );
      return res
        .status(500)
        .json({ error: "Error al recuperar el seguimiento del pedido." });
    }
    if (row) {
      res.status(200).json(row);
    } else {
      res.status(404).json({ error: "Seguimiento del pedido no encontrado." });
    }
  });
};

module.exports = {
  createPedido,
  getPedidosByUsuarioId,
  deletePedido,
  getSeguimientoPedido,
};
