// server.js (local dev)
require("dotenv").config();
const connectDb = require("./db/connect");
const app = require("./app");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => console.log("App running on port " + PORT));
  } catch (err) {
    console.error(err);
  }
}

// Only start when run directly
if (require.main === module) {
  start();
}
