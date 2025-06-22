import multer from "multer";

const storage = multer.memoryStorage(); // keep file in memory for streaming
const upload = multer({ storage });

export default upload;
