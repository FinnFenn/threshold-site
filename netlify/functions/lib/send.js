const { Resend } = require("resend");
const { FROM, REPLY_TO } = require("./emails");

let client;
function getClient() {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

async function sendEmail({ to, subject, text, html }) {
  const testTo = process.env.EMAIL_TEST_TO;
  const actualTo = testTo || to;
  const actualSubject = testTo ? `[TEST to ${to}] ${subject}` : subject;

  const { error } = await getClient().emails.send({
    from: FROM,
    reply_to: REPLY_TO,
    to: actualTo,
    subject: actualSubject,
    text,
    html,
  });

  if (error) throw new Error(error.message);
}

module.exports = { sendEmail };
