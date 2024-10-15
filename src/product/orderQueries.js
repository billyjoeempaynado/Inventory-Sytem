const getOrders = "SELECT * FROM orders";
const getOrderById = "SELECT * FROM orders WHERE order_id = $1";
const addOrder = "INSERT INTO orders (customer_name, order_date, status, total_amount) VALUES ($1, $2, $3, $4) RETURNING order_id";
const updateOrder = "UPDATE orders SET customer_name = $1, order_date = $2, status = $3 WHERE order_id = $4 RETURNING order_id, customer_name, order_date, status";
const deleteOrder = "DELETE FROM orders WHERE order_id = $1";
const addOrderItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)";
const updateTotalAmount = "UPDATE orders SET total_amount = (SELECT SUM(quantity * price) FROM order_items WHERE order_id = $1) WHERE order_id = $1";

module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
  addOrderItem,
  updateTotalAmount // New query for updating total_amount
};
