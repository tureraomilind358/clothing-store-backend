const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "clothing-store",
    format: async (req, file) => "png", // or jpg
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`, // Unique name
  },
});


const productImageUpload = multer({ storage });
// Correctly export multer
module.exports = productImageUpload;
