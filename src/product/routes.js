const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.getProducts);
router.post("/", controller.addItem);
router.get("/:id", controller.getProductById);
router.put("/:id", controller.updateItem);
router.delete("/:id", controller.deleteItem);

module.exports = router;