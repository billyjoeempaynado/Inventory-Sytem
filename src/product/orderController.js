const pool = require("../../db");
const queries = require("./orderQueries");

const getOrders = (req, res) => {
  pool.query(queries.getOrders, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve Order" });
    }
    res.status(200).json(results.rows);
  });
};

const getOrderById = (req, res) => {
  const order_id = parseInt(req.params.order_id);
  pool.query(queries.getOrderById, [order_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve  Order" });
    }
    res.status(200).json(results.rows);
  });
};

const addOrder = (req, res) => {
  const { customer_name, order_date, status, total_amount } = req.body;

  // Log the entire request body for debugging
  console.log("Request Body:", req.body);

  // Validate required fields
  if (!customer_name || !order_date) {
    return res.status(400).json({ error: "Customer name and order date are required" });
  }

  // Proceed with inserting Order if validation passes
  pool.query(queries.addOrder, [customer_name, order_date, status, total_amount], (error, results) => {
    if (error) {
      console.error("Error adding Order:", error);
      return res.status(500).json({ error: "Failed to add Order" });
    }

    res.status(201).json({ message: "Order Created Successfully!", oder: req.body });
  });
};


const deleteOrder = (req, res) => {
  const order_id = parseInt(req.params.order_id);

  pool.query(queries.getOrderById, [order_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to delete Order" });
    }

    const noOrderFound = !results.rows.length;
    if (noOrderFound) {
      return res.status(404).send("Order does not exist in the database");
    }

    pool.query(queries.deleteOrder, [order_id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Failed to remove Order" });
      }
      res.status(200).send("Order removed successfully.");
    });
  });
};

const updateOrder = (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const { customer_name, order_date, status } = req.body;

  pool.query(queries.getOrderById, [order_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve order" });
    }

    const noOrderFound = !results.rows.length;
    if (noOrderFound) {
      return res.status(404).send("This Order does not exist in the database");
    }

    pool.query(queries.updateOrder, [customer_name, order_date, status, order_id], (error, results) => { // Pass `order_id` as the 4th parameter
      if (error) {
        return res.status(500).json({ error: "Failed to update order" });
      }
      res.status(200).send("Order updated successfully");
    });
  });
};


module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  deleteOrder,
  updateOrder

};
