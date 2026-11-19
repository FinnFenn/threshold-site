const { google } = require("googleapis");
const { sendEmail } = require("./lib/send");
const { launch } = require("./lib/emails");

function timestamp() {
  return new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }).replace(",", "");
}

exports.handler = async () => {
  if (process.env.LAUNCH_EMAIL_ENABLED !== "true") {
    console.log("launch-email: disabled");
    return { statusCode: 200, body: JSON.stringify({ skipped: true }) };
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Waitlist!A:D",
  });
  const rows = res.data.values || [];

  const MAX = parseInt(process.env.LAUNCH_BATCH_LIMIT, 10) || 90;
  const seen = new Set();
  let sent = 0;
  let remaining = 0;

  // First pass: count unique emails needing send
  const toSend = [];
  for (let i = 0; i < rows.length; i++) {
    const email = (rows[i][1] || "").trim();
    const launchSent = (rows[i][3] || "").trim();
    if (!email || seen.has(email.toLowerCase())) continue;
    seen.add(email.toLowerCase());
    if (!launchSent) toSend.push({ email, row: i + 1 });
  }

  for (const { email, row } of toSend) {
    if (sent >= MAX) break;

    try {
      await sendEmail({ to: email, ...launch });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Waitlist!D${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[timestamp()]] },
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send launch to ${email}:`, err);
    }
  }

  remaining = toSend.length - sent;

  console.log(`launch-email: sent ${sent}, remaining ${remaining}`);
  return { statusCode: 200, body: JSON.stringify({ sent, remaining }) };
};

exports.config = {
  schedule: "0 9 30 11 *",
};
