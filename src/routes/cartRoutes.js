const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/", cartController.addToCart);            // Add item to cart
router.get("/:user_id", cartController.getCartItems);  // Get cart items
router.delete("/:id", cartController.removeFromCart);  // Remove item from cart

module.exports = router;
