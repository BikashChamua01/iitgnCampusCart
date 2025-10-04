const express = require("express");
const app = express();
require("dotenv").config();
const connectDb = require("./db/connect");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Built in middlewares
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ✅ Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // ✅ Add OPTIONS (needed for preflight)
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
app.get("/", (req, res) => {
  return res.send("<h1>Server is running</h1>");
});

// import the routers
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const usersRouter = require("./routers/users-routes");
const wishlistRouter = require("./routers/wishlist-router");
const interestedBuyerRouter = require("./routers/interestedBuyers-routes");
const adminStatsRouter = require("./routers/adminStatsRoutes");
// Use the routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/interested", interestedBuyerRouter);
app.use("/api/v1/admin-stats", adminStatsRouter);

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

// Only start when run directly
//if (require.main === module) {
start();
//}
