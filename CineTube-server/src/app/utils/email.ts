import nodemailer from "nodemailer";
// 🎯 ফিক্স ১: আপনার ফাইল থেকে নিখুঁতভাবে envVars অবজেক্টটি ইমপোর্ট করা হলো
import { envVars } from "../config/env"; 

// 🎯 ফিক্স ২: envVars.EMAIL_SENDER থেকে সব ভ্যালু প্রফেশনালি রিড করা হলো
const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER?.SMTP_HOST || "smtp.gmail.com", 
  port: Number(envVars.EMAIL_SENDER?.SMTP_PORT) || 587,
  secure: envVars.NODE_ENV === "production", // প্রোডাকশনে ট্রু, লোকালি ফলস
  auth: {
    user: envVars.EMAIL_SENDER?.SMTP_USER, // আপনার .env এর EMAIL_SENDER_SMTP_USER
    pass: envVars.EMAIL_SENDER?.SMTP_PASS, // আপনার .env এর EMAIL_SENDER_SMTP_PASS
  },
});

interface TEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: TEmailOptions) => {
  try {
    const mailOptions = {
      from: `"CineTube Support" <${envVars.EMAIL_SENDER?.SMTP_FROM || envVars.EMAIL_SENDER?.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("=== [Email Sent Successfully] ===", info.messageId);
    return info;
  } catch (error) {
    console.error("Email Sending Error inside utility:", error);
    throw new Error("Failed to send email");
  }
};