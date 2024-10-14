const express = require("express");
const productRouter = express.Router(); // Correctly use express.Router()
const controller = require("./productController"); 


productRouter.get("/products/", controller.getProducts);
productRouter.post("/products/", controller.addProduct);
productRouter.get("/products/:product_id", controller.getProductById);
productRouter.put("/products/:product_id", controller.updateProduct);
productRouter.delete("/products/:product_id", controller.deleteProduct);

module.exports = productRouter;