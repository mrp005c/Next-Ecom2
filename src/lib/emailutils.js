import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail({ to, name, subject }) {
  return await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject: "We received your message ✅",
    html: `
      <div style="font-family: sans-serif">
        <h2>Hello ${name},</h2>
        <p>Thank you for contacting us.</p>
        <p>We have successfully received your message with subject "${subject}" and will reply shortly.</p>
        <br />
        <p>Best regards,<br />Support Team</p>
      </div>
    `,
  });
}
