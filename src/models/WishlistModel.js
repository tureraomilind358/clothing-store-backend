const db = require("../config/db");

class Wishlist {
    static async addItem(user_id, product_id) {
        const [existingItem] = await db.query("SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?", [user_id, product_id]);

        if (existingItem.length === 0) {
            await db.query("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", [user_id, product_id]);
        }
    }

    static async getWishlistItems(user_id) {
        const [items] = await db.query(
            `SELECT wishlist.*, 
                    products.title, 
                    products.price 
             FROM wishlist 
             JOIN products ON wishlist.product_id = products.id 
             WHERE wishlist.user_id = ?`, 
            [user_id]
        );
        return items;
    }

    static async removeItem(id) {
        const [result] = await db.query("DELETE FROM wishlist WHERE id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = Wishlist;
