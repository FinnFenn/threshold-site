const { google } = require("googleapis");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const headers = { "Content-Type": "application/json" };

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request" }) };
  }

  // Honeypot — silently accept
  if (data._hp) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // Validate email
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email" }) };
  }

  // Write to Google Sheets
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }).replace(",", "");

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Waitlist!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, email]],
      },
    });
  } catch (err) {
    console.error("Google Sheets error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to save" }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
