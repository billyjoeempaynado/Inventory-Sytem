const express = require("express");
const path = require("path");  // Import path module
const { pool } = require("./dbConfig");


const inventoryRoutes = require("./src/product/routes")


const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "src")));



app.get("/src/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'register.html'));
  });

app.get("/src/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login.html'));
});


app.get("/src/index", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.use("/api/v1/Inventory_System", inventoryRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));


