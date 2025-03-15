const db = require("../config/db");

const ProductModel = {
  getAllProducts: async () => {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  },

  getProductById: async (id) => {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
  },

  createProduct: async (productData) => {
    try {
      const {
        title,
        description,
        category,
        price,
        discountPercentage = 0, // Default to 0
        rating = 0,
        stock = 0,
        brand = "",
        sku,
        weight = 0,
        width = 0,
        height = 0,
        depth = 0,
        tags,
        images,
      } = productData;

      if (!title || !description || !category || !price || !sku) {
        throw new Error(
          "Missing required fields: title, description, category, price, or SKU."
        );
      }

      const [result] = await db.query(
        `INSERT INTO products 
              (title, description, category, price, discountPercentage, rating, stock, brand, sku, weight, width, height, depth) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          category,
          price,
          discountPercentage,
          rating,
          stock,
          brand,
          sku,
          weight,
          width,
          height,
          depth,
        ]
      );

      const productId = result.insertId;

      if (tags && tags.length > 0) {
        const tagValues = tags.map((tag) => [productId, tag]);
        await db.query(`INSERT INTO product_tags (product_id, tag) VALUES ?`, [
          tagValues,
        ]);
      }

      if (images && images.length > 0) {
        const imageValues = images.map((image) => [productId, image]);
        await db.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ?`,
          [imageValues]
        );
      }

      return { id: productId, ...productData };
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  },

  updateProduct: async (id, productData) => {
    await db.query("UPDATE products SET ? WHERE id = ?", [productData, id]);
    return { id, ...productData };
  },

  deleteProduct: async (id) => {
    await db.query("DELETE FROM products WHERE id = ?", [id]);
  },
};

module.exports = ProductModel;
