import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error:any, success:any) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP connection success:", success);
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
console.log("HTML RECEIVED BY SENDMAIL:", html);


  if (!to) {
    throw new Error("Email recipient is required");
  }

  try {
    const info = await transporter.sendMail({
      from: `<${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent: %s", info);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};
