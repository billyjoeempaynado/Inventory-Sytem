const pool = require("../../db");
const queries = require("./queries");

const getItems = (req, res) => {
  pool.query(queries.getItems, (error, results) => {
    if (error) throw error;
      res.status(200).json(results.rows);  
  })
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getItemById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addItem = (req, res) => {
  const { item_name, stock_number } = req.body;

  console.log("Request Body:", req.body);  // Log the entire request body

  if (!item_name || !stock_number) {
    return res.status(400).json({ error: "Item name and stock number are required" });
  }

  pool.query(queries.addItem, [item_name, stock_number], (error, results) => {
    if (error) throw error;
    res.status(201).send("Item Created Successfully!");
  });
};

  // for email check if email exist
  // pool.query(queries.checkEmailExist, [email], (error, results) => {
  //   if (results.rows.length) {
  //       res.send("Email already exists.");
  //   }
          // add student to db
          // pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
              //if (error) throw error;
              // res.status(201).send("Student Created Successfully!");  
          //});
  // });

const deleteItem = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getItemById, [id], (error, results) =>{
          const noItemFound = !results.rows.length;
          if (noItemFound) {
          res.send("Item does not exist in the database");
        }

        pool.query(queries.deleteItem, [id], (error, results) => {
          if (error) throw error;
          res.status(200).send("Item removed successfully.");
        })
    });
};

const updateItem = (req, res) => {
  const id = parseInt(req.params.id);
  const {item_name} = req.body;

  pool.query(queries.getItemById, [id], (error, results) => {
    const noItemFound = !results.rows.length;
    if (noItemFound) {
    res.send("Item does not exist in the database");
     }

     pool.query(queries.updateItem, [item_name, id], (error,results) => {
      if (error) throw error;
      res.status(200).send("Item updated succesfully");
     });
  });
};




module.exports = {
  getItems,
  getItemById,
  addItem,
  deleteItem,
  updateItem
};