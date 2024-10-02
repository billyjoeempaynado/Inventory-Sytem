
const getItems = "SELECT * FROM items";
const getItemById = "SELECT * FROM items WHERE id = $1";
const addItem = "INSERT INTO items (item_name, stock_number) VALUES ($1, $2)";
const updateItem = "UPDATE items SET item_name = $1, stock_number = $2 WHERE id = $3";
const deleteItem = "DELETE FROM items WHERE id = $1";

// const checkEmailExist = "SELECT s FROM TABLE_NAME s WHERE s.email = $1";
// const addStudent = "INSERT INTO TABLE_NAME (name, email, age, dob) VALUES ($1, $2, $3, $4)";

module.exports = {
  getItems,
  getItemById,
  addItem,
  deleteItem,
  updateItem
  // checkEmailExist,
  // addStudent
};