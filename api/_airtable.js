// api/_airtable.js
// Full Airtable integration — routes each event type to the correct table

const getEnv = (key) =>
  process.env[key] ||
  process.env["VITE_" + key] ||
  "";

function getCredentials() {
  const token  = getEnv("AIRTABLE_PERSONAL_ACCESS_TOKEN");
  const baseId = getEnv("AIRTABLE_BASE_ID");
  if (!token || !baseId || baseId.startsWith("pat")) return null;
  return { token, baseId };
}

async function insertRecord(tableName, fields, creds) {
  const { token, baseId } = creds;
  try {
    const res = await fetch(
      "https://api.airtable.com/v0/" + baseId + "/" + encodeURIComponent(tableName),
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields, typecast: true }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      console.warn("[Airtable] \"" + tableName + "\" insert failed (" + res.status + "):", err);
      return { ok: false, error: err };
    }
    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[Airtable] \"" + tableName + "\" insert error:", err.message);
    return { ok: false, error: err.message };
  }
}

// Cache to debounce identical submissions within 30 seconds
const recentLeadSubmissions = new Map();

export async function saveLeadToAirtable(lead) {
  const creds = getCredentials();

  if (!creds) {
    console.warn(
      "[Airtable] Missing AIRTABLE_PERSONAL_ACCESS_TOKEN or AIRTABLE_BASE_ID."
    );

    return {
      ok: false,
      error: "Missing Airtable credentials",
    };
  }

  const fields = {
    Name: cleanText(
      lead.name || lead.fullName || "Inbound Lead"
    ),

    Status: cleanText(
      lead.status || "New",
      100
    ),
  };

  // Email
  if (lead.email) {
    fields.Email = cleanEmail(lead.email);
  }

  // Phone
  if (lead.phone) {
    fields.Phone = cleanText(lead.phone, 50);
  }

  // IMPORTANT: your Airtable field is "Comp"
  if (lead.company) {
    fields.Comp = cleanText(lead.company);
  }

  // Job Title
  if (lead.jobTitle || lead.job_title) {
    fields["Job Title"] = cleanText(
      lead.jobTitle || lead.job_title
    );
  }

  // Industry
  if (lead.industry) {
    fields.Industry = cleanText(lead.industry);
  }

  // Lead Type
  if (lead.leadType || lead.lead_type) {
    fields["Lead Type"] = cleanText(
      lead.leadType || lead.lead_type,
      100
    );
  }

  // IMPORTANT: your Airtable field is "Req"
  if (
    lead.requirement ||
    lead.req ||
    lead.primaryChallenge ||
    lead.primaryGoal
  ) {
    fields.Req = cleanText(
      lead.requirement ||
        lead.req ||
        lead.primaryChallenge ||
        lead.primaryGoal,
      2000
    );
  }

  // IMPORTANT: your Airtable field is "Challenge"
  if (
    lead.challenge ||
    lead.currentChallenge ||
    lead.message ||
    lead.processSummary
  ) {
    fields.Challenge = cleanText(
      lead.challenge ||
        lead.currentChallenge ||
        lead.message ||
        lead.processSummary,
      2000
    );
  }

  // IMPORTANT: your Airtable field is "Src Page"
  if (
    lead.pageUrl ||
    lead.page_url ||
    lead.sourcePage
  ) {
    fields["Src Page"] = cleanText(
      lead.pageUrl ||
        lead.page_url ||
        lead.sourcePage,
      500
    );
  }

  // Notes
  if (lead.notes) {
    fields.Notes = cleanText(
      lead.notes,
      2000
    );
  }

  // Jira
  if (
    lead.jira ||
    lead.jiraUrl ||
    lead.jiraIssueKey
  ) {
    fields.Jira = cleanText(
      lead.jira ||
        lead.jiraUrl ||
        lead.jiraIssueKey,
      500
    );
  }

  // Attachment
  if (lead.fileUrl) {
    fields.Attachment = [
      {
        url: lead.fileUrl,
      },
    ];
  }

  console.log(
    "[Airtable] Creating Lead:",
    JSON.stringify(fields)
  );

  return insertRecord(
    "Leads",
    fields,
    creds
  );
}

// ─── 2. PAGE VIEWS ────────────────────────────────────────────────────────────

export async function savePageViewToAirtable(event) {
  const creds = getCredentials();
  if (!creds) return { ok: false };

  function inferPageType(path) {
    const p = (path || "").toLowerCase();
    if (p === "/" || p === "") return "Home";
    if (p.includes("/services")) return "Service";
    if (p.includes("/solutions")) return "Solution";
    if (p.includes("/case-studies")) return "Case Study";
    if (p.includes("/insights")) return "Insight";
    if (p.includes("/resources")) return "Resource";
    if (p.includes("/industries")) return "Industry";
    if (p.includes("/contact")) return "Contact";
    if (p.includes("/about")) return "About";
    if (p.includes("/faq")) return "FAQ";
    if (p.includes("/how-it-works")) return "How It Works";
    if (p.includes("/audit")) return "Audit";
    if (p.includes("/who-we-serve")) return "Who We Serve";
    if (p.includes("/privacy")) return "Privacy";
    if (p.includes("/terms")) return "Terms";
    return "Other";
  }

  const path = event.page_path || "";
  const fields = {
    "Page URL":     (event.page_url || "").slice(0, 500),
    "Page Title":   (event.page_title || "").slice(0, 255),
    "Page Path":    path.slice(0, 255),
    "Page Type":    inferPageType(path),
    "Visitor ID":   (event.visitor_id || "").slice(0, 100),
    "Session ID":   (event.session_id || "").slice(0, 100),
    "Is Returning": event.is_returning_visitor === "true" || event.is_returning_visitor === true,
    "Timestamp":    event.client_timestamp || event.timestamp_iso || new Date().toISOString(),
  };

  if (event.device_type)      fields["Device"]         = event.device_type;
  if (event.browser)          fields["Browser"]        = String(event.browser).slice(0, 100);
  if (event.operating_system) fields["OS"]             = String(event.operating_system).slice(0, 100);
  if (event.screen_width && event.screen_height)
                              fields["Screen Size"]    = event.screen_width + "x" + event.screen_height;
  if (event.traffic_source)   fields["Traffic Source"] = String(event.traffic_source).slice(0, 100);
  if (event.utm_source)       fields["UTM Source"]     = String(event.utm_source).slice(0, 100);
  if (event.utm_medium)       fields["UTM Medium"]     = String(event.utm_medium).slice(0, 100);
  if (event.utm_campaign)     fields["UTM Campaign"]   = String(event.utm_campaign).slice(0, 200);
  if (event.timezone)         fields["Timezone"]       = String(event.timezone).slice(0, 100);

  return insertRecord("Page Views", fields, creds);
}

// ─── 3. CLICKS & INTERACTIONS ─────────────────────────────────────────────────

export async function saveClickToAirtable(event) {
  const creds = getCredentials();
  if (!creds) return { ok: false };

  const validNames = ["cta_click", "navigation_click", "whatsapp_click"];
  const clickName  = validNames.includes(event.event_name) ? event.event_name : "cta_click";

  const fields = {
    "Event Name":   clickName,
    "Element Text": (event.element_text || event.click_text || event.cta_name || "").slice(0, 255),
    "Section":      (event.section || "main_content").slice(0, 100),
    "Element Type": (event.element_type || "button").slice(0, 50),
    "Page URL":     (event.page_url || "").slice(0, 500),
    "Page Path":    (event.page_path || "").slice(0, 255),
    "Visitor ID":   (event.visitor_id || "").slice(0, 100),
    "Session ID":   (event.session_id || "").slice(0, 100),
    "Is WhatsApp":  clickName === "whatsapp_click",
    "Timestamp":    event.client_timestamp || event.timestamp_iso || new Date().toISOString(),
  };

  if (event.device_type)              fields["Device"]    = event.device_type;
  if (event.click_position_x != null) fields["Click X"]  = Number(event.click_position_x);
  if (event.click_position_y != null) fields["Click Y"]  = Number(event.click_position_y);
  if (event.hand_zone) {
    const validZones = ["Left-Hand Zone", "Right-Hand Zone", "Center / Dual Zone", "Desktop Pointer"];
    fields["Hand Zone"] = validZones.includes(event.hand_zone) ? event.hand_zone : "Desktop Pointer";
  }

  return insertRecord("Clicks & Interactions", fields, creds);
}

// ─── 4. SCROLL ENGAGEMENT ─────────────────────────────────────────────────────

export async function saveScrollToAirtable(event) {
  const creds = getCredentials();
  if (!creds) return { ok: false };

  const rawDepth  = Number(event.scroll_depth || event.scroll_percentage || 25);
  const milestone = [25, 50, 75, 100].includes(rawDepth) ? rawDepth : 25;

  const fields = {
    "Page URL":              (event.page_url || "").slice(0, 500),
    "Page Path":             (event.page_path || "").slice(0, 255),
    "Scroll Depth":          milestone + "%",
    "Max Scroll (%)":        Number(event.max_scroll_depth || milestone),
    "Time at Milestone (s)": Number(event.time_on_page_seconds || 1),
    "Visitor ID":            (event.visitor_id || "").slice(0, 100),
    "Session ID":            (event.session_id || "").slice(0, 100),
    "Timestamp":             event.client_timestamp || event.timestamp_iso || new Date().toISOString(),
  };

  if (event.device_type) fields["Device"] = event.device_type;
  return insertRecord("Scroll Engagement", fields, creds);
}

// ─── 5. SESSIONS ──────────────────────────────────────────────────────────────

export async function saveSessionToAirtable(event) {
  const creds = getCredentials();
  if (!creds) return { ok: false };

  const fields = {
    "Session ID":    (event.session_id || "").slice(0, 100),
    "Visitor ID":    (event.visitor_id || "").slice(0, 100),
    "Session Start": event.client_timestamp || event.timestamp_iso || new Date().toISOString(),
    "Duration (s)":  Number(event.time_on_page_seconds || event.session_duration_seconds || 0),
    "Is Returning":  event.is_returning_visitor === "true" || event.is_returning_visitor === true,
    "Converted":     false,
  };

  if (event.device_type)      fields["Device"]         = event.device_type;
  if (event.browser)          fields["Browser"]        = String(event.browser).slice(0, 100);
  if (event.operating_system) fields["OS"]             = String(event.operating_system).slice(0, 100);
  if (event.traffic_source)   fields["Traffic Source"] = String(event.traffic_source).slice(0, 100);
  if (event.utm_source)       fields["UTM Source"]     = String(event.utm_source).slice(0, 100);
  if (event.utm_medium)       fields["UTM Medium"]     = String(event.utm_medium).slice(0, 100);
  if (event.utm_campaign)     fields["UTM Campaign"]   = String(event.utm_campaign).slice(0, 200);
  if (event.timezone)         fields["Timezone"]       = String(event.timezone).slice(0, 100);

  return insertRecord("Sessions", fields, creds);
}

// ─── 6. FORM INTERACTIONS ─────────────────────────────────────────────────────

export async function saveFormInteractionToAirtable(event) {
  const creds = getCredentials();
  if (!creds) return { ok: false };

  const eventType = event.event_name === "form_start" ? "form_start" : "form_submit";
  const rawStatus = event.form_status || (eventType === "form_submit" ? "submitted" : "in_progress");
  const status    = ["in_progress", "submitted", "abandoned"].includes(rawStatus) ? rawStatus : "in_progress";

  const fields = {
    "Event Type":    eventType,
    "Form Name":     (event.form_name || "Quick Contact Form").slice(0, 255),
    "Field Focused": (event.form_field_name || "").slice(0, 100),
    "Form Status":   status,
    "Visitor ID":    (event.visitor_id || "").slice(0, 100),
    "Session ID":    (event.session_id || "").slice(0, 100),
    "Page URL":      (event.page_url || "").slice(0, 500),
    "Timestamp":     event.client_timestamp || event.timestamp_iso || new Date().toISOString(),
  };

  if (event.device_type) fields["Device"]          = event.device_type;
  if (event.name)        fields["Name Entered"]    = String(event.name).slice(0, 255);
  if (event.email)       fields["Email Entered"]   = String(event.email).slice(0, 255);
  if (event.phone)       fields["Phone Entered"]   = String(event.phone).slice(0, 50);
  if (event.company)     fields["Company Entered"] = String(event.company).slice(0, 255);

  return insertRecord("Form Interactions", fields, creds);
}

// ─── 7. USER BEHAVIOR (catch-all) ─────────────────────────────────────────────

export async function saveBehaviorToAirtable(event) {
  const creds = getCredentials();
  if (!creds) return { ok: false };

  const fields = {
    "Event Name": (event.event_name || event.event_type || "custom_event").slice(0, 255),
    "Timestamp":  event.client_timestamp || event.timestamp_iso || new Date().toISOString(),
  };

  if (event.event_category || event.event_type)
    fields["Category"]       = String(event.event_category || event.event_type).slice(0, 100);
  if (event.page_url)         fields["Page URL"]       = String(event.page_url).slice(0, 500);
  if (event.page_title)       fields["Page Title"]     = String(event.page_title).slice(0, 255);
  if (event.visitor_id)       fields["Visitor ID"]     = String(event.visitor_id).slice(0, 100);
  if (event.session_id)       fields["Session ID"]     = String(event.session_id).slice(0, 100);
  if (event.device_type)      fields["Device"]         = event.device_type;
  if (event.browser)          fields["Browser"]        = String(event.browser).slice(0, 100);
  if (event.operating_system) fields["OS"]             = String(event.operating_system).slice(0, 100);
  if (event.traffic_source)   fields["Traffic Source"] = String(event.traffic_source).slice(0, 100);
  if (event.element_text || event.click_text || event.cta_name)
    fields["Target Text"]    = String(event.element_text || event.click_text || event.cta_name).slice(0, 255);
  if (event.scroll_percentage != null) fields["Scroll Depth"]  = event.scroll_percentage + "%";
  if (event.time_on_page_seconds != null) fields["Time on Page"] = event.time_on_page_seconds + "s";

  return insertRecord("User Behavior", fields, creds);
}

// ─── SMART ROUTER ─────────────────────────────────────────────────────────────

export async function routeEventToAirtable(event) {
  const name = String(event.event_name || event.event_type || "");
  const type = String(event.event_type || "");
  const promises = [];

  const isExplicitLead = (name === "lead_submit" || type === "lead") && name !== "form_submit" && name !== "form_start";
  const hasContactData = Boolean(
  event.email ||
  event.phone ||
  event.name ||
  event.fullName
);

const isLead =
  name === "lead_submit" ||
  type === "lead" ||
  (name === "form_submit" && hasContactData);

if (isLead && hasContactData) {
  promises.push(
    saveLeadToAirtable(event).catch((e) =>
      console.warn(
        "[Airtable] Lead:",
        e.message
      )
    )
  );
}
  if (name === "page_view" || name === "pageview")
    promises.push(savePageViewToAirtable(event).catch(e => console.warn("[Airtable] PageView:", e.message)));
  if (["cta_click", "navigation_click", "whatsapp_click"].includes(name))
    promises.push(saveClickToAirtable(event).catch(e => console.warn("[Airtable] Click:", e.message)));
  if (name === "scroll_depth")
    promises.push(saveScrollToAirtable(event).catch(e => console.warn("[Airtable] Scroll:", e.message)));
  if (name === "session_start" || name === "session_end")
    promises.push(saveSessionToAirtable(event).catch(e => console.warn("[Airtable] Session:", e.message)));
  if (name === "form_start" || name === "form_submit")
    promises.push(saveFormInteractionToAirtable(event).catch(e => console.warn("[Airtable] Form:", e.message)));

  // Always record into master "User Behavior" table so no behavior is ever lost
  promises.push(saveBehaviorToAirtable(event).catch(e => console.warn("[Airtable] Behavior:", e.message)));

  if (promises.length) await Promise.allSettled(promises);
}
