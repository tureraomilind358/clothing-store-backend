const express = require("express");
const authController = require("../controllers/authController");
const userImageUpload = require("../middlewares/userImageUpload");

const router = express.Router();

// User Routes
router.post("/auth/register", userImageUpload.single("image"),(req, res) => {
    res.json({ imageUrl: req.file.path }); // Cloudinary URL
  }, authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);

router.get("/", authController.getAllUsers);
router.get("/:id", authController.getUserById);
router.put("/:id", authController.updateUserById);
router.delete("/:id", authController.deleteUserById);

module.exports = router;
