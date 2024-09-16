const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/items/", controller.getProducts);
router.post("/items/", controller.addItem);
router.get("/items/:id", controller.getProductById);
router.put("/items/:id", controller.updateItem);
router.delete("/items/:id", controller.deleteItem);

module.exports = router;