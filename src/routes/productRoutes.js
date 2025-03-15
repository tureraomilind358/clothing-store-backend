const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const productImageUpload = require("../middlewares/productImageUpload"); // Import the correct upload middleware

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", productImageUpload.array("images", 5), ProductController.addProduct); // Multiple images
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
