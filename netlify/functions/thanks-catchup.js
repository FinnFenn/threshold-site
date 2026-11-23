const { google } = require("googleapis");
const { sendEmail } = require("./lib/send");
const { thankYou } = require("./lib/emails");

function timestamp() {
  return new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }).replace(",", "");
}

exports.handler = async () => {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "Waitlist!A:C",
  });
  const rows = res.data.values || [];

  const seen = new Set();
  let sent = 0;
  const MAX = 90;

  for (let i = 0; i < rows.length; i++) {
    if (sent >= MAX) break;

    const email = (rows[i][1] || "").trim();
    const emailSent = (rows[i][2] || "").trim();

    if (!email || emailSent || seen.has(email.toLowerCase())) continue;
    seen.add(email.toLowerCase());

    try {
      await sendEmail({ to: email, ...thankYou });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Waitlist!C${i + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[timestamp()]] },
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send to ${email}:`, err);
    }
  }

  console.log(`thanks-catchup: sent ${sent}`);
  return { statusCode: 200, body: JSON.stringify({ sent }) };
};
