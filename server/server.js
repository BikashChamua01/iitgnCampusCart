const express = require("express");
const app = express();
require("dotenv").config();
const connectDb = require("./db/connect");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;

// Built in middlewares
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Add OPTIONS (needed for preflight)
    credentials: true, // ✅ Required for cookies to be sent
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

// import the routers
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
// Use the routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);

// Connection to the database and start the server
async function start() {
  try {
    // First connect to the db
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, console.log("App is running in " + PORT));
  } catch (err) {
    console.log(err);
  }
}

start();
