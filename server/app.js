// app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routers
const authRouter = require("./routers/auth");
const productRouter = require("./routers/product");
const usersRouter = require("./routers/users-routes");
const wishlistRouter = require("./routers/wishlist-router");
const interestedBuyerRouter = require("./routers/interestedBuyers-routes");
const adminStatsRouter = require("./routers/adminStatsRoutes");

const app = express();

// Built in middlewares
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // set in Vercel env
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
  })
);

app.get("/", (req, res) => res.send("<h1>Server is running</h1>"));

// Use the routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/interested", interestedBuyerRouter);
app.use("api/v1/admin-stats", adminStatsRouter)

module.exports = app;
