const express = require("express");
const supplierRouter = express.Router(); // Correctly use express.Router()
const controller = require("./supplierController");

const router = express.Router();

supplierRouter.get("/suppliers/", controller.getSuppliers);
supplierRouter.post("/suppliers/", controller.addSupplier);
supplierRouter.get("/suppliers/:supplier_id", controller.getSupplierById);
supplierRouter.put("/suppliers/:supplier_id", controller.updateSupplier);
supplierRouter.delete("/suppliers/:supplier_id", controller.deleteSupplier);

module.exports = supplierRouter;