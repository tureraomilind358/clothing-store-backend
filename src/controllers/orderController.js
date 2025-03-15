const Order = require("../models/OrderModel");
const db = require("../config/db");
const sendEmail = require("../utils/sendEmail"); // Utility for sending emails

// Place a new order
exports.createOrder = async (req, res) => {
    try {
        const { user_id, product_id, quantity } = req.body;

        // Get product price
        const [product] = await db.query("SELECT price, stock FROM products WHERE id = ?", [product_id]);

        if (!product.length) return res.status(404).json({ error: "Product not found" });

        if (product[0].stock < quantity) return res.status(400).json({ error: "Insufficient stock" });

        const total_price = product[0].price * quantity;

        // Create order
        const orderId = await Order.createOrder(user_id, product_id, quantity, total_price);

        // Reduce stock
        await db.query("UPDATE products SET stock = stock - ? WHERE id = ?", [quantity, product_id]);

        // Send email notification
        const [user] = await db.query("SELECT email FROM users WHERE id = ?", [user_id]);
        if (user.length) {
            await sendEmail(user[0].email, "Order Confirmation", `Your order #${orderId} has been placed.`);
        }

        res.status(201).json({ message: "Order placed successfully", orderId });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
    }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.getOrderById(id);

        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch order" });
    }
};

// Update order status (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updated = await Order.updateOrderStatus(id, status);

        if (updated === 0) return res.status(404).json({ error: "Order not found" });

        // Send email notification
        const [order] = await db.query("SELECT user_id FROM orders WHERE id = ?", [id]);
        const [user] = await db.query("SELECT email FROM users WHERE id = ?", [order[0].user_id]);
        
        if (user.length) {
            await sendEmail(user[0].email, "Order Update", `Your order #${id} status changed to ${status}`);
        }

        res.json({ message: "Order updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order" });
    }
};

// Delete order (Admin)
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Order.deleteOrder(id);

        if (deleted === 0) return res.status(404).json({ error: "Order not found" });

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete order" });
    }
};
