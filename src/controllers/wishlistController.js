const Wishlist = require("../models/WishlistModel");

exports.addToWishlist = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        await Wishlist.addItem(user_id, product_id);
        res.status(201).json({ message: "Item added to wishlist successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to wishlist" });
    }
};

exports.getWishlistItems = async (req, res) => {
    try {
        const { user_id } = req.params;
        const items = await Wishlist.getWishlistItems(user_id);
        console.log("get Wishlist",user_id,items);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wishlist items" });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Wishlist.removeItem(id);
        if (removed === 0) return res.status(404).json({ error: "Item not found" });
        res.json({ message: "Item removed from wishlist successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item from wishlist" });
    }
};
