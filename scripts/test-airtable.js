import fs from "fs";
import path from "path";

// Read .env manually
let token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
let baseId = process.env.AIRTABLE_BASE_ID;
let leadsTable = process.env.AIRTABLE_TABLE_NAME || "Leads";
let behaviorTable = process.env.AIRTABLE_BEHAVIOR_TABLE_NAME || "User Behavior";

if (!token || !baseId) {
  try {
    const envContent = fs.readFileSync(".env", "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...vals] = trimmed.split("=");
      const val = vals.join("=").replace(/^["']|["']$/g, "").trim();
      if (key === "AIRTABLE_PERSONAL_ACCESS_TOKEN") token = val;
      if (key === "AIRTABLE_BASE_ID") baseId = val;
      if (key === "AIRTABLE_TABLE_NAME") leadsTable = val;
      if (key === "AIRTABLE_BEHAVIOR_TABLE_NAME") behaviorTable = val;
    }
  } catch (e) {
    console.error("Could not read .env:", e.message);
  }
}

console.log("=== Airtable Connection Diagnostic ===");
console.log(`Token: ${token ? token.slice(0, 10) + "..." : "MISSING"}`);
console.log(`Base ID: ${baseId || "MISSING"}`);
console.log(`Leads Table: ${leadsTable}`);
console.log(`User Behavior Table: ${behaviorTable}\n`);

if (!token) {
  console.error("❌ Error: AIRTABLE_PERSONAL_ACCESS_TOKEN is missing in .env");
  process.exit(1);
}

if (!baseId) {
  console.error("❌ Error: AIRTABLE_BASE_ID is missing in .env");
  process.exit(1);
}

if (baseId.startsWith("pat")) {
  console.error(
    "⚠️ Warning: Your AIRTABLE_BASE_ID starts with 'pat' (which is a Personal Access Token).\n" +
    "Airtable Base IDs always start with 'app' (e.g. appXXXXXXXXXXXXXX).\n" +
    "To find your Base ID:\n" +
    "1. Open your base in airtable.com\n" +
    "2. Check the browser URL: https://airtable.com/appXXXXXXXXXXXXXX/...\n" +
    "3. Copy the 'appXXXXXXXXXXXXXX' part and paste it into AIRTABLE_BASE_ID in .env"
  );
  process.exit(1);
}

async function testAirtable() {
  console.log("1. Testing Lead table insertion...");
  try {
    const leadRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(leadsTable)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: "Diagnostic Test Lead",
          Email: "diagnostic@profitpatterns.io",
          Phone: "+1234567890",
          Company: "Diagnostic Corp",
          "Lead Type": "Quick Form",
          Requirement: "Testing Airtable integration and Omni AI",
          Message: "Automated diagnostic verification.",
          Status: "New",
        },
        typecast: true,
      }),
    });

    const leadData = await leadRes.json();
    if (!leadRes.ok) {
      console.error(`❌ Lead table error (${leadRes.status}):`, leadData);
    } else {
      console.log(`✅ Success! Lead record created in '${leadsTable}' with ID: ${leadData.id}`);
    }
  } catch (err) {
    console.error("❌ Failed to reach Airtable for Leads:", err.message);
  }

  console.log("\n2. Testing User Behavior table insertion...");
  try {
    const behRes = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(behaviorTable)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Event Name": "page_view",
          "Category": "diagnostic",
          "Page URL": "https://profit-patterns-xi.vercel.app/diagnostic",
          "Visitor ID": "diag_vis_001",
          "Session ID": "diag_ses_001",
          "Device": "Desktop",
          "Browser": "Chrome",
          "Timestamp": new Date().toISOString(),
        },
        typecast: true,
      }),
    });

    const behData = await behRes.json();
    if (!behRes.ok) {
      console.error(`❌ User Behavior table error (${behRes.status}):`, behData);
    } else {
      console.log(`✅ Success! Event record created in '${behaviorTable}' with ID: ${behData.id}`);
    }
  } catch (err) {
    console.error("❌ Failed to reach Airtable for User Behavior:", err.message);
  }
}

testAirtable();
