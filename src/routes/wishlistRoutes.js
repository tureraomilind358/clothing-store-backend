const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

router.post("/", wishlistController.addToWishlist);            // Add item to wishlist
router.get("/:user_id", wishlistController.getWishlistItems);  // Get wishlist items
router.delete("/:id", wishlistController.removeFromWishlist);  // Remove item from wishlist

module.exports = router;

