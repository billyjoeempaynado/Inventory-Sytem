const express = require("express");
const path = require("path");  // Import path module
const { pool } = require("./dbConfig");
const bcrypt = require ("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const itemRoutes = require("./src/product/routes"); // Importing item route
const userRoutes = require("./src/product/userRoutes");
const productRoutes = require("./src/product/productRoutes");


const initializePassport = require("./passportConfig");
initializePassport(passport);

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src")));

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
})
);

// Routes
app.use("/api/v1/inventory", itemRoutes);
app.use("/api/v1/inventory", productRoutes);
app.use("/api/v1/users", userRoutes);



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON
app.use(cors());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
    res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    res.render("dashboard");
});

app.get("/users/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash("success_msg", "You have logged out");
        res.redirect("/users/login");
    });
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

        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results) => {
                if(err) {
                    throw err;
                }
                    
                    console.log(results.rows);

                    if(results.rows.length > 0) {
                        errors.push({ message: "Email already registered"});
                        res.render("register", {errors});
                    }else{
                        pool.query(
                            `INSERT INTO users(name, email, password)
                            VALUES ($1, $2, $3)
                            RETURNING id, password`, [name, email, hashedPassword],
                            (err, results) => {
                                if (err){
                                    throw err;
                                }
                                console.log(results.rows);
                                req.flash("success_msg", "You are now registered. Please log in");
                                res.redirect("/users/login");
                            }
                        );
                    }
            }
        );
    }
});

app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
    })
);

// POST route for /items
app.post("/items", (req, res) => {
    const { item_name, stock_number } = req.body;

    // Process the data (e.g., save it to a database)
    console.log(`Item Name: ${item_name}, Stock Number: ${stock_number}`);

    // Send a success response
    res.status(201).json({ message: 'Item added successfully' });
});

// POST route for /items
app.post("/poducts", (req, res) => {
    const { product_name, price } = req.body;

    // Process the data (e.g., save it to a database)
    console.log(`Product Name: ${product_name}, Price: ${price}`);

    // Send a success response
    res.status(201).json({ message: 'Product added successfully' });
});


function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/users/login");
}


app.listen(port, () => console.log(`app listening on port ${port}`));