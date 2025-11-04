const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Wrap in Promise to ensure await finishes before function returns
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(
        {
          from: `"StudyCraze" <${process.env.MAIL_USER}>`,
          to: email,
          subject: title,
          html: body,
        },
        (error, info) => {
          if (error) return reject(error);
          resolve(info);
        }
      );
    });

    console.log("✅ Mail sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Mail send error:", error.message);
    throw error;
  }
};

module.exports = mailSender;
