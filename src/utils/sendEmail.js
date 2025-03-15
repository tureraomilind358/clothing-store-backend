const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tureraomilind358@gmail.com",
        pass: "xzbj msby bwcj xpis",
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: "tureraomilind358@gmail.com",
            to,
            subject,
            text
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
