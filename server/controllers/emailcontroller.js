const TEMPMAIL = require("../models/tempemail");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  // check if already verified
  const record = await TEMPMAIL.findOne({ email });
  if (record?.verified) {
    return res.status(200).json({
      success: true,
      msg: "Email already verified",
      alreadyVerified: true,
    });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("The set code : " + code);
  try {
    await TEMPMAIL.findOneAndUpdate(
      { email },
      {
        code,
        expiry: Date.now() + 10 * 60 * 1000,
        verified: false,
      },
      { upsert: true }
    );

    await transport.sendMail({
      to: email,
      subject: "Email verfication code for IITGN campus cart",
      html: `<p>Your verification code is <b>${code}</b>. It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ msg: "Verification code sent." });
  } catch (error) {
    console.log("error in verification " + error);
  }
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  console.log("The code user gave ", code);

  const record = await TEMPMAIL.findOne({ email });

  if (!record)
    return res.status(400).json({ success: false, msg: "Email not found." });

  if (record.verified)
    return res
      .status(200)
      .json({ success: false, msg: "Email already verified." });

  if (record.code !== code.toString()) {
    console.log("Mismatch:", record.code, code);
    return res.status(400).json({ success: false, msg: "Invalid code." });
  }

  if (Date.now() > record.expiry)
    return res.status(400).json({ success: false, msg: "Code expired." });

  record.verified = true;
  await record.save();

  res.status(200).json({ success: true, msg: "Email verified successfully." });
};

module.exports = { sendVerificationCode, verifyCode };
