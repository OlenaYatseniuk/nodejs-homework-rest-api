import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();
const { HOST, PORT, SENDGRID_API_KEY, SENDGRID_SENDLER_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: SENDGRID_SENDLER_EMAIL,
    subject: "This is your email verification",
    text: "Please, confirm your email address ",
    html: `<strong>Please, <a href="http://${HOST}:${PORT}/api/users/verify/${verificationToken}"> confirm </a> your email address</strong>`,
  };

  await sgMail.send(msg);
  return true;
};
