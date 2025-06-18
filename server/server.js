const express = require("express");
const app = express();
require("dotenv").config();
const connectDb = require("./db/connect");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// Built in middlewares
app.use(express.json());
app.use(cors());

// import the routers
const authRouter = require("./routers/auth");

// Use the routers
app.use("/api/v1/auth", authRouter);

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
