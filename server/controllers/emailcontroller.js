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
    // Send the mail
    await transport.sendMail({
      to: email,
      subject: "Email verification code for IITGN Campus Cart",
      html: `
  <div style="max-width:450px;margin:30px auto;background:#f9f9fb;border-radius:10px;box-shadow:0 2px 8px #e0e0e8;font-family:sans-serif;padding:24px 32px;">
    <div style="text-align:center;margin-bottom:18px;">
      <img src="https://iitgn.ac.in/assets/img/lectures/ifdls/iitgn_logo.png" alt="IITGN Logo" style="height:60px;margin-bottom:8px;">
      <h2 style="color:#204ba6;margin:12px 0 6px 0;font-size:1.6em;letter-spacing:1px;">Campus Cart at IITGN</h2>
    </div>
    <hr style="border:none;border-top:1px solid #e1e4ed;margin-bottom:24px;">
    <p style="font-size:1.07em;color:#2d2d4f;">
      Hello,
      <br/>
      Your email verification code for <b>Campus Cart</b> is:
    </p>
    <div style="text-align:center;margin:28px 0;">
      <span style="padding:13px 38px;border-radius:8px;font-size:2em;color:#fff;background:linear-gradient(90deg,#204ba6 70%,#1852a1 100%);font-weight:bold;letter-spacing:3px;display:inline-block;">${code}</span>
    </div>
    <p style="font-size:1em;color:#454575;">
      This code is valid for <b>10 minutes</b>.
    </p>
    <p style="font-size:0.95em;color:#888eaa;margin-top:36px;">
      Need help? Contact the <b>IITGN Campus Cart</b> team.<br>
      <span style="font-size:0.9em">© ${new Date().getFullYear()} IIT Gandhinagar</span>
    </p>
  </div>
  `,
    });
    // mail sending done

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
