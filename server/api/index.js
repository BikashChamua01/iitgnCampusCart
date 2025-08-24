// api/index.js
const serverless = require("serverless-http");
const app = require("../app");
const connectDb = require("../db/connect");

let connectionPromise = null;

// Wrap the express app with serverless-http
const handler = serverless(app);

module.exports = async (req, res) => {
  // Cache the DB connection promise across invocations to avoid reconnect storms
  if (!connectionPromise) {
    connectionPromise = connectDb(process.env.MONGO_URI).catch((err) => {
      // reset so next invocation can retry
      connectionPromise = null;
      throw err;
    });
  }
  await connectionPromise;
  // delegate to serverless handler
  return handler(req, res);
};