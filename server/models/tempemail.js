const mongoose = require("mongoose");

const tempEmailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiry: { type: Date, required: true },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Tempmail", tempEmailSchema);
