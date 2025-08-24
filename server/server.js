// server.js
const app = require("./app");
const connectDb = require("./db/connect");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}

start();
