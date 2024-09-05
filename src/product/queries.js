
const getProducts = "SELECT * FROM items";
const getProductById = "SELECT * FROM items WHERE id = $1";
const addItem = "INSERT INTO items (item_name, stock_number) VALUES ($1, $2)";
const updateItem = "UPDATE items SET item_name = $1 WHERE id = $2";
const deleteItem = "DELETE FROM items WHERE id = $1";
// const checkEmailExist = "SELECT s FROM TABLE_NAME s WHERE s.email = $1";
// const addStudent = "INSERT INTO TABLE_NAME (name, email, age, dob) VALUES ($1, $2, $3, $4)";

module.exports = {
  getProducts,
  getProductById,
  addItem,
  deleteItem,
  updateItem
  // checkEmailExist,
  // addStudent
};