const pool = require("../../db");
const queries = require("./productQueries");

const getProducts = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results.rows);
  });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve product" });
    }
    res.status(200).json(results.rows);
  });
};

const addProduct = (req, res) => {
  const { product_name, price } = req.body;

  console.log("Request Body:", req.body); // Log the entire request body

  if (!product_name || !price) {
    return res.status(400).json({ error: "Product name and price are required" });
  }

  pool.query(queries.addProduct, [product_name, price], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to add product" });
    }
    res.status(201).send("Product Created Successfully!");
  });
};

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to delete product" });
    }

    const noItemFound = !results.rows.length;
    if (noItemFound) {
      return res.status(404).send("Product does not exist in the database");
    }

    pool.query(queries.deleteProduct, [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Failed to remove product" });
      }
      res.status(200).send("Product removed successfully.");
    });
  });
};

const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const { product_name, price } = req.body;

  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to update product" });
    }

    const noItemFound = !results.rows.length;
    if (noItemFound) {
      return res.status(404).send("Product does not exist in the database");
    }

    pool.query(queries.updateProduct, [product_name, price, id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Failed to update product" });
      }
      res.status(200).send("Product updated successfully");
    });
  });
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
};
