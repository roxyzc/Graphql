import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const closeTcpConnection = (): void => {
  transporter().close();
};

const mailOptions = async (from: string, to: string, subject: string, content: string) => {
  return await Promise.resolve({
    from: `"${from}"<${process.env.USER as string}>`,
    to,
    subject,
    html: `
        ${content}
    `,
  });
};

const sendEmail = async (content: { from: string; to: string; subject: string; html: string }): Promise<boolean> => {
  try {
    await transporter().sendMail(content);
    return await Promise.resolve(true);
  } catch (error: any) {
    console.log(error.message);
    return await Promise.resolve(false);
  }
};

export { sendEmail, mailOptions, closeTcpConnection };
