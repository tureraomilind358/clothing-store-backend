const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "User_Image",
    format: async () => "png", // or jpg
    public_id: (req, file) => file.originalname.split('.')[0]
  }
});

const userImageUpload = multer({ storage });

module.exports = userImageUpload;
