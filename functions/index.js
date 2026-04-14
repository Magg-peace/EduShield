require("dotenv").config();
const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require('cors')({ origin: true }); // Crucial for calling from React UI

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔥 Function to send alert (Renamed to bypass Gen1/Gen2 state errors)
exports.dispatchAlert = functions.https.onRequest((req, res) => {
  // Use CORS to prevent browser blocks
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { name, risk, attendance, marks, engagement } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself/admin
      subject: "🚨 [EduShield X] High Risk Student Alert",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border-top: 5px solid #EF4444; background: #fdf2f2;">
          <h2 style="color: #EF4444; margin-top: 0;">Urgent: Student at High Risk</h2>
          <p>The Behavioral Intelligence Engine has flagged <b>${name}</b> for immediate intervention.</p>
          <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
            <h3 style="margin-top:0;">Risk Score: ${risk.toFixed(1)}</h3>
            <ul style="color: #4b5563;">
              <li>Attendance: ${attendance}%</li>
              <li>Marks: ${marks}%</li>
              <li>Engagement: ${engagement}%</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Automated alert from EduShield X</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ success: true, message: "Email sent!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, error: error.toString() });
    }
  });
});
