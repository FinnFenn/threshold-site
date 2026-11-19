const FROM = "Threshold <info@thresholdresidency.org>";
const REPLY_TO = "info@thresholdresidency.org";
const FOOTER = "You joined the waiting list at thresholdresidency.co.uk. Reply to be removed.";

function wrap(body, footer) {
  return `<!doctype html><html><body style="margin:0;padding:24px;font-family:Georgia,serif;font-size:16px;line-height:1.7;color:#080808;background:#ffffff;">${body}<p style="margin-top:40px;font-size:12px;color:#888;">${footer}</p></body></html>`;
}

const thankYou = {
  subject: "Expedition I",
  text: [
    "You're on the waiting list for Expedition I.",
    "",
    "Applications open on 30 November. We'll write that day.",
    "",
    "Threshold",
    "",
    FOOTER,
  ].join("\n"),
  html: wrap(
    `<p>You're on the waiting list for Expedition I.</p>
<p>Applications open on 30 November. We'll write that day.</p>
<p>Threshold</p>`,
    FOOTER
  ),
};

const launch = {
  subject: "Expedition I. Applications are open.",
  text: [
    "Applications for Expedition I are open.",
    "",
    "Fifteen people. One month, 29 December to 29 January. No fees, no equity.",
    "",
    "Read Expedition I, then take the first step: https://thresholdresidency.co.uk/expedition",
    "",
    "Threshold",
    "",
    FOOTER,
  ].join("\n"),
  html: wrap(
    `<p>Applications for Expedition I are open.</p>
<p>Fifteen people. One month, 29 December to 29 January. No fees, no equity.</p>
<p>Read Expedition I, then take the first step:<br><a href="https://thresholdresidency.co.uk/expedition" style="color:#080808;">https://thresholdresidency.co.uk/expedition</a></p>
<p>Threshold</p>`,
    FOOTER
  ),
};

module.exports = { FROM, REPLY_TO, thankYou, launch };
