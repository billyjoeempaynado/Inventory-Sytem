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
  const product_id = parseInt(req.params.product_id);
  pool.query(queries.getProductById, [product_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to retrieve product" });
    }
    res.status(200).json(results.rows);
  });
};

const addProduct = (req, res) => {
  const { product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level } = req.body;

  // Log the entire request body for debugging
  console.log("Request Body:", req.body);

  // Validate required fields
  if (!product_name || !purchase_price) {
    return res.status(400).json({ error: "Product name and purchase price are required" });
  }

  // Proceed with inserting product if validation passes
  pool.query(queries.addProduct, [product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level], (error, results) => {
    if (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Failed to add product" });
    }

    res.status(201).json({ message: "Product Created Successfully!", product: req.body });
  });
};


const deleteProduct = (req, res) => {
  const product_id = parseInt(req.params.product_id);

  pool.query(queries.getProductById, [product_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to delete product" });
    }

    const noItemFound = !results.rows.length;
    if (noItemFound) {
      return res.status(404).send("Product does not exist in the database");
    }

    pool.query(queries.deleteProduct, [product_id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Failed to remove product" });
      }
      res.status(200).send("Product removed successfully.");
    });
  });
};

const updateProduct = (req, res) => {
  const product_id = parseInt(req.params.product_id);
  const { product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level } = req.body;

  pool.query(queries.getProductById, [product_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Failed to update product" });
    }

    const noItemFound = !results.rows.length;
    if (noItemFound) {
      return res.status(404).send("Product does not exist in the database");
    }

    pool.query(queries.updateProduct, [product_name, purchase_price, description, category_id, supplier_id, selling_price, quantity_instock, reorder_level, product_id], (error, results) => {
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
