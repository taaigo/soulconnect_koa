import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
let etherealAccount: { user: string; pass: string } | null = null;

async function createTransporter() {
  if (transporter) return transporter;

  // If SMTP env vars are provided, try to use them first
  const host = process.env.SMTP_HOST || process.env.OUTLOOK_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : (process.env.OUTLOOK_HOST ? 587 : undefined);
  const user = process.env.SMTP_USER || process.env.OUTLOOK_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.OUTLOOK_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: port || 587,
      secure: !!(process.env.SMTP_SECURE && process.env.SMTP_SECURE !== "false"),
      auth: { user, pass },
    });

    // verify transporter connection, but don't throw — fallback will be handled by send* wrappers
    try {
      await transporter.verify();
      console.log("Mailer: using SMTP", host);
      return transporter;
    } catch (err: any) {
      console.warn("Mailer: SMTP verify failed, falling back to Ethereal", (err && err.message) ? err.message : String(err));
      transporter = null;
    }
  }

  // Fallback: create Ethereal test account (development)
  const testAccount = await nodemailer.createTestAccount();
  etherealAccount = { user: testAccount.user, pass: testAccount.pass };
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("Mailer: using Ethereal account for dev. Preview emails at nodemailer.getTestMessageUrl(info)");
  console.log(`Ethereal user: ${testAccount.user}`);
  return transporter;
}

export async function sendWelcomeEmail(to: string, name: string) {
  const t = await createTransporter();
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || etherealAccount?.user || 'no-reply@example.com';

  const info = await t.sendMail({
    from,
    to,
    subject: "Bevestig je account",
    html: `
      <h2>Hallo ${name},</h2>
      <p>Bedankt voor het registreren!<br>
      Klik op de link in deze mail om je account te verifiëren.</p>
    `,
  });

  console.log("📨 Email sendInfo:", info.messageId);
  // If using Ethereal, print preview URL
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log("📬 Preview URL:", preview);
  return info;
}

export default { sendWelcomeEmail };
