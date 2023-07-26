const nodemailer = require('nodemailer');

const sendEmail = async options => {
    try{
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
    // service: 'Gmail', // If we want to use google yahoo etc..
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, 
        secureConnection: false,
        logger: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls:{
            rejectUnAuthorized:true
        }
        // Activate in gmail "less secure app" option
    });  
    // 2. Define the email options
    const mailOptions = {
        from: 'Shishir Rijal <hello@natours.com>',   
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    // 3. Actually send the email with nodemailer
    await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = sendEmail;