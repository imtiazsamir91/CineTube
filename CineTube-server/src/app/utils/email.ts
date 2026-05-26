/* eslint-disable @typescript-eslint/no-explicit-any */

import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

// ==========================
// SMTP CONFIG
// ==========================
const port = Number(envVars.EMAIL_SENDER.SMTP_PORT);

if (!port) {
  throw new Error("SMTP_PORT is not defined in env");
}

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

// ==========================
// VERIFY SMTP CONNECTION
// ==========================
transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP CONNECTION ERROR =>", error);
  } else {
    console.log("✅ SMTP READY");
  }
});

// ==========================
// TYPES
// ==========================
interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

// ==========================
// SEND EMAIL FUNCTION
// ==========================
export const sendEmail = async ({
  subject,
  templateData = {},
  templateName,
  to,
  attachments,
}: SendEmailOptions) => {
  try {
    console.log("=== EMAIL DEBUG ===", {
      to,
      subject,
      templateName,
      templateData,
      attachments,
    });

    // ==========================
    // VALIDATION
    // ==========================
    if (!to) throw new Error("Email 'to' is required");
    if (!subject) throw new Error("Email 'subject' is required");
    if (!templateName) throw new Error("Email 'templateName' is required");

    // ==========================
    // TEMPLATE PATH
    // ==========================
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );

    // check file exists
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${templateName}`);
    }

    console.log("📄 TEMPLATE PATH =>", templatePath);

    // ==========================
    // RENDER HTML
    // ==========================
    const html = await ejs.renderFile(templatePath, templateData);

    if (!html) {
      throw new Error("Failed to render email template");
    }

    // ==========================
    // MAIL PAYLOAD
    // ==========================
    const mailPayload: nodemailer.SendMailOptions = {
      from: `"CineTube Support" <${
        envVars.EMAIL_SENDER.SMTP_FROM ||
        envVars.EMAIL_SENDER.SMTP_USER
      }>`,
      to,
      subject,
      html,
    };

    // ==========================
    // ATTACHMENTS SAFE HANDLING
    // ==========================
    if (Array.isArray(attachments) && attachments.length > 0) {
      mailPayload.attachments = attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      }));
    }

    // ==========================
    // SEND EMAIL
    // ==========================
    const info = await transporter.sendMail(mailPayload);

    console.log(`✅ Email sent successfully to ${to}`);
    console.log("📨 Message ID =>", info.messageId);

    return info;
  } catch (error: any) {
    console.log("❌ Email Sending Error =>", error);

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error.message || "Failed to send email"
    );
  }
};