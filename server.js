const express = require("express");
const path = require("path");  // Import path module
const { pool } = require("./dbConfig");
const brcypt = require ("bcrypt");


const inventoryRoutes = require("./src/product/routes")
const userRouter = require("./src/product/userRoutes")


const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "src")));

app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/users/register", (req, res) => {
    res.render("register");
});

app.get("/users/login", (req, res) => {
    res.render("login");
});

app.get("/users/dashboard", (req, res) => {
    res.render("dashboard", {user:"Billy"});
});


app.post("/users/register", async (req, res) => {
    let {name, email, password, password2 } = req.body;

    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields"});
    }

    if (password.length <6) {
        errors.push({ message:"Password should be at least 6 Characters"});
    }

    if (password != password2) {
        errors.push({ message: "Password not matched"});
    }

    if (errors.length > 0) {
        res.render("register", {errors});
    }else{
        // Form validation has passed

        let hashedPassword = await brcypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELCET * FROM users
            WHERE email = $1`, [email], (err, result) => {
                if(err) {
                    throw err;
                }
                    console.log(result.rows);
            }
        );
    }
});


app.use("/api/v1/Inventory_System", inventoryRoutes);
app.use("/api/v1/Users", userRouter);

app.listen(port, () => console.log(`app listening on port ${port}`));


