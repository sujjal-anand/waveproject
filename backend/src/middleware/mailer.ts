import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "sujjalanand9877@gmail.com",
    pass: "xlzhrtbgoormojov",
  },
});
