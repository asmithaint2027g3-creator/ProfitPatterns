// api/_airtable.js
// Airtable integration helper for Leads and User Behavior Analytics

/**
 * Save a lead submission to the Airtable Leads table
 */
export async function saveLeadToAirtable(lead) {
  const token =
    process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ||
    process.env.VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId =
    process.env.AIRTABLE_BASE_ID ||
    process.env.VITE_AIRTABLE_BASE_ID;
  const tableName =
    process.env.AIRTABLE_TABLE_NAME ||
    process.env.VITE_AIRTABLE_TABLE_NAME ||
    "Leads";

  if (!token || !baseId) {
    return { ok: false, error: "Missing Airtable token or base ID." };
  }

  // Guard against accidental PAT token pasted into Base ID
  if (baseId.startsWith("pat")) {
    return {
      ok: false,
      error: "AIRTABLE_BASE_ID appears to be a Personal Access Token. Airtable Base IDs must start with 'app'.",
    };
  }

  const fields = {
    Name: lead.name || "Inbound Lead",
    Email: (lead.email || "").toLowerCase(),
    Status: "New",
  };

  if (lead.phone) fields["Phone"] = String(lead.phone);
  if (lead.company) fields["Company"] = String(lead.company);
  if (lead.jobTitle || lead.job_title) fields["Job Title"] = String(lead.jobTitle || lead.job_title);
  if (lead.industry) fields["Industry"] = String(lead.industry);
  if (lead.leadType || lead.lead_type) fields["Lead Type"] = String(lead.leadType || lead.lead_type);
  if (lead.requirement) fields["Requirement"] = String(lead.requirement);
  if (lead.challenge || lead.message) fields["Message"] = String(lead.challenge || lead.message);
  if (lead.pageUrl || lead.page_url) fields["Source Page"] = String(lead.pageUrl || lead.page_url);

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields, typecast: true }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Airtable lead save warning:", res.status, errText);
      return { ok: false, error: errText };
    }

    const data = await res.json();
    console.log("✅ Lead successfully saved to Airtable:", data.id);
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("Airtable lead save error:", err);
    return { ok: false, error: err.message };
  }
}

/**
 * Save user behavior tracking events to the Airtable User Behavior table
 */
export async function saveBehaviorToAirtable(event) {
  const token =
    process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN ||
    process.env.VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId =
    process.env.AIRTABLE_BASE_ID ||
    process.env.VITE_AIRTABLE_BASE_ID;
  const tableName =
    process.env.AIRTABLE_BEHAVIOR_TABLE_NAME ||
    process.env.VITE_AIRTABLE_BEHAVIOR_TABLE_NAME ||
    "User Behavior";

  if (!token || !baseId || baseId.startsWith("pat")) {
    return { ok: false, error: "Missing or invalid Airtable configuration." };
  }

  const fields = {
    "Event Name": event.event_name || event.event_type || "user_action",
    "Timestamp": event.timestamp_iso || new Date().toISOString(),
  };

  if (event.event_category || event.event_type) {
    fields["Category"] = String(event.event_category || event.event_type);
  }
  if (event.page_url || event.pageUrl) {
    fields["Page URL"] = String(event.page_url || event.pageUrl);
  }
  if (event.page_title) {
    fields["Page Title"] = String(event.page_title);
  }
  if (event.visitor_id) {
    fields["Visitor ID"] = String(event.visitor_id);
  }
  if (event.session_id) {
    fields["Session ID"] = String(event.session_id);
  }
  if (event.device_type) {
    fields["Device"] = String(event.device_type);
  }
  if (event.browser) {
    fields["Browser"] = String(event.browser);
  }
  if (event.operating_system) {
    fields["OS"] = String(event.operating_system);
  }
  if (event.traffic_source) {
    fields["Traffic Source"] = String(event.traffic_source);
  }
  if (event.click_target_text || event.element_text) {
    fields["Target Text"] = String(event.click_target_text || event.element_text);
  }
  if (event.scroll_depth_percent !== undefined && event.scroll_depth_percent !== null) {
    fields["Scroll Depth"] = `${event.scroll_depth_percent}%`;
  }
  if (event.time_on_page_seconds !== undefined && event.time_on_page_seconds !== null) {
    fields["Time on Page"] = `${event.time_on_page_seconds}s`;
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields, typecast: true }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.warn("Airtable behavior save warning:", res.status, errText);
      return { ok: false, error: errText };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("Airtable behavior save error:", err);
    return { ok: false, error: err.message };
  }
}
