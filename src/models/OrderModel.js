const db = require("../config/db");

class Order {
    static async createOrder(user_id, product_id, quantity, total_price) {
        const [result] = await db.query(
            "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
            [user_id, product_id, quantity, total_price]
        );
        return result.insertId;
    }

    static async getAllOrders() {
        const [orders] = await db.query("SELECT * FROM orders");
        return orders;
    }

    static async getOrderById(id) {
        const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
        return orders[0];
    }

    static async updateOrderStatus(id, status) {
        const [result] = await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
        return result.affectedRows;
    }

    static async deleteOrder(id) {
        const [result] = await db.query("DELETE FROM orders WHERE id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = Order;
