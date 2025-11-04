const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  console.log("Sending email to:", email);
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

    const info = await transporter.sendMail({
      from: "StudyCraze <studycrazeinfo@gmail.com>",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent:", info.response);
    return info;
  } catch (error) {
    console.error("Mail error:", error.message);
  }
};

module.exports = mailSender;
