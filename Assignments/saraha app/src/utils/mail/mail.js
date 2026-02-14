import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})


export async function sendOTP(to, otp) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log("Email : ", info.response);
        return true
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}

