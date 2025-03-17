const db = require("../config/db");

const ProductModel = {
  // Get all products with images
   getAllProducts: async () => {
    const query = `
      SELECT 
        p.*, 
        COALESCE(GROUP_CONCAT(pi.image_url SEPARATOR ','), '') AS images 
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
    `;
  
    const [rows] = await db.query(query);
  
    return rows.map(product => ({
      ...product,
      images: product.images ? product.images.split(',').filter(img => img !== '') : [],
    }));
  },
  

  // Get product by ID with images and tags
  getProductById: async (id) => {
    const productQuery = "SELECT * FROM products WHERE id = ?";
    const imagesQuery = "SELECT image_url FROM product_images WHERE product_id = ?";
    const tagsQuery = "SELECT tag FROM product_tags WHERE product_id = ?";

    const [[product], [images], [tags]] = await Promise.all([
      db.query(productQuery, [id]),
      db.query(imagesQuery, [id]),
      db.query(tagsQuery, [id])
    ]);

    if (!product) return null;

    return {
      ...product,
      images: images.map(img => img.image_url),
      tags: tags.map(tag => tag.tag),
    };
  },

  // Create a new product with images and tags
  createProduct: async (productData) => {
    try {
      const {
        title, description, category, price, discountPercentage = 0,
        rating = 0, stock = 0, brand = "", sku, weight = 0,
        width = 0, height = 0, depth = 0, tags = [], images = []
      } = productData;

      if (!title || !description || !category || !price || !sku) {
        throw new Error("Missing required fields: title, description, category, price, or SKU.");
      }

      // Insert Product
      const [result] = await db.query(
        `INSERT INTO products 
          (title, description, category, price, discountPercentage, rating, stock, brand, sku, weight, width, height, depth) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, category, price, discountPercentage, rating, stock, brand, sku, weight, width, height, depth]
      );

      const productId = result.insertId;

      // Insert Tags
      if (tags.length > 0) {
        const tagValues = tags.map(tag => [productId, tag]);
        await db.query(`INSERT INTO product_tags (product_id, tag) VALUES ?`, [tagValues]);
      }

      // Insert Images
      if (images.length > 0) {
        const imageValues = images.map(image => [productId, image]);
        await db.query(`INSERT INTO product_images (product_id, image_url) VALUES ?`, [imageValues]);
      }

      return { id: productId, ...productData };
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  },

  // Update a product
  updateProduct: async (id, productData) => {
    await db.query("UPDATE products SET ? WHERE id = ?", [productData, id]);
    return { id, ...productData };
  },

  // Delete a product and its related images & tags
  deleteProduct: async (id) => {
    await db.query("DELETE FROM product_images WHERE product_id = ?", [id]);
    await db.query("DELETE FROM product_tags WHERE product_id = ?", [id]);
    await db.query("DELETE FROM products WHERE id = ?", [id]);
  },
};

module.exports = ProductModel;
