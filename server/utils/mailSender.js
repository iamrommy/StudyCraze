const nodemailer = require("nodemailer");

const mailSender = async (email, title, body)=>{
    // console.log(email, title, body);
    console.log(process.env.MAIL_USER, process.env.MAIL_PASS ? 'Password Loaded' : 'No Password');
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
        
        let info = await transporter.sendMail({
            from: "StudyCraze - by Rommy",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info);
        return info;
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = mailSender;