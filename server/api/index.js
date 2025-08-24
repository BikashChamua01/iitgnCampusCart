// api/index.js
const serverless = require("serverless-http");
const app = require("../app");
const connectDb = require("../db/connect");

let connectionPromise = null;

const handler = serverless(app);

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDb(process.env.MONGO_URI).catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }
  await connectionPromise;
  return handler(req, res);
};
