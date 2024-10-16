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

  // Insert the order and retrieve the order_id
  pool.query(queries.addOrder, [customer_name, order_date, status, total_amount], (error, results) => {
    if (error) {
      console.error("Error adding Order:", error);
      return res.status(500).json({ error: "Failed to add Order" });
    }

    // Get the inserted order_id
    const order_id = results.rows[0].order_id; // Extract the order_id from the results

    res.status(201).json({ message: "Order Created Successfully!", order_id }); // Return order_id in the response
  });
};



const deleteOrder = (req, res) => {
  const order_id = parseInt(req.params.order_id);

  // Check if order exists
  pool.query(queries.getOrderById, [order_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve order" });
    }

    const noOrderFound = !results.rows.length;
    if (noOrderFound) {
      return res.status(404).send("Order does not exist in the database");
    }

    // Step 1: Delete order items associated with the order
    pool.query(`DELETE FROM order_items WHERE order_id = $1`, [order_id], (error) => {
      if (error) {
        return res.status(500).json({ error: "Failed to remove order items" });
      }

      // Step 2: Now delete the order itself
      pool.query(queries.deleteOrder, [order_id], (error) => {
        if (error) {
          return res.status(500).json({ error: "Failed to remove Order" });
        }
        res.status(200).send("Order removed successfully.");
      });
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

const addOrderItem = (req, res) => {
  const order_id = parseInt(req.params.order_id); // Make sure you're getting the order_id correctly
  const { product_id, quantity, price } = req.body;

  // Log the values for debugging
  console.log("Order ID:", order_id);
  console.log("Request Body:", req.body);

  // Check if order_id is valid
  if (!order_id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  // Proceed to insert the new order item
  pool.query(queries.addOrderItem, [order_id, product_id, quantity, price], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to add order item" });
    }
    // Update total amount logic here
  });
};



module.exports = {
  getOrders,
  getOrderById,
  addOrder,
  deleteOrder,
  updateOrder,
  addOrderItem


};