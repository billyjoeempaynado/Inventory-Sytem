
const getProducts = "SELECT * FROM products";
const getProductById = "SELECT * FROM products WHERE id = $1";
const addProduct = "INSERT INTO products (product_name, price) VALUES ($1, $2)";
const updateProduct = "UPDATE products SET product_name = $1 WHERE id = $2";
const deleteProduct = "DELETE FROM products WHERE id = $1";

// const checkEmailExist = "SELECT s FROM TABLE_NAME s WHERE s.email = $1";
// const addStudent = "INSERT INTO TABLE_NAME (name, email, age, dob) VALUES ($1, $2, $3, $4)";

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct
  // checkEmailExist,
  // addStudent
};