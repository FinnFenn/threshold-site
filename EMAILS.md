# Waiting-list emails

## Env vars

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | API key from resend.com |
| `EMAIL_TEST_TO` | No | If set, every email goes to this address instead of the real recipient. Subject is prefixed with `[TEST to <real email>]`. |
| `LAUNCH_EMAIL_ENABLED` | No | Set to `"true"` to enable the launch email scheduled function. Off by default. |
| `LAUNCH_BATCH_LIMIT` | No | Max emails per launch-email run. Default 90. |

## Changing the wording

Edit `netlify/functions/lib/emails.js`. Both emails (thank-you and launch) are defined there — subject, plain text, and HTML.

## How it works

1. **join-waitlist.js** — deduplicates by email (column B), appends to the Waitlist sheet, sends the thank-you email, and writes the send time to column C.
2. **thanks-catchup.js** — runs hourly. Picks up any rows where column C is blank (email failed or was added manually) and sends the thank-you. Max 90 per run.
3. **launch-email.js** — scheduled for 09:00 UTC 30 November. Only runs when `LAUNCH_EMAIL_ENABLED=true`. Sends the launch email to every unique address with column D blank, then fills D. Batched by `LAUNCH_BATCH_LIMIT`.

## Sheet columns

| A | B | C | D |
|---|---|---|---|
| Joined timestamp | Email | Thank-you sent timestamp | Launch email sent timestamp |
