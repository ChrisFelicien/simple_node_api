import nodemailer from 'nodemailer';

const sendEmail = (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.PASSWORD_MAIL,
    },
  });

  const mailOptions = {};
};
