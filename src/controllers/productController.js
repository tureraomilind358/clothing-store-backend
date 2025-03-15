const ProductModel = require("../models/ProductModel");

const ProductController = {
    getAllProducts: async (req, res) => {
        try {
            console.log("✅ Incoming GET /api/products");
            const products = await ProductModel.getAllProducts();
            res.json(products);
        } catch (error) {
            console.error("❌ Error in getAllProducts:", error.message);
            res.status(500).json({ error: error.message });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductModel.getProductById(id);
            if (!product) return res.status(404).json({ message: "Product not found" });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addProduct: async (req, res) => {
        try {
            const { title, description, category, price, sku } = req.body;
            if (!title || !description || !category || !price || !sku) {
                return res.status(400).json({ error: "Missing required fields: title, description, category, price, or SKU." });
            }

            // Handle multiple image uploads
            const imagePaths = req.files.map(file => `/uploads/product/${file.filename}`);

            // Save product in the database using ProductModel
            const newProduct = await ProductModel.createProduct({
                title,
                description,
                category,
                price,
                sku,
                images: imagePaths
            });

            res.status(201).json({ message: "Product added successfully", product: newProduct });
        } catch (error) {
            console.error("❌ Error in addProduct:", error);
            res.status(500).json({ error: "Failed to add product" });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedProduct = await ProductModel.updateProduct(id, req.body);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            await ProductModel.deleteProduct(id);
            res.json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ProductController;
