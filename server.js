const express = require("express");
const path = require("path");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");


const userRoutes = require("./src/product/userRoutes");
const supplierRoutes = require("./src/product/supplierRoutes");
const productRoutes = require("./src/product/productRoutes");

const initializePassport = require("./passportConfig");
initializePassport(passport);


const app = express();
const port = process.env.PORT || 8080;



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "src")));

// Middleware order adjusted
app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes

app.use("/api/inventory/products", productRoutes);
app.use("/api/inventory/suppliers", supplierRoutes);
app.use("/api/v1/users", userRoutes);


app.get("/", (req, res) => {
    res.render("dashboard");
});


// Route to render items page
app.get('/orders', (req, res) => {
    res.render('orders');  // Render the order.ejs view
});

// Route to render items page
app.get('/suppliers', (req, res) => {
    res.render('suppliers');  // Render the supplier.ejs view
});

// Route to render items page
app.get('/products', (req, res) => {
    res.render('products'); // Renders product.ejs
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
    let { name, email, password, password2 } = req.body;

    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }
    if (password != password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        return res.render("register", { errors });
    } else {
        // Form validation passed
        try {
            let hashedPassword = await bcrypt.hash(password, 10);
            const userCheck = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

            if (userCheck.rows.length > 0) {
                errors.push({ message: "Email already registered" });
                return res.render("register", { errors });
            } else {
                const newUser = await pool.query(
                    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`,
                    [name, email, hashedPassword]
                );
                req.flash("success_msg", "You are now registered. Please log in");
                res.redirect("/users/login");
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }
});



app.post("/users/login", passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
}));

// API endpoint to get item and product counts
app.get('/api/counts', async (req, res) => {
    try {
      const productCountQuery = 'SELECT COUNT(*) AS product_count FROM Products';
  

      const productCountResult = await pool.query(productCountQuery);
    
      const productCount = productCountResult.rows[0].product_count;
  
      res.json({productCount });
    } catch (err) {
      console.error('Error occurred while fetching counts:', err);
      res.status(500).json({ error: 'Error retrieving counts', details: err.message });
    }
  });




function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/dashboard");
    }
    next();
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/users/login");
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
