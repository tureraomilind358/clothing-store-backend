const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Define order routes
router.post("/", orderController.createOrder);                  // Place an order
router.get("/", orderController.getAllOrders);                 // Get all orders (Admin)
router.get("/:id", orderController.getOrderById);              // Get order by ID
router.put("/:id", orderController.updateOrderStatus);         // Update order status (Admin)
router.delete("/:id", orderController.deleteOrder);            // Delete an order (Admin)

module.exports = router;
