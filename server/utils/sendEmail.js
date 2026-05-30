import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: email,

      subject: "NeighborHAND OTP Verification",

      html: `
        <h2>Your OTP Code</h2>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP Email Sent");

  } catch (error) {

    console.log(error);

  }

};

export default sendEmail;