exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const headers = { "Content-Type": "application/json" };

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify({ success: false }) };
  }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return { statusCode: 200, headers, body: JSON.stringify({ success: false }) };
  }

  const passwords = (process.env.ARCHIVE_PASSWORDS || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (passwords.includes(password.trim())) {
    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Set-Cookie": "threshold_archive=1; Path=/; Max-Age=31536000; SameSite=Lax",
      },
      body: JSON.stringify({ success: true }),
    };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ success: false }) };
};
