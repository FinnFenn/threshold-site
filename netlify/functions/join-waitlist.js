const { google } = require("googleapis");
const { sendEmail } = require("./lib/send");
const { thankYou } = require("./lib/emails");

function getSheets() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function timestamp() {
  return new Date().toLocaleString("en-GB", { timeZone: "Europe/London" }).replace(",", "");
}

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

  if (data._hp) {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email" }) };
  }

  try {
    const sheets = getSheets();
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // Check for duplicate
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Waitlist!B:B",
    });
    const rows = existing.data.values || [];
    const isDupe = rows.some((r) => r[0] && r[0].toLowerCase() === email.toLowerCase());
    if (isDupe) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    // Append row
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Waitlist!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp(), email, ""]],
      },
    });

    // Send thank-you email, fill column C on success
    try {
      await sendEmail({ to: email, ...thankYou });

      // Find the row we just wrote (last row with this email)
      const updated = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "Waitlist!B:B",
      });
      const allRows = updated.data.values || [];
      let rowIndex = -1;
      for (let i = allRows.length - 1; i >= 0; i--) {
        if (allRows[i][0] && allRows[i][0].toLowerCase() === email.toLowerCase()) {
          rowIndex = i + 1; // 1-based
          break;
        }
      }
      if (rowIndex > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `Waitlist!C${rowIndex}`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: [[timestamp()]] },
        });
      }
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // Still return ok — catchup job will retry
    }
  } catch (err) {
    console.error("Google Sheets error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to save" }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
