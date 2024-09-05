const express = require("express");
const invetoryRoutes = require("./src/product/routes")


const app = express();
const port = 8080;

app.use(express.json());


app.get("/src/register", (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'register.html'));
});

app.get("/src/login", (req, res) => {
    res.render("login");
});

app.use("/api/v1/Inventory_System", invetoryRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));


