// api/analytics/collect.js
// Vercel Serverless Function Proxy for Google Sheets Analytics

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed. Only POST is accepted." });
  }

  try {
    const appsScriptUrl = process.env.VITE_ANALYTICS_URL || process.env.APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      console.error("Missing VITE_ANALYTICS_URL or APPS_SCRIPT_URL in environment.");
      return res.status(500).json({ ok: false, error: "Analytics endpoint not configured." });
    }

    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ ok: false, error: "Invalid JSON body." });
      }
    }

    if (!payload || !payload.event_name) {
      return res.status(400).json({ ok: false, error: "Missing event_name in payload." });
    }

    // Forward the event from Vercel to Google Apps Script
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    return res.status(200).json({
      ok: true,
      message: "Event recorded successfully",
      upstream: responseText,
    });
  } catch (error) {
    console.error("Proxy error forwarding to Apps Script:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
