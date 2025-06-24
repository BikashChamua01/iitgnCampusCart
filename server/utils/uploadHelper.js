const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");

// Upload image buffer to Cloudinary via a proper stream pipe
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "iitgn-products" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );
    // Pipe the buffer into the upload stream
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = uploadToCloudinary;
