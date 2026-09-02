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
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  // Validate required fields
  const required = ["name", "email", "intent"];
  for (const field of required) {
    if (!data[field]) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }
  }

  if (typeof data.intent !== "string" || data.intent.trim().length < 150) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Response too short (150 characters minimum)" }) };
  }

  // Write to Google Sheets
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          data.name,
          data.email,
          data.intent,
        ]],
      },
    });
  } catch (err) {
    console.error("Google Sheets error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to save" }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
};
