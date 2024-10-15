const express = require("express");
const orderRouter = express.Router(); // Correctly use express.Router()
const controller = require("./orderController"); 



orderRouter.get("/", controller.getOrders);
orderRouter.post("/", controller.addOrder);
orderRouter.get("/:order_id", controller.getOrderById);
orderRouter.put("/:order_id", controller.updateOrder);
orderRouter.delete("/:order_id", controller.deleteOrder);

module.exports = orderRouter;