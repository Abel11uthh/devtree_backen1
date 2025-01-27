import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DevTree" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperación de contraseña",
    text: `Tu código es: ${token}`,
    html: `<p>Tu código es: <strong>${token}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};
