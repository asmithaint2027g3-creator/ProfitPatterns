// scripts/setup-airtable-tables.js
// Creates all 5 new Airtable tables for ProfitPatterns CRM

import fs from "fs";

let token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
let baseId = process.env.AIRTABLE_BASE_ID;

if (!token || !baseId) {
  try {
    const envContent = fs.readFileSync(".env", "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key === "AIRTABLE_PERSONAL_ACCESS_TOKEN") token = val;
      if (key === "AIRTABLE_BASE_ID") baseId = val;
    }
  } catch {}
}

console.log(`Token: ${token ? token.slice(0, 12) + "..." : "MISSING"}`);
console.log(`Base:  ${baseId || "MISSING"}\n`);

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function createTable(tableDef) {
  const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(tableDef),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(`❌  Failed to create "${tableDef.name}": ${res.status}`, JSON.stringify(data));
    return null;
  }
  console.log(`✅  Created table: "${tableDef.name}" (id: ${data.id})`);
  return data;
}

async function getExistingTables() {
  const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;
  const res = await fetch(url, { headers });
  const data = await res.json();
  if (!res.ok) {
    console.error("❌  Could not fetch tables:", data);
    return [];
  }
  return data.tables || [];
}

const tablesToCreate = [
  {
    name: "Page Views",
    description: "Every page load across all 30 pages of the ProfitPatterns app.",
    fields: [
      { name: "Page URL",       type: "url" },
      { name: "Page Title",     type: "singleLineText" },
      { name: "Page Path",      type: "singleLineText" },
      {
        name: "Page Type", type: "singleSelect",
        options: { choices: [
          { name: "Home" }, { name: "Service" }, { name: "Solution" },
          { name: "Case Study" }, { name: "Insight" }, { name: "Resource" },
          { name: "Industry" }, { name: "Contact" }, { name: "About" },
          { name: "FAQ" }, { name: "How It Works" }, { name: "Audit" },
          { name: "Who We Serve" }, { name: "Privacy" }, { name: "Terms" },
        ]}
      },
      { name: "Visitor ID",     type: "singleLineText" },
      { name: "Session ID",     type: "singleLineText" },
      { name: "Is Returning",   type: "checkbox",        options: { icon: "check", color: "greenBright" } },
      {
        name: "Device", type: "singleSelect",
        options: { choices: [{ name: "Desktop" }, { name: "Mobile" }, { name: "Tablet" }] }
      },
      { name: "Browser",        type: "singleLineText" },
      { name: "OS",             type: "singleLineText" },
      { name: "Screen Size",    type: "singleLineText" },
      { name: "Traffic Source", type: "singleLineText" },
      { name: "UTM Source",     type: "singleLineText" },
      { name: "UTM Medium",     type: "singleLineText" },
      { name: "UTM Campaign",   type: "singleLineText" },
      { name: "Timezone",       type: "singleLineText" },
      { name: "Timestamp",      type: "dateTime",        options: { dateFormat: { name: "iso" }, timeFormat: { name: "24hour" }, timeZone: "utc" } },
    ]
  },
  {
    name: "Clicks & Interactions",
    description: "Every button, CTA, link, and WhatsApp click across the site.",
    fields: [
      { name: "Event Name",     type: "singleLineText" },
      { name: "Element Text",   type: "singleLineText" },
      { name: "Section",        type: "singleLineText" },
      { name: "Element Type",   type: "singleLineText" },
      { name: "Page URL",       type: "url" },
      { name: "Page Path",      type: "singleLineText" },
      { name: "Click X",        type: "number",          options: { precision: 0 } },
      { name: "Click Y",        type: "number",          options: { precision: 0 } },
      {
        name: "Hand Zone", type: "singleSelect",
        options: { choices: [
          { name: "Left-Hand Zone" }, { name: "Right-Hand Zone" },
          { name: "Center / Dual Zone" }, { name: "Desktop Pointer" }
        ]}
      },
      { name: "Visitor ID",     type: "singleLineText" },
      { name: "Session ID",     type: "singleLineText" },
      {
        name: "Device", type: "singleSelect",
        options: { choices: [{ name: "Desktop" }, { name: "Mobile" }, { name: "Tablet" }] }
      },
      { name: "Is WhatsApp",    type: "checkbox",        options: { icon: "check", color: "greenBright" } },
      { name: "Timestamp",      type: "dateTime",        options: { dateFormat: { name: "iso" }, timeFormat: { name: "24hour" }, timeZone: "utc" } },
    ]
  },
  {
    name: "Scroll Engagement",
    description: "How deep visitors scroll on each page — tracked at 25%, 50%, 75%, 100% milestones.",
    fields: [
      { name: "Page URL",       type: "url" },
      { name: "Page Path",      type: "singleLineText" },
      {
        name: "Scroll Depth", type: "singleSelect",
        options: { choices: [{ name: "25%" }, { name: "50%" }, { name: "75%" }, { name: "100%" }] }
      },
      { name: "Max Scroll (%)", type: "number",          options: { precision: 0 } },
      { name: "Time at Milestone (s)", type: "number",   options: { precision: 0 } },
      { name: "Visitor ID",     type: "singleLineText" },
      { name: "Session ID",     type: "singleLineText" },
      {
        name: "Device", type: "singleSelect",
        options: { choices: [{ name: "Desktop" }, { name: "Mobile" }, { name: "Tablet" }] }
      },
      { name: "Timestamp",      type: "dateTime",        options: { dateFormat: { name: "iso" }, timeFormat: { name: "24hour" }, timeZone: "utc" } },
    ]
  },
  {
    name: "Sessions",
    description: "One record per browser session — the overall container for a user's visit.",
    fields: [
      { name: "Session ID",      type: "singleLineText" },
      { name: "Visitor ID",      type: "singleLineText" },
      { name: "Session Start",   type: "dateTime",        options: { dateFormat: { name: "iso" }, timeFormat: { name: "24hour" }, timeZone: "utc" } },
      { name: "Duration (s)",    type: "number",          options: { precision: 0 } },
      {
        name: "Device", type: "singleSelect",
        options: { choices: [{ name: "Desktop" }, { name: "Mobile" }, { name: "Tablet" }] }
      },
      { name: "Browser",         type: "singleLineText" },
      { name: "OS",              type: "singleLineText" },
      { name: "Traffic Source",  type: "singleLineText" },
      { name: "UTM Source",      type: "singleLineText" },
      { name: "UTM Medium",      type: "singleLineText" },
      { name: "UTM Campaign",    type: "singleLineText" },
      { name: "Timezone",        type: "singleLineText" },
      { name: "Is Returning",    type: "checkbox",        options: { icon: "check", color: "greenBright" } },
      { name: "Converted",       type: "checkbox",        options: { icon: "check", color: "greenBright" } },
    ]
  },
  {
    name: "Form Interactions",
    description: "Every form field focus, start, and submission — including abandoned forms.",
    fields: [
      { name: "Event Type",      type: "singleLineText" },
      { name: "Form Name",       type: "singleLineText" },
      { name: "Field Focused",   type: "singleLineText" },
      {
        name: "Form Status", type: "singleSelect",
        options: { choices: [{ name: "in_progress" }, { name: "submitted" }, { name: "abandoned" }] }
      },
      { name: "Visitor ID",      type: "singleLineText" },
      { name: "Session ID",      type: "singleLineText" },
      { name: "Page URL",        type: "url" },
      {
        name: "Device", type: "singleSelect",
        options: { choices: [{ name: "Desktop" }, { name: "Mobile" }, { name: "Tablet" }] }
      },
      { name: "Name Entered",    type: "singleLineText" },
      { name: "Email Entered",   type: "email" },
      { name: "Phone Entered",   type: "phoneNumber" },
      { name: "Company Entered", type: "singleLineText" },
      { name: "Timestamp",       type: "dateTime",        options: { dateFormat: { name: "iso" }, timeFormat: { name: "24hour" }, timeZone: "utc" } },
    ]
  },
];

async function run() {
  const existing = await getExistingTables();
  const existingNames = new Set(existing.map(t => t.name));

  for (const tableDef of tablesToCreate) {
    if (existingNames.has(tableDef.name)) {
      console.log(`⏭️  Skipping "${tableDef.name}" — already exists`);
      continue;
    }
    await createTable(tableDef);
    await new Promise(r => setTimeout(r, 500)); // rate limit buffer
  }

  console.log("\n✅ Setup complete! All tables created.");
}

run().catch(console.error);
