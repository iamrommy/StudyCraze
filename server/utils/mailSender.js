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

    // 2. Send the mail using async/await
    const mailOptions = {
      from: `"StudyCraze" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    };

    // This returns a Promise that we await
    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Mail sent successfully:", info.response);
    return info;

  } catch (error) {
    // Log the error message for debugging purposes on Render logs
    console.error("❌ Mail send error details:", error); 
    console.error("❌ Mail send error message:", error.message);
    throw error;
  }
};

module.exports = mailSender;
