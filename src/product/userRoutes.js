const express = require("express"); // Import express
const userRouter = express.Router(); // Correctly use express.Router()

const controller = require("./userController"); // Import user controller

// Define routes
userRouter.get("/", controller.getUsers); // Get all users
userRouter.post("/", controller.addUser); // Add a new user
userRouter.get("/:id", controller.getUserById); // Get user by ID
userRouter.put("/:id", controller.updateUser); // Update user by ID
userRouter.delete("/:id", controller.deleteUser); // Delete user by ID

module.exports = userRouter;