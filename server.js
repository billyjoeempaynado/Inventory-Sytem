const express = require("express");
const path = require("path");  // Import path module

const invetoryRoutes = require("./src/product/routes")


const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("index");
});

app.get("/src/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'register.html'));
});

app.get("/src/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

app.use("/api/v1/Inventory_System", invetoryRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));


