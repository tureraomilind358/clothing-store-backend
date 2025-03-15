const Cart = require("../models/CartModel");

exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;
        await Cart.addItem(user_id, product_id, quantity);
        res.status(201).json({ message: "Item added to cart successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

exports.getCartItems = async (req, res) => {
    try {
        const { user_id } = req.params;
        const items = await Cart.getCartItems(user_id);
        // console.log("get items",user_id,items);
        
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Cart.removeItem(id);
        if (removed === 0) return res.status(404).json({ error: "Item not found" });
        res.json({ message: "Item removed from cart successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
};
