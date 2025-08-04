const TEMPMAIL = require("../models/tempemail");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { StatusCodes } = require("http-status-codes");

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

const sendUserDeleteMessage = async (req, res) => {
  try {
    const { email, customMessage } = req.body;

    await transport.sendMail({
      to: email,
      subject: "❗ IITGN CampusCart Account Deleted",
      headers: {
        "X-Priority": "1", // High priority
        Importance: "high",
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; color: #333;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://iitgn.ac.in/assets/img/lectures/ifdls/iitgn_logo.png" alt="IITGN Logo" style="height: 60px; margin-bottom: 8px;">
          </div>

          <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #b30000; margin-top: 0;">Your IITGN CampusCart Account Has Been Deleted</h2>

            <p style="font-size: 16px; line-height: 1.6;">
              We would like to inform you that your account registered with <strong>${email}</strong> has been <strong>successfully deleted</strong> from <strong>IITGN CampusCart</strong>.
            </p>

            ${
              customMessage
                ? `<p style="font-size: 15px; color: #555; margin-top: 20px;"><em>${customMessage}</em></p>`
                : ""
            }

            <p style="font-size: 16px; line-height: 1.6;">
              If this was done in error or if you have any concerns, please reach out to our support team immediately.
            </p>

            <p style="margin-top: 24px; font-size: 16px;">
              Thank you,<br>
              <strong>IITGN CampusCart Team</strong>
              <strong>iitgncampuscart@gmail.com</strong>
            </p>
          </div>

          <div style="text-align: center; font-size: 13px; color: #999; margin-top: 20px;">
            © ${new Date().getFullYear()} IITGN CampusCart. All rights reserved.
          </div>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      msg: "User deletion email sent successfully.",
    });
  } catch (error) {
    console.log("Error in sendUserDeleteMessage", error);
    res.status(500).json({
      success: false,
      msg: "Unable to send user delete message",
    });
  }
};

const sendOrderConfirmation = async ({ buyer, seller, product }) => {
  const productImageUrl = product?.images?.[0]?.url || "";

  const mailOptions = {
    from: `"CampusCart" <${process.env.EMAIL_USER}>`,
    to: buyer.email,
    subject: `Order Confirmed for "${product.title}"`,
    html: `
  <div style="max-width:550px;margin:30px auto;background:#f9f9fb;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);font-family:'Segoe UI', sans-serif;padding:24px 32px;">
    <div style="text-align:center;margin-bottom:18px;">
      <img src="https://iitgn.ac.in/assets/img/lectures/ifdls/iitgn_logo.png" alt="IITGN Logo" style="height:60px;margin-bottom:8px;">
      <h2 style="color:#204ba6;margin:12px 0 6px 0;font-size:1.6em;letter-spacing:0.5px;">Campus Cart at IITGN</h2>
    </div>

    <hr style="border:none;border-top:1px solid #e1e4ed;margin:16px 0 24px 0;">

    <p style="font-size:1.07em;color:#2d2d4f;">Hi <strong>${
      buyer.userName
    }</strong>,</p>
    <p style="font-size:1em;color:#2d2d4f;margin:10px 0 24px 0;">
      Your request to buy the product <strong style="color:#204ba6;">"${
        product.title
      }"</strong> has been <span style="color:green;font-weight:bold;">accepted</span> by the seller.
    </p>

    <div style="display:flex;gap:16px;align-items:flex-start;background:#ffffff;border:1px solid #ddd;padding:16px;border-radius:8px;margin-bottom:24px;">
      <img src="${productImageUrl}" alt="Product Image" style="width:110px;height:auto;border-radius:6px;border:1px solid #ccc;">
      <div>
        <h3 style="margin:0 0 6px 0;color:#204ba6;">${product.title}</h3>
        <p style="margin:4px 0;font-size:0.95em;color:#333;"><strong>Price:</strong> ₹${
          product.price
        }</p>
        <p style="margin:4px 0;font-size:0.95em;color:#333;"><strong>Category:</strong> ${
          product.category
        }</p>
        <p style="margin:4px 0;font-size:0.95em;color:#333;"><strong>Condition:</strong> ${
          product.condition
        }</p>
      </div>
    </div>

    <div style="background:#e9f0ff;padding:16px;border-radius:8px;margin-bottom:20px;">
      <h3 style="margin-bottom:10px;color:#204ba6;">Seller Contact Info:</h3>
      <ul style="list-style:none;padding-left:0;font-size:0.95em;color:#333;">
        <li><strong>Name:</strong> ${seller.userName}</li>
        <li><strong>Email:</strong> <a href="mailto:${
          seller.email
        }" style="color:#1852a1;text-decoration:none;">${seller.email}</a></li>
        <li><strong>Phone:</strong> ${seller.phoneNumber || "Not provided"}</li>
      </ul>
    </div>

    <p style="font-size:0.95em;color:#444;">Please get in touch with the seller to proceed with the purchase.</p>
    <p style="font-size:0.95em;color:#888eaa;margin-top:36px;">Thank you for using <strong>Campus Cart</strong>!<br>
    <span style="font-size:0.9em">© ${new Date().getFullYear()} IIT Gandhinagar</span></p>
  </div>
  `,
  };

  await transport.sendMail(mailOptions);
};

//reject buy  request mail
const sendRejectBuyRequest = async ({ buyer, seller, product }) => {
  const productImageUrl = product?.images?.[0]?.url || "";

  const mailOptions = {
    from: `"CampusCart" <${process.env.EMAIL_USER}>`,
    to: buyer.email,
    subject: `Order Rejected for ${product.title}`,
    html: `
  <div style="max-width:550px;margin:30px auto;background:#f9f9fb;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);font-family:'Segoe UI', sans-serif;padding:24px 32px;">
    <div style="text-align:center;margin-bottom:18px; ">
      <img src="https://iitgn.ac.in/assets/img/lectures/ifdls/iitgn_logo.png" alt="IITGN Logo" style="height:60px;margin-bottom:8px;">
      <h2 style="color:#204ba6;margin:12px 0 6px 0;font-size:1.6em;letter-spacing:0.5px;">Campus Cart at IITGN</h2>
    </div>

    <hr style="border:none;border-top:1px solid #e1e4ed;margin:16px 0 24px 0;">

    <p style="font-size:1.07em;color:#2d2d4f;">Hi <strong>${
      buyer.userName
    }</strong>,</p>
    <p style="font-size:1em;color:#2d2d4f;margin:10px 0 24px 0;">
      Your request to buy the product <strong style="color:#204ba6;">"${
        product.title
      }"</strong> has been <span style="color:red;font-weight:bold;">Rejected</span> by the seller.
    </p>

    <div style="display:flex;gap:16px;align-items:flex-start;background:#ffffff;border:1px solid #ddd;padding:16px;border-radius:8px;margin-bottom:24px; ">
      <img src="${productImageUrl}" alt="Product Image" style="width:110px;height:auto;border-radius:6px;border:1px solid #ccc;">
      <div style="margin:18px;">
        <h3 style="margin:0 0 6px 0;color:#204ba6;">${product.title}</h3>
        <p style="margin:4px 0;font-size:0.95em;color:#333;"><strong>Price:</strong> ₹${
          product.price
        }</p>
        <p style="margin:4px 0;font-size:0.95em;color:#333;"><strong>Category:</strong> ${
          product.category
        }</p>
        <p style="margin:4px 0;font-size:0.95em;color:#333;"><strong>Condition:</strong> ${
          product.condition
        }</p>
      </div>
    </div>

    <div style="background:#e9f0ff;padding:16px;border-radius:8px;margin-bottom:20px;">
      <h3 style="margin-bottom:10px;color:#204ba6;">Seller Contact Info:</h3>
      <ul style="list-style:none;padding-left:0;font-size:0.95em;color:#333;">
        <li><strong>Name:</strong> ${seller.userName}</li>
        <li><strong>Email:</strong> <a href="mailto:${
          seller.email
        }" style="color:#1852a1;text-decoration:none;">${seller.email}</a></li>
        <li><strong>Phone:</strong> ${seller.phoneNumber || "Not provided"}</li>
      </ul>
    </div>

    <p style="font-size:0.95em;color:#444;">Sorry for any inconvenience.</p>
    <p style="font-size:0.95em;color:#888eaa;margin-top:36px;">Thank you for using <strong>Campus Cart</strong>!<br>
    <span style="font-size:0.9em">© ${new Date().getFullYear()} IIT Gandhinagar</span></p>
  </div>
  `,
  };

  await transport.sendMail(mailOptions);
};

module.exports = {
  sendVerificationCode,
  verifyCode,
  sendUserDeleteMessage,
  sendOrderConfirmation,
  sendRejectBuyRequest,
};
