const express = require("express");
const productRouter = express.Router(); // Correctly use express.Router()
const controller = require("./productController"); 

const router = express.Router();

productRouter.get("/products/", controller.getProducts);
productRouter.post("/products/", controller.addProduct);
productRouter.get("/products/:id", controller.getProductById);
productRouter.put("/products/:id", controller.updateProduct);
productRouter.delete("/products/:id", controller.deleteProduct);

module.exports = productRouter;