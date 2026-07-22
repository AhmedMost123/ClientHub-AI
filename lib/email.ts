import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string,
) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your email",

    html: `
      <div style="font-family:Arial,sans-serif;padding:30px">
        <h2>Welcome to ClientHub AI</h2>

        <p>Hello ${name},</p>

        <p>Your verification code is:</p>

        <div
          style="
            font-size:34px;
            font-weight:bold;
            letter-spacing:10px;
            margin:25px 0;
          "
        >
          ${code}
        </div>

        <p>
          This code expires in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't create an account, simply ignore this email.
        </p>
      </div>
    `,
  });
}
