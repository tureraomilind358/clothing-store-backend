const db = require("../config/db");

class Cart {
    static async addItem(user_id, product_id, quantity = 1) {
        const [existingItem] = await db.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);

        if (existingItem.length > 0) {
            await db.query("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?", [quantity, user_id, product_id]);
        } else {
            await db.query("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)", [user_id, product_id, quantity]);
        }
    }

    static async getCartItems(user_id) {
        try {
            const [items] = await db.query(`
                SELECT cart.*, products.title AS product_name, products.price 
                FROM cart
                JOIN products ON cart.product_id = products.id
                WHERE cart.user_id = ?
            `, [user_id]);

            return items;
        } catch (error) {
            console.error("Database query error:", error);
            throw error;
        }
    }

    static async removeItem(id) {
        const [result] = await db.query("DELETE FROM cart WHERE id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = Cart;
