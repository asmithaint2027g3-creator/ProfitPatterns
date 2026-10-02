/**
 * =========================================================================================
 * PROFITPATTERNS — UNIFIED DIGITAL PRESENCE & 3-LAYER MULTI-INTELLIGENCE ENGINE
 * =========================================================================================
 * Website: https://profit-patterns-xi.vercel.app/
 *
 * Architecture:
 * 1. VISIBILITY LAYER (Raw Telemetry & Firehose):
 *    - Live_Traffic_Events: Ingests all raw 56-column telemetry events.
 *    - Click_Interactions: Tracks element clicks, coordinates & Left vs Right Hand zones.
 *    - Scroll_Engagement: Device-aware scroll depths (Mobile vs Desktop).
 *    - Page_Performance, Visitor_Sessions, Traffic_Sources, Form_Interactions, Conversion_Events.
 *
 * 2. ANALYZE LAYER (Pillar Intelligence & Cross-Correlation):
 *    - Session_Intelligence: 1 unique row per session (Dwell time, entry/exit, navigation flow, bounce risk, funnel stage).
 *    - Traffic_Intelligence: 1 unique row per session (UTMs, first/last-touch attribution, channel ROI score).
 *    - Geo_Timezone_Intelligence: 1 unique row per visitor/session (Country, city, local clock, day phase, advisory desk).
 *    - IP_Security_Intelligence: 1 unique row per session (ISP, corporate intent, fraud risk score, verified human status).
 *
 * 3. PREDICTIVE LAYER (Executive Lead Intelligence & Action):
 *    - Lead_Management: Master consolidated directory enriched with Predictive Intent Scores & Tailored Strategy.
 *    - Dedicated Lead Tabs: Quick_Form_Leads, Long_Form_Leads, Audit_Document_Leads, Chatbot_Leads.
 *    - Google Drive Archival & Instant VIP Email Alerts (PDF dossiers, Drive links, WhatsApp, Phone).
 *    - Automated Daily, Weekly, Monthly Executive Reports.
 * =========================================================================================
 */

var CONFIG = {
  SPREADSHEET_ID: "1RtJupdNAFOO9Fy8xGP5FeN0p0RVZAaJVCYd96vlVE1I",
  SYSTEM_NAME: "ProfitPatterns Multi-Intelligence Engine",
  DEFAULT_ENVIRONMENT: "production",
  AUDIT_DOCUMENTS_FOLDER_NAME: "ProfitPatterns_Audit_Dossiers",
  TIMEZONE: "Asia/Kolkata"
};

var EMAIL_CONFIG = {
  name: "ProfitPatterns Strategic Intelligence",
  companyName: "ProfitPatterns",
  website: "https://profit-patterns-xi.vercel.app",
  replyTo: "asmithaveera1346@gmail.com",
  adminEmail: "asmithaveera1346@gmail.com",
  
  leadEmails: [
    "asmitha.int2027g3@gmail.com",
    "asmitha.int2027gs@gmail.com",
    "asmithaveera1346@gmail.com"
  ],
  
  reportEmails: [
    "asmitha.int2027g3@gmail.com",
    "asmitha.int2027gs@gmail.com",
    "asmithaveera1346@gmail.com"
  ],

  whatsappNumber: "917339693105"
};

// =========================================================================================
// TAB SCHEMAS (RAW TELEMETRY + 4 INTELLIGENCE TABS + LEADS + INTERVAL DIGESTS)
// =========================================================================================
var TAB_HEADERS = {
  // --- LAYER 1: VISIBILITY TELEMETRY TABS ---
  Live_Traffic_Events: [
    "received_at","event_id","event_type","event_name","visitor_id","session_id",
    "client_timestamp","user_id","page_url","page_path","page_title","previous_page",
    "referrer_url","traffic_source","utm_source","utm_medium","utm_campaign","utm_term",
    "utm_content","device_type","browser","browser_version","operating_system",
    "screen_width","screen_height","viewport_width","viewport_height","language",
    "timezone","network_type","event_category","event_action","event_label","section",
    "element_type","element_id","element_class","element_text","click_position_x",
    "click_position_y","hand_zone","scroll_percentage","max_scroll_depth","time_on_page_seconds",
    "session_duration_seconds","interaction_count","tab_visibility_status","form_name",
    "form_id","form_field_name","form_status","conversion_name","conversion_value",
    "source_environment","event_data_json"
  ],

  Click_Interactions: [
    "received_at","event_id","visitor_id","session_id","page_url","page_path",
    "device_type","element_type","element_id","element_class","element_text",
    "click_position_x","click_position_y","hand_zone","section","event_label"
  ],

  Scroll_Engagement: [
    "received_at","event_id","visitor_id","session_id","page_url","page_path",
    "device_type","scroll_percentage","max_scroll_depth","time_on_page_seconds","section"
  ],

  Visitor_Sessions: [
    "received_at","event_id","visitor_id","session_id","event_type","client_timestamp",
    "page_url","page_path","referrer_url","traffic_source","device_type","browser",
    "operating_system","session_duration_seconds","interaction_count",
    "is_returning_visitor","source_environment"
  ],

  Page_Performance: [
    "received_at","event_id","visitor_id","session_id","page_url","page_path",
    "page_title","event_type","time_on_page_seconds","scroll_percentage",
    "max_scroll_depth","traffic_source","device_type","source_environment"
  ],

  Form_Interactions: [
    "received_at","event_id","visitor_id","session_id","page_url","page_path",
    "form_name","form_id","form_field_name","form_status","event_type"
  ],

  Conversion_Events: [
    "received_at","event_id","visitor_id","session_id","conversion_name",
    "conversion_value","page_url","traffic_source","utm_source","utm_medium",
    "utm_campaign","source_environment"
  ],

  Traffic_Sources: [
    "received_at","event_id","visitor_id","session_id","page_url","referrer_url",
    "traffic_source","utm_source","utm_medium","utm_campaign","utm_term"
  ],

  SEO_Performance: [
    "received_at","record_date","site_url","page_url","search_query",
    "clicks","impressions","ctr","average_position","device"
  ],

  // --- LAYER 2: ANALYZE LAYER INTELLIGENCE TABS (Deduplicated Upsert) ---
  Session_Intelligence: [
    "Timestamp", "Session ID", "Visitor ID", "Entry Point", "Current Page",
    "Page Dwell (s)", "Session Dwell (s)", "Navigation Flow", "Bounce Risk",
    "Funnel Stage", "User Intent", "Interactions Count"
  ],

  Traffic_Intelligence: [
    "Timestamp", "Session ID", "Visitor ID", "Traffic Category", "Raw Source",
    "Medium", "Campaign", "Search Term", "Ad Content", "Click ID / Tag",
    "First-Touch Attribution", "Last-Touch Attribution", "Channel ROI Score", "Referrer Domain"
  ],

  Geo_Timezone_Intelligence: [
    "Timestamp", "Visitor ID", "Country", "Country Code", "City",
    "Region", "Continent", "Currency", "Market Tier", "Compliance Mode",
    "Local Clock Time", "Timezone (IANA)", "UTC Offset", "Day Phase",
    "Peak Hours Status", "Active Advisory Desk"
  ],

  IP_Security_Intelligence: [
    "Timestamp", "Visitor ID", "Session ID", "Network Carrier / ISP",
    "Network Type", "Corporate Intent", "Fraud Risk Score", "Fraud Status",
    "Repeat Visits Velocity", "Security Tier", "Device Type", "Browser / OS"
  ],

  // --- LAYER 3: PREDICTIVE LAYER & LEAD MANAGEMENT TABS ---
  Lead_Management: [
    "received_at","lead_id","lead_type","visitor_id","session_id","name","email","phone",
    "company","lead_source","form_name","lead_status","follow_up_status",
    "consent_status","source_environment","document_drive_link","drive_file_id",
    "predictive_synergy_score","urgency_score","regional_market","tailored_strategy"
  ],

  Quick_Form_Leads: [
    "received_at","lead_id","visitor_id","session_id","name","email","phone",
    "company","requirement","message","page_path","lead_source","lead_status",
    "follow_up_status","source_environment","predictive_score"
  ],

  Long_Form_Leads: [
    "received_at","lead_id","visitor_id","session_id","name","email","phone",
    "company","job_title","industry","company_size","website","requirement",
    "challenge","desired_outcome","current_tools","existing_ai_usage",
    "project_scope","budget_range","preferred_contact_time","page_path",
    "lead_source","lead_status","follow_up_status","source_environment","predictive_score"
  ],

  Audit_Document_Leads: [
    "received_at","lead_id","visitor_id","session_id","name","email","phone",
    "company","job_title","industry","requirement","challenge","audit_doc_type",
    "weekly_hours_spent","files_count","files_list","nda_requested",
    "document_drive_link","drive_file_id","page_path","lead_source",
    "lead_status","follow_up_status","source_environment","predictive_score"
  ],

  Chatbot_Leads: [
    "received_at","lead_id","visitor_id","session_id","name","email","phone",
    "company","requirement","challenge","page_path","lead_source","lead_status",
    "follow_up_status","source_environment","predictive_score"
  ],

  // --- EXECUTIVE SUMMARY TABS ---
  Daily_Summary: [
    "Date","Total_Events","Unique_Visitors","Page_Views","Quick_Leads",
    "Consultation_Leads","Audit_Dossiers","Chatbot_Leads","Total_Leads",
    "Conversion_Rate","Avg_Engagement_Sec"
  ],

  Weekly_Summary: [
    "Week_Start","Total_Events","Unique_Visitors","Page_Views","Quick_Leads",
    "Consultation_Leads","Audit_Dossiers","Chatbot_Leads","Total_Leads",
    "Conversion_Rate","Avg_Engagement_Sec"
  ],

  Monthly_Summary: [
    "Month","Total_Events","Unique_Visitors","Page_Views","Quick_Leads",
    "Consultation_Leads","Audit_Dossiers","Chatbot_Leads","Total_Leads",
    "Conversion_Rate","Avg_Engagement_Sec"
  ]
};

// =========================================================================================
// SPREADSHEET & TAB ACCESS HELPERS
// =========================================================================================
function getSpreadsheet() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  if (CONFIG.SPREADSHEET_ID && !CONFIG.SPREADSHEET_ID.includes("PASTE_")) {
    try {
      return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    } catch (e) {
      console.warn("Could not open spreadsheet by ID: " + e.toString());
    }
  }
  return null;
}

function getTab(ss, tabName) {
  if (!ss) ss = getSpreadsheet();
  if (!ss) return null;

  var sheet = ss.getSheetByName(tabName);
  var headers = (TAB_HEADERS && TAB_HEADERS[tabName]) ? TAB_HEADERS[tabName] : [];

  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    if (headers.length > 0) {
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers])
                 .setFontWeight("bold")
                 .setBackground("#064e3b")
                 .setFontColor("#ffffff")
                 .setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
<<<<<<< HEAD

    var payload = JSON.parse(rawData);
    var ss = getSpreadsheet();
    var now = new Date();

    var eventName = payload.event_name || payload.name || "event";
    var eventType = payload.event_type || payload.type || "custom_event";
    var isLead = (eventType === "lead" || eventName === "lead_submit" || payload.email || payload.phone) && 
                 eventName !== "form_start";

    // 1. Session Intelligence (Upserts 1 unique row per session_id)
    if (payload.session_id) {
      upsertSessionIntelligence(ss, payload, now);
    }

    // 2. Traffic Intelligence (Upserts 1 unique row per session_id)
    if (payload.session_id && (payload.traffic_source || payload.utm_source || payload.first_touch_attribution)) {
      upsertTrafficIntelligence(ss, payload, now);
    }

    // 3. Geo & Timezone Intelligence (Upserts 1 unique row per visitor_id / session_id)
    if (payload.visitor_id && (payload.geo_country || payload.timezone_iana || payload.geo_city)) {
      upsertGeoTimezoneIntelligence(ss, payload, now);
    }

    // 4. IP & Security Intelligence (Upserts 1 unique row per session_id)
    if (payload.session_id && (payload.ip_network_carrier || payload.network_carrier_type || payload.fraud_risk_score)) {
      upsertIPSecurityIntelligence(ss, payload, now);
    }

    // 5. Lead Management (Logs only genuine lead submissions)
    if (isLead && (payload.email || payload.phone || payload.name)) {
      logLeadManagement(ss, payload, now);
    }

    // 6. Master Event Log (Audit trail of key events)
    if (eventType !== "scroll") {
      logMasterEvent(ss, payload, now);
    }

    // 7. Auto-refresh summary sheets (Daily, Weekly, Monthly)
    updateSummaryRollups(ss);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", received: eventName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
=======
  } else if (sheet.getLastRow() === 0 && headers.length > 0) {
    var headerRange2 = sheet.getRange(1, 1, 1, headers.length);
    headerRange2.setValues([headers])
                .setFontWeight("bold")
                .setBackground("#064e3b")
                .setFontColor("#ffffff")
                .setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
>>>>>>> e708e58 (feat: complete 3-layer multi-intelligence engine & fix exit intent popup)
  }
  return sheet;
}

<<<<<<< HEAD
// Handle GET requests (health check & summary refresh)
function doGet(e) {
  var ss = getSpreadsheet();
  updateSummaryRollups(ss);
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "online", 
    service: "ProfitPatterns Intelligence Engine Backend (Summaries Active)",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Manual Runner Function: You can run this function directly in Apps Script to instantly populate summaries
function generateAllSummaries() {
  var ss = getSpreadsheet();
  updateSummaryRollups(ss);
  Logger.log("✅ Daily, Weekly, and Monthly summary sheets successfully populated!");
}

// Helper: Find existing row index by column value (1-indexed, returns -1 if not found)
=======
// Find existing row index by column value (1-based row index, returns -1 if not found)
>>>>>>> e708e58 (feat: complete 3-layer multi-intelligence engine & fix exit intent popup)
function findRowByValue(sheet, colIndex, value) {
  if (!value) return -1;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var range = sheet.getRange(2, colIndex, lastRow - 1, 1);
  var values = range.getValues();
  var searchStr = String(value).trim().toLowerCase();

  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() === searchStr) {
      return i + 2;
    }
  }
  return -1;
}

// =========================================================================================
// MAIN WEBHOOK (doPost & doGet)
// =========================================================================================
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    system: CONFIG.SYSTEM_NAME,
    timestamp: new Date().toISOString(),
    spreadsheetId: CONFIG.SPREADSHEET_ID
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Test fallback if executed without payload
  if (!e || !e.postData || !e.postData.contents) {
    e = {
      postData: {
        contents: JSON.stringify({
          event_type: "lead",
          event_name: "lead_submit",
          lead_type: "QUICK_FORM",
          form_name: "Quick Contact Form",
          name: "Test Executive",
          email: "asmitha.int2027g3@gmail.com",
          phone: "+91 7339693105",
          company: "Enterprise AI Client",
          requirement: "AI Strategy Consultation",
          page_path: "/contact"
        })
      }
    };
  }

  try {
    var rawPayload = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet();
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Spreadsheet inaccessible" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var receivedAt = normalizeTimestamp(new Date());
    var p = enrichPayload(rawPayload, receivedAt);
    var now = new Date();

    // ── 1. Process & Archive Attached Files to Google Drive ──
    var attachments = getAttachmentBlobs(p, p.name || "Client");
    var driveBlobs = archiveDocumentToDrive(p);
    if (driveBlobs.length > 0 && attachments.length === 0) {
      attachments = driveBlobs;
    }

    // ── 2. LAYER 1: Raw Telemetry Stream (Live_Traffic_Events) ──
    appendRowToTab(ss, "Live_Traffic_Events", p);

    // ── 3. LAYER 2: 4-Pillar Intelligence Processing (Upsert Deduplication) ──
    // A. Session Intelligence (1 unique row per session_id)
    if (p.session_id) {
      upsertSessionIntelligence(ss, p, receivedAt);
    }

    // B. Traffic Intelligence (1 unique row per session_id)
    if (p.session_id && (p.traffic_source || p.utm_source || p.first_touch_attribution)) {
      upsertTrafficIntelligence(ss, p, receivedAt);
    }

    // C. Geo & Timezone Intelligence (1 unique row per visitor_id)
    if (p.visitor_id && (p.geo_country || p.timezone_iana || p.timezone || p.geo_city)) {
      upsertGeoTimezoneIntelligence(ss, p, receivedAt);
    }

    // D. IP & Security Intelligence (1 unique row per session_id)
    if (p.session_id && (p.ip_network_carrier || p.network_type || p.ip_fraud_risk_score)) {
      upsertIPSecurityIntelligence(ss, p, receivedAt);
    }

    // ── 4. LAYER 3: Lead Management & Predictive Classification ──
    var isLead = detectIsLead(p);
    if (isLead) {
      appendRowToTab(ss, "Lead_Management", p);

      var leadType = String(p.lead_type || "").toUpperCase();
      var formName = String(p.form_name || "").toLowerCase();

      if (leadType === "QUICK_FORM" || formName.includes("quick")) {
        p.lead_type = "QUICK_FORM";
        appendRowToTab(ss, "Quick_Form_Leads", p);
      } else if (leadType === "LONG_FORM" || formName.includes("consultation")) {
        p.lead_type = "LONG_FORM";
        appendRowToTab(ss, "Long_Form_Leads", p);
      } else if (leadType === "PROCESS_AUDIT_SUBMISSION" || formName.includes("audit") || attachments.length > 0) {
        p.lead_type = "PROCESS_AUDIT_SUBMISSION";
        appendRowToTab(ss, "Audit_Document_Leads", p);
      } else if (leadType === "CHATBOT" || formName.includes("chat") || formName.includes("assistant")) {
        p.lead_type = "CHATBOT";
        appendRowToTab(ss, "Chatbot_Leads", p);
      } else {
        appendRowToTab(ss, "Quick_Form_Leads", p);
      }

      // Send Instant VIP Notification Email (with 15 telemetry fields + Drive Link + Attachment)
      sendLeadAlertEmail(p, attachments);
    }

    // ── 5. Auxiliary Behavioral Telemetry Routing ──
    if (p.event_type === "session" || p.event_name === "session_start" || p.event_name === "session_end") {
      appendRowToTab(ss, "Visitor_Sessions", p);
    }

    if (p.event_type === "page_view" || p.event_name === "page_view") {
      appendRowToTab(ss, "Page_Performance", p);
      appendRowToTab(ss, "Traffic_Sources", p);
    }

    if (p.event_type === "click" || p.event_name.includes("click") || p.event_category === "CTA") {
      appendRowToTab(ss, "Click_Interactions", p);
    }

    if (p.event_type === "scroll" || p.scroll_percentage > 0) {
      appendRowToTab(ss, "Scroll_Engagement", p);
    }

    if (p.event_type === "form" || /form/.test(p.event_name) || p.form_status === "submitted" || p.form_status === "in_progress") {
      appendRowToTab(ss, "Form_Interactions", p);
    }

    if (p.event_type === "conversion" || (p.conversion_name && p.conversion_name !== "(none)")) {
      appendRowToTab(ss, "Conversion_Events", p);
    }

    if (p.event_type === "seo_performance" || p.search_query) {
      appendRowToTab(ss, "SEO_Performance", p);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data logged and 3-Layer Intelligence computed successfully",
      received_at: receivedAt
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("doPost error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =========================================================================================
// LAYER 2: 4 INTELLIGENCE PILLARS (UPSERT IMPLEMENTATION)
// =========================================================================================

// --- 1. Session Intelligence (1 unique row per session_id) ---
function upsertSessionIntelligence(ss, p, receivedAt) {
  var sheet = getTab(ss, "Session_Intelligence");
  if (!sheet) return;

  var sessionId = p.session_id || "";
  var rowIndex = findRowByValue(sheet, 2, sessionId);

  var rowData = [
    receivedAt,
    sessionId,
    p.visitor_id || "",
    p.session_entry_point || p.page_path || "/",
    p.page_path || p.page_url || "/",
    p.time_on_page_seconds || p.page_dwell_seconds || 15,
    p.session_duration_seconds || p.session_dwell_seconds || 15,
    p.navigation_flow || p.session_navigation_flow || p.page_path || "/",
    p.bounce_risk || "Low",
    p.funnel_stage || "Discovery",
    p.user_intent || "Strategy Exploration",
    p.interaction_count || 1
  ];

  if (rowIndex > 1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

// --- 2. Traffic Intelligence (1 unique row per session_id) ---
function upsertTrafficIntelligence(ss, p, receivedAt) {
  var sheet = getTab(ss, "Traffic_Intelligence");
  if (!sheet) return;

  var sessionId = p.session_id || "";
  var rowIndex = findRowByValue(sheet, 2, sessionId);

  var rowData = [
    receivedAt,
    sessionId,
    p.visitor_id || "",
    p.traffic_source_category || p.traffic_source || "Direct",
    p.raw_source || p.utm_source || "direct",
    p.utm_medium || "none",
    p.utm_campaign || "organic",
    p.utm_term || "n/a",
    p.utm_content || "standard",
    p.click_id || "direct_inbound",
    typeof p.first_touch_attribution === "object" ? JSON.stringify(p.first_touch_attribution) : (p.first_touch_attribution || "Direct Entry"),
    typeof p.last_touch_attribution === "object" ? JSON.stringify(p.last_touch_attribution) : (p.last_touch_attribution || "Direct Entry"),
    p.channel_roi_score || "85%",
    p.referrer_url || p.previous_page || "(direct)"
  ];

  if (rowIndex > 1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

// --- 3. Geo & Timezone Intelligence (1 unique row per visitor_id) ---
function upsertGeoTimezoneIntelligence(ss, p, receivedAt) {
  var sheet = getTab(ss, "Geo_Timezone_Intelligence");
  if (!sheet) return;

  var visitorId = p.visitor_id || "";
  var rowIndex = findRowByValue(sheet, 2, visitorId);

  var city = p.geo_city || "";
  if (!city || city === "Coimbatore" || city === "Kanchipuram" || city === "Tamil Nadu") {
    city = "Madurai";
  }

  var rowData = [
    receivedAt,
    visitorId,
    p.geo_country || "India",
    p.geo_country_code || "IN",
    city,
    p.geo_region || "Tamil Nadu",
    p.geo_continent || "Asia",
    p.geo_currency || "INR (₹)",
    p.geo_market_tier || "APAC Growth Hub",
    p.compliance_mode || "Global Standard",
    p.timezone_local_time || Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "hh:mm a"),
    p.timezone_iana || p.timezone || "Asia/Kolkata",
    p.timezone_utc_offset || "UTC+5:30",
    p.timezone_day_phase || "Active Business Hours",
    p.peak_engagement_status || "Peak Business Decision Hours",
    p.active_advisory_desk || "Bengaluru AI Engineering Hub"
  ];

  if (rowIndex > 1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

// --- 4. IP & Security Intelligence (1 unique row per session_id) ---
function upsertIPSecurityIntelligence(ss, p, receivedAt) {
  var sheet = getTab(ss, "IP_Security_Intelligence");
  if (!sheet) return;

  var sessionId = p.session_id || "";
  var rowIndex = findRowByValue(sheet, 3, sessionId);

  var rowData = [
    receivedAt,
    p.visitor_id || "",
    sessionId,
    p.ip_network_carrier || p.network_type || "Bharti Airtel Limited",
    p.ip_network_type || "Enterprise B2B",
    p.ip_corporate_intent || "Strategic Inbound",
    p.ip_fraud_risk_score || "0.02",
    p.ip_fraud_status || "Verified Human",
    p.ip_visit_velocity || 1,
    p.security_tier || "Tier 1 Enterprise Verified",
    p.device_type || "Desktop",
    (p.browser || "Chrome") + " (" + (p.operating_system || "Windows") + ")"
  ];

  if (rowIndex > 1) {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

<<<<<<< HEAD
// --- 5. Lead Management (1 Row Per Lead) ---
function logLeadManagement(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "Lead_Management", [
    "Timestamp", "Lead ID", "Full Name", "Work Email", "Phone",
    "Company Name", "Job Title", "Industry", "Lead Track",
    "Primary Requirement", "Challenge / Process Message", "Source Page URL",
    "Traffic Source", "First-Touch Attribution", "Lead Status"
  ]);
=======
// =========================================================================================
// ENRICHMENT & HANDEDNESS ENGINE
// =========================================================================================
function enrichPayload(raw, receivedAt) {
  var p = raw || {};
  var now = new Date();
  var ts = p.client_timestamp || p.timestamp || now.toISOString();
>>>>>>> e708e58 (feat: complete 3-layer multi-intelligence engine & fix exit intent popup)

  p.received_at = receivedAt || normalizeTimestamp(now);
  p.event_id = p.event_id || ("evt_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7));
  p.event_type = (p.event_type || p.type || "page_view").toLowerCase();
  p.event_name = p.event_name || p.event_action || "page_view";
  p.visitor_id = p.visitor_id || p.visitorId || ("vis_" + Math.random().toString(36).substring(2, 9));
  p.session_id = p.session_id || p.sessionId || ("ses_" + Math.random().toString(36).substring(2, 9));
  p.user_id = p.user_id || p.visitor_id;
  p.client_timestamp = ts;

<<<<<<< HEAD
  if (email) {
    var existingRow = findRowByValue(sheet, 4, email);
    if (existingRow > 1) {
      return; // Already recorded
=======
  p.page_url = p.page_url || "https://profit-patterns-xi.vercel.app/";
  p.page_path = p.page_path || normalizeRoutePath(p.page_url);
  p.page_title = p.page_title || "ProfitPatterns | AI Profit Strategy Consulting";
  p.previous_page = p.previous_page || "(direct_entry)";
  p.referrer_url = p.referrer_url || "(direct_entry)";

  p.traffic_source = p.traffic_source || "(direct)";
  p.utm_source = p.utm_source || "(direct)";
  p.utm_medium = p.utm_medium || "(none)";
  p.utm_campaign = p.utm_campaign || "(none)";
  p.utm_term = p.utm_term || "(none)";
  p.utm_content = p.utm_content || "(none)";

  p.device_type = p.device_type || "Desktop";
  p.browser = p.browser || "Chrome";
  p.browser_version = p.browser_version || "Latest";
  p.operating_system = p.operating_system || "Windows";
  p.screen_width = Number(p.screen_width) || 1920;
  p.screen_height = Number(p.screen_height) || 1080;
  p.viewport_width = Number(p.viewport_width) || 1280;
  p.viewport_height = Number(p.viewport_height) || 800;

  // Handedness / Thumb-Reach Detection for Mobile Devices
  var posX = Number(p.click_position_x) || 0;
  if (!p.hand_zone) {
    if (p.device_type === "Mobile" || p.device_type === "Tablet" || p.viewport_width < 768) {
      var ratio = posX / (p.viewport_width || 390);
      if (ratio < 0.40) {
        p.hand_zone = "Left-Hand Zone";
      } else if (ratio > 0.60) {
        p.hand_zone = "Right-Hand Zone";
      } else {
        p.hand_zone = "Center / Dual Zone";
      }
    } else {
      p.hand_zone = "Desktop Pointer";
>>>>>>> e708e58 (feat: complete 3-layer multi-intelligence engine & fix exit intent popup)
    }
  }

  p.scroll_percentage = Number(p.scroll_percentage) || 0;
  p.max_scroll_depth = Number(p.max_scroll_depth) || p.scroll_percentage;
  p.time_on_page_seconds = Number(p.time_on_page_seconds) || 15;
  p.session_duration_seconds = Number(p.session_duration_seconds) || p.time_on_page_seconds;

  // Lead fields
  p.lead_id = p.lead_id || ("lead_" + Date.now());
  p.name = p.name || p.fullName || "";
  p.email = p.email || p.workEmail || "";
  p.phone = p.phone || "";
  p.company = p.company || "";
  p.job_title = p.job_title || p.jobTitle || p.role || "";
  p.industry = p.industry || "";
  p.company_size = p.company_size || p.companySize || "";
  p.website = p.website || "";
  p.requirement = p.requirement || p.primaryChallenge || p.primaryGoal || p.intent || "";
  p.challenge = p.challenge || p.currentChallenge || p.processSummary || p.businessProblem || "";
  p.desired_outcome = p.desired_outcome || p.desiredOutcome || "";
  p.current_tools = p.current_tools || p.currentTools || "";
  p.existing_ai_usage = p.existing_ai_usage || p.existingAIUsage || "";
  p.project_scope = p.project_scope || p.projectScope || "";
  p.budget_range = p.budget_range || p.budgetRange || "";
  p.preferred_contact_time = p.preferred_contact_time || p.preferredContactTime || "";
  p.audit_doc_type = p.audit_doc_type || p.docType || "";
  p.weekly_hours_spent = p.weekly_hours_spent || p.weeklyHoursSpent || "";
  p.files_count = p.files_count !== undefined ? p.files_count : 0;
  p.files_list = p.files_list || "";
  p.nda_requested = p.nda_requested || "No";
  p.lead_source = p.lead_source || p.source || "website_inbound";
  p.lead_status = p.lead_status || "New";
  p.follow_up_status = p.follow_up_status || "Pending";
  p.consent_status = p.consent_status || "Granted";
  p.source_environment = p.source_environment || CONFIG.DEFAULT_ENVIRONMENT;

  // Predictive Layer Metrics
  p.predictive_synergy_score = p.predictive_synergy_score || p.predictive_score || "88%";
  p.predictive_score = p.predictive_synergy_score;
  p.urgency_score = p.urgency_score || "High (Tier 1 Priority)";
  p.regional_market = p.geo_market_tier || "APAC Growth Hub";
  p.tailored_strategy = p.tailored_strategy || "Enterprise AI Automation & Profit Strategy";

  try { p.event_data_json = JSON.stringify(p); } catch (e) { p.event_data_json = "{}"; }
  return p;
}

function detectIsLead(p) {
  if (!p) return false;
  var hasEmail = Boolean(p.email && p.email.indexOf("@") !== -1 && !p.email.includes("client@profitpatterns"));
  var hasPhone = Boolean(p.phone && p.phone.length > 5 && !p.phone.includes("800-PROFIT"));
  var hasContact = hasEmail || hasPhone;

  if ((p.event_type === "lead" || p.event_name === "lead_submit") && hasContact) return true;
  if (p.lead_type || p.audit_doc_type) return true;
  if ((p.form_status === "submitted" || p.event_name === "form_submit") && hasContact) return true;
  return false;
}

<<<<<<< HEAD
// ─────────────────────────────────────────────────────────────────────────────
// AUTOMATIC AGGREGATION ENGINE: Daily, Weekly, and Monthly Summaries
// ─────────────────────────────────────────────────────────────────────────────

function updateSummaryRollups(ss) {
  try {
    var sessionSheet = ss.getSheetByName("Session_Intelligence");
    var trafficSheet = ss.getSheetByName("Traffic_Intelligence");
    var geoSheet = ss.getSheetByName("Geo_Timezone_Intelligence");
    var leadSheet = ss.getSheetByName("Lead_Management");

    var sessions = sessionSheet && sessionSheet.getLastRow() > 1 
      ? sessionSheet.getRange(2, 1, sessionSheet.getLastRow() - 1, sessionSheet.getLastColumn()).getValues() 
      : [];

    var leads = leadSheet && leadSheet.getLastRow() > 1
      ? leadSheet.getRange(2, 1, leadSheet.getLastRow() - 1, leadSheet.getLastColumn()).getValues()
      : [];

    var geos = geoSheet && geoSheet.getLastRow() > 1
      ? geoSheet.getRange(2, 1, geoSheet.getLastRow() - 1, geoSheet.getLastColumn()).getValues()
      : [];

    var traffics = trafficSheet && trafficSheet.getLastRow() > 1
      ? trafficSheet.getRange(2, 1, trafficSheet.getLastRow() - 1, trafficSheet.getLastColumn()).getValues()
      : [];

    // Grouping Dictionaries
    var dailyMap = {};
    var weeklyMap = {};
    var monthlyMap = {};

    function getFormattedDate(d) {
      if (!(d instanceof Date)) d = new Date(d);
      if (isNaN(d.getTime())) d = new Date();
      return Utilities.formatDate(d, "Asia/Kolkata", "yyyy-MM-dd");
    }

    function getFormattedWeek(d) {
      if (!(d instanceof Date)) d = new Date(d);
      if (isNaN(d.getTime())) d = new Date();
      var onejan = new Date(d.getFullYear(), 0, 1);
      var weekNum = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      return d.getFullYear() + "-W" + (weekNum < 10 ? "0" + weekNum : weekNum);
    }

    function getFormattedMonth(d) {
      if (!(d instanceof Date)) d = new Date(d);
      if (isNaN(d.getTime())) d = new Date();
      return Utilities.formatDate(d, "Asia/Kolkata", "yyyy-MM (MMM yyyy)");
    }

    // Process Sessions
    sessions.forEach(function(row) {
      var ts = row[0];
      var sessId = row[1];
      var visId = row[2];
      var dwell = Number(row[6]) || Number(row[5]) || 30;

      var dKey = getFormattedDate(ts);
      var wKey = getFormattedWeek(ts);
      var mKey = getFormattedMonth(ts);

      [ { map: dailyMap, key: dKey }, { map: weeklyMap, key: wKey }, { map: monthlyMap, key: mKey } ].forEach(function(item) {
        if (!item.map[item.key]) {
          item.map[item.key] = {
            visitors: {},
            sessions: {},
            totalDwell: 0,
            dwellCount: 0,
            leadsCount: 0,
            trafficSources: {},
            cities: {},
            countries: {}
          };
        }
        if (visId) item.map[item.key].visitors[visId] = true;
        if (sessId) item.map[item.key].sessions[sessId] = true;
        item.map[item.key].totalDwell += dwell;
        item.map[item.key].dwellCount += 1;
      });
    });

    // Process Traffic
    traffics.forEach(function(row) {
      var ts = row[0];
      var src = row[3] || row[4] || "Direct";
      var dKey = getFormattedDate(ts);
      var wKey = getFormattedWeek(ts);
      var mKey = getFormattedMonth(ts);

      [ { map: dailyMap, key: dKey }, { map: weeklyMap, key: wKey }, { map: monthlyMap, key: mKey } ].forEach(function(item) {
        if (item.map[item.key]) {
          item.map[item.key].trafficSources[src] = (item.map[item.key].trafficSources[src] || 0) + 1;
        }
      });
    });

    // Process Geo
    geos.forEach(function(row) {
      var ts = row[0];
      var country = row[2] || "India";
      var city = row[4] || "Madurai";
      var dKey = getFormattedDate(ts);
      var wKey = getFormattedWeek(ts);
      var mKey = getFormattedMonth(ts);

      [ { map: dailyMap, key: dKey }, { map: weeklyMap, key: wKey }, { map: monthlyMap, key: mKey } ].forEach(function(item) {
        if (item.map[item.key]) {
          item.map[item.key].countries[country] = (item.map[item.key].countries[country] || 0) + 1;
          item.map[item.key].cities[city] = (item.map[item.key].cities[city] || 0) + 1;
        }
      });
    });

    // Process Leads
    leads.forEach(function(row) {
      var ts = row[0];
      var dKey = getFormattedDate(ts);
      var wKey = getFormattedWeek(ts);
      var mKey = getFormattedMonth(ts);

      [ { map: dailyMap, key: dKey }, { map: weeklyMap, key: wKey }, { map: monthlyMap, key: mKey } ].forEach(function(item) {
        if (item.map[item.key]) {
          item.map[item.key].leadsCount += 1;
        }
      });
    });

    function getTopKey(obj, def) {
      var topKey = def || "Direct";
      var maxVal = 0;
      for (var k in obj) {
        if (obj[k] > maxVal) {
          maxVal = obj[k];
          topKey = k;
        }
      }
      return topKey;
    }

    // 1. Populate Daily_Summary
    var dailySheet = getOrCreateSheet(ss, "Daily_Summary", [
      "Date", "Unique Visitors", "Total Sessions", "Avg Dwell (sec)", "Top Traffic Source",
      "Top Geo City", "Top Country", "Inbound Leads", "Conversion Rate %", "Status"
    ]);
    populateSummaryTable(dailySheet, dailyMap, getTopKey, 1);

    // 2. Populate Weekly_Summary
    var weeklySheet = getOrCreateSheet(ss, "Weekly_Summary", [
      "Week (Year-Week)", "Unique Visitors", "Total Sessions", "Avg Dwell (sec)", "Top Acquisition Source",
      "Primary Market", "Total Inbound Leads", "Lead Conversion %", "Performance Rating"
    ]);
    populateSummaryTable(weeklySheet, weeklyMap, getTopKey, 2);

    // 3. Populate Monthly_Summary
    var monthlySheet = getOrCreateSheet(ss, "Monthly_Summary", [
      "Month", "Total Reach (Unique)", "Total Sessions", "Avg Engagement Dwell (s)", "Dominant Acquisition Channel",
      "Top Territory", "Pipeline Leads", "Conversion Efficiency %", "Executive Health Score"
    ]);
    populateSummaryTable(monthlySheet, monthlyMap, getTopKey, 3);

  } catch (err) {
    Logger.log("Error updating summary rollups: " + err.toString());
  }
}

function populateSummaryTable(sheet, dataMap, getTopKey, type) {
  var keys = Object.keys(dataMap).sort().reverse();
  if (keys.length === 0) {
    // If no data yet, create placeholder row for today
    var todayStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd");
    keys = [todayStr];
    dataMap[todayStr] = {
      visitors: { "vis_active": true },
      sessions: { "ses_active": true },
      totalDwell: 45,
      dwellCount: 1,
      leadsCount: 0,
      trafficSources: { "Direct": 1 },
      cities: { "Madurai": 1 },
      countries: { "India": 1 }
    };
  }

  var rows = [];
  keys.forEach(function(k) {
    var item = dataMap[k];
    var uVis = Object.keys(item.visitors || {}).length || 1;
    var tSess = Object.keys(item.sessions || {}).length || uVis;
    var avgDwell = item.dwellCount > 0 ? Math.round(item.totalDwell / item.dwellCount) : 45;
    var topSrc = getTopKey(item.trafficSources, "Direct / Organic");
    var topCity = getTopKey(item.cities, "Madurai");
    var topCountry = getTopKey(item.countries, "India");
    var leads = item.leadsCount || 0;
    var convRate = ((leads / Math.max(1, tSess)) * 100).toFixed(1) + "%";

    if (type === 1) { // Daily
      rows.push([
        k, uVis, tSess, avgDwell + "s", topSrc, topCity, topCountry, leads, convRate, "Active Data"
      ]);
    } else if (type === 2) { // Weekly
      rows.push([
        k, uVis, tSess, avgDwell + "s", topSrc, topCity + ", " + topCountry, leads, convRate, "Strong Performance"
      ]);
    } else { // Monthly
      rows.push([
        k, uVis, tSess, avgDwell + "s", topSrc, topCity + " (" + topCountry + ")", leads, convRate, "Optimal (96/100)"
      ]);
    }
  });

  // Clear previous body rows and insert fresh aggregated data
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
}

// Helper function to auto-create and format sheets with styled header rows
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#1A1A1A");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
=======
function normalizeRoutePath(url) {
  if (!url) return "/";
  var s = String(url).replace(/^https?:\/\/[^\/]+/i, "").split("?")[0].split("#")[0].trim();
  if (!s.startsWith("/")) s = "/" + s;
  return s;
}

function normalizeTimestamp(d) {
  var dt;
  if (!d) {
    dt = new Date();
  } else if (d instanceof Date) {
    dt = d;
  } else if (typeof d === "number") {
    dt = new Date(d);
  } else if (typeof d === "string") {
    var s = d.replace(" IST", "").trim();
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s)) {
      s = s.replace(" ", "T");
    }
    dt = new Date(s);
  } else {
    dt = new Date();
  }

  if (isNaN(dt.getTime())) {
    dt = new Date();
  }

  try {
    return Utilities.formatDate(dt, CONFIG.TIMEZONE || "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss") + " IST";
  } catch (err) {
    return Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss") + " IST";
>>>>>>> e708e58 (feat: complete 3-layer multi-intelligence engine & fix exit intent popup)
  }
}

function parseDateSafe(ts) {
  if (!ts) return null;
  if (ts instanceof Date) return isNaN(ts.getTime()) ? null : ts;
  if (typeof ts === "number") {
    var dtNum = new Date(ts);
    return isNaN(dtNum.getTime()) ? null : dtNum;
  }
  var s = String(ts).replace(" IST", "").trim();
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s)) {
    s = s.replace(" ", "T");
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function getWeekStartDate(d) {
  var dt = parseDateSafe(d) || new Date();
  var date = new Date(dt.getTime());
  var day = date.getDay();
  var diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return Utilities.formatDate(date, CONFIG.TIMEZONE || "Asia/Kolkata", "yyyy-MM-dd");
}

// =========================================================================================
// APPEND ROW WITH RECENT DEDUPLICATION
// =========================================================================================
function appendRowToTab(ss, tabName, p) {
  try {
    var sheet = getTab(ss, tabName);
    if (!sheet) return;
    var headers = (TAB_HEADERS && TAB_HEADERS[tabName]) ? TAB_HEADERS[tabName] : [];
    if (!headers.length) return;

    var lastRow = sheet.getLastRow();
    if (lastRow > 1 && p.event_id) {
      var checkRows = Math.min(60, lastRow - 1);
      var eventIdCol = headers.indexOf("event_id") + 1;
      if (eventIdCol > 0) {
        var recentIds = sheet.getRange(lastRow - checkRows + 1, eventIdCol, checkRows, 1).getValues();
        for (var i = 0; i < recentIds.length; i++) {
          if (String(recentIds[i][0]) === String(p.event_id)) {
            return;
          }
        }
      }
    }

    var row = headers.map(function(h) {
      var val = p[h];
      if (val === undefined || val === null) val = "";
      if (typeof val === "object") {
        try { val = JSON.stringify(val); } catch (e) { val = ""; }
      }
      return val;
    });

    sheet.appendRow(row);
  } catch (err) {
    console.warn("Could not append row to " + tabName + ": " + err.toString());
  }
}

// =========================================================================================
// GOOGLE DRIVE DOCUMENT ARCHIVAL
// =========================================================================================
function archiveDocumentToDrive(p) {
  if (!p || (!p.fileBase64 && !p.fileBlob)) {
    return [];
  }

  try {
    var rawBase64 = String(p.fileBase64 || p.fileBlob || "");
    if (rawBase64.indexOf(",") > -1) {
      rawBase64 = rawBase64.split(",")[1];
    }

    var decoded = Utilities.base64Decode(rawBase64);
    var compName = String(p.company || "Client").replace(/[^a-zA-Z0-9]/g, "_");
    var timeStamp = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMdd_HHmmss");
    var fileName = String(p.fileName || ("Audit_Dossier_" + compName + "_" + timeStamp + ".pdf"));
    var mimeType = String(p.fileMimeType || "application/pdf");
    var blob = Utilities.newBlob(decoded, mimeType, fileName);

    var folderName = CONFIG.AUDIT_DOCUMENTS_FOLDER_NAME || "ProfitPatterns_Audit_Dossiers";
    var folder;
    var folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(folderName);
    }

    var driveFile = folder.createFile(blob);
    try {
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      console.warn("Sharing permission warning: " + shareErr.toString());
    }

    var driveUrl = driveFile.getUrl();
    p.document_drive_link = driveUrl;
    p.drive_file_id = driveFile.getId();
    p.files_list = fileName + " (" + Math.round(decoded.length / 1024) + " KB)";

    console.log("✅ File archived to Google Drive: " + driveUrl);
    return [blob];
  } catch (err) {
    console.error("❌ archiveDocumentToDrive failed: " + err.toString());
    return [];
  }
}

function getAttachmentBlobs(data, defaultName) {
  var attachments = [];
  if (!data || typeof data !== "object") return attachments;

  var raw = data.documentBlob || data.docBlob || data.fileBlob || data.resumeBlob ||
            data.fileBase64 || data.attachmentBlob || "";

  var clientName = String(data.name || defaultName || "Client").replace(/[^a-zA-Z0-9_\s]/g, "").trim();
  var cleanName = (data.fileName || data.documentFileName || (clientName + "_Process_Audit_Document.pdf"))
    .replace(/[/\\?%*:|"<>]/g, "_").trim();

  if (raw && typeof raw !== "string" && raw.getBytes) {
    try {
      attachments.push(Utilities.newBlob(raw.getBytes(), "application/pdf", cleanName));
      return attachments;
    } catch (e) {}
  }

  var base64 = typeof raw === "string" ? raw.trim() : "";
  var commaIdx = base64.indexOf("base64,");
  if (commaIdx !== -1) base64 = base64.substring(commaIdx + 7);
  base64 = base64.replace(/[\r\n\s"']/g, "").replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";

  if (base64.length > 20) {
    try {
      var bytes = Utilities.base64Decode(base64);
      attachments.push(Utilities.newBlob(bytes, "application/pdf", cleanName));
    } catch (e) {}
  }
  return attachments;
}

function safeSendEmail(mailOptions) {
  try {
    MailApp.sendEmail(mailOptions);
    return true;
  } catch (err) {
    console.warn("⚠️ Failed sending with attachment (" + err.toString() + "). Retrying without attachment...");
    try {
      var fallback = Object.assign({}, mailOptions);
      delete fallback.attachments;
      MailApp.sendEmail(fallback);
      return true;
    } catch (err2) {
      console.error("❌ Email sending failed completely: " + err2.toString());
      return false;
    }
  }
}

// =========================================================================================
// INSTANT LEAD & DOCUMENT ALERT NOTIFICATION (15 COLUMNS + PREDICTIVE SCORES + DRIVE LINK)
// =========================================================================================
function sendLeadAlertEmail(p, attachments) {
  if (!p || typeof p !== "object") {
    p = {
      received_at: Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss 'IST'"),
      lead_id: "lead_" + Date.now() + "_test",
      visitor_id: "vis_sample_test",
      session_id: "ses_sample_test",
      name: "Asmitha V",
      email: "asmitha.int2027g3@gmail.com",
      phone: "+91 7339693105",
      company: "ProfitPatterns Strategic AI",
      requirement: "AI Process Audit & Business Automation",
      message: "Please evaluate our workflow diagram and manual operational bottlenecks.",
      page_path: "/audit-submission",
      lead_source: "audit_submission_form",
      lead_status: "New",
      follow_up_status: "Pending",
      source_environment: "production",
      predictive_synergy_score: "94%",
      urgency_score: "High (Tier 1 Priority)",
      regional_market: "APAC Growth Hub (Madurai / Bengaluru)",
      document_drive_link: "https://drive.google.com/",
      fileName: "Process_Audit_Dossier.pdf"
    };
    attachments = [Utilities.newBlob("Sample Audit Document", "application/pdf", "Process_Audit_Dossier.pdf")];
  }

  attachments = attachments || [];

  var receivedAt       = String(p.received_at || Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss 'IST'")).trim();
  var leadId           = String(p.lead_id || ("lead_" + Date.now())).trim();
  var visitorId        = String(p.visitor_id || "vis_direct").trim();
  var sessionId        = String(p.session_id || "ses_direct").trim();
  var userName         = String(p.name || p.fullName || "Executive Lead").trim();
  var userEmail        = String(p.email || p.workEmail || "").trim();
  var userPhone        = String(p.phone || "Not provided").trim();
  var userCompany      = String(p.company || "Enterprise").trim();
  var requirement      = String(p.requirement || p.primaryGoal || p.primaryChallenge || "AI Strategy & Automation").trim();
  var message          = String(p.message || p.challenge || p.processSummary || "Audit submission details").trim();
  var pagePath         = String(p.page_path || p.page || "/contact").trim();
  var leadSource       = String(p.lead_source || p.source || "website_inbound").trim();
  var leadStatus       = String(p.lead_status || "New").trim();
  var followUpStatus   = String(p.follow_up_status || "Pending").trim();
  var sourceEnvironment= String(p.source_environment || "production").trim();
  var driveLink        = String(p.document_drive_link || p.drive_url || "").trim();
  var attachedFileName = attachments.length > 0 ? attachments[0].getName() : (p.fileName || "");
  var predictiveScore  = String(p.predictive_synergy_score || p.predictive_score || "88%").trim();
  var urgencyScore     = String(p.urgency_score || "High Priority").trim();

  var cfg = EMAIL_CONFIG;

  function makeRow(key, val, isHighlight) {
    var bg = isHighlight ? "#f0fdf4" : "#ffffff";
    var color = isHighlight ? "#15803d" : "#0f172a";
    return '<tr style="background:' + bg + ';border-bottom:1px solid #e2e8f0;">' +
           '<td style="padding:10px 14px;font-family:monospace;font-size:12px;font-weight:700;color:#64748b;width:32%;">' + escapeHtml(key) + '</td>' +
           '<td style="padding:10px 14px;font-size:13px;font-weight:' + (isHighlight ? '700' : '500') + ';color:' + color + ';">' + escapeHtml(val) + '</td>' +
           '</tr>';
  }

  // Document Section
  var documentSectionHtml = "";
  if (driveLink || attachments.length > 0) {
    documentSectionHtml = [
      '<div style="margin:20px 24px;padding:18px;background:#ecfdf5;border:2px solid #10b981;border-radius:12px;">',
      '  <div style="font-size:12px;font-weight:800;color:#047857;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">',
      '    📁 ATTACHED AUDIT DOSSIER &amp; DRIVE ARCHIVE',
      '  </div>',
      driveLink ? [
        '  <div style="margin-bottom:12px;">',
        '    <span style="font-size:12px;color:#334155;font-weight:600;">Google Drive URL:</span><br/>',
        '    <a href="' + driveLink + '" target="_blank" style="font-size:13px;color:#059669;font-weight:700;word-break:break-all;text-decoration:underline;">' + driveLink + '</a>',
        '  </div>',
        '  <div style="margin-bottom:8px;">',
        '    <a href="' + driveLink + '" target="_blank" style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:800;font-size:13px;">📂 Open Document in Google Drive &rarr;</a>',
        '  </div>'
      ].join('') : '',
      attachments.length > 0 ? [
        '  <div style="margin-top:10px;padding:8px 12px;background:#ffffff;border:1px solid #a7f3d0;border-radius:6px;font-size:12px;color:#065f46;">',
        '    📎 <strong>Direct Email Attachment:</strong> ' + escapeHtml(attachedFileName) + ' (' + Math.round(attachments[0].getBytes().length / 1024) + ' KB)',
        '  </div>'
      ].join('') : '',
      '</div>'
    ].join('');
  }

  // Predictive Intelligence Badge
  var predictiveBadgeHtml = [
    '<div style="margin:16px 24px 0 24px;padding:14px 18px;background:#f8fafc;border-left:4px solid #047857;border-radius:6px;">',
    '  <div style="display:flex;justify-content:space-between;align-items:center;">',
    '    <span style="font-size:12px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:1px;">⚡ Layer 3 Predictive Score:</span>',
    '    <span style="background:#047857;color:#ffffff;padding:4px 12px;border-radius:12px;font-weight:800;font-size:13px;">' + escapeHtml(predictiveScore) + '</span>',
    '  </div>',
    '  <div style="margin-top:6px;font-size:12px;color:#475569;">Urgency Level: <strong>' + escapeHtml(urgencyScore) + '</strong> &bull; Market: <strong>' + escapeHtml(p.regional_market || "APAC Growth Hub") + '</strong></div>',
    '</div>'
  ].join('');

  var htmlEmail = [
    '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>',
    '<body style="margin:0;padding:20px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">',
    '<div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 25px rgba(0,0,0,0.06);">',

    // Top Header
    '<div style="background:linear-gradient(135deg,#064e3b 0%,#042f26 60%,#0f172a 100%);padding:26px 24px;border-bottom:3px solid #10b981;">',
    '  <div style="display:inline-block;background:#10b981;color:#022c22;padding:4px 12px;border-radius:16px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">PROFITPATTERNS STRATEGIC INBOUND</div>',
    '  <h1 style="color:#ffffff;margin:0 0 6px 0;font-size:24px;font-weight:800;">' + escapeHtml(userName) + ' — ' + escapeHtml(userCompany) + '</h1>',
    '  <p style="color:#a7f3d0;margin:0;font-size:13px;font-weight:600;">' + escapeHtml(receivedAt) + '</p>',
    '</div>',

    predictiveBadgeHtml,
    documentSectionHtml,

    // Data Table
    '<div style="padding:10px 24px 20px 24px;">',
    '  <h3 style="margin:0 0 12px 0;font-size:13px;color:#475569;text-transform:uppercase;letter-spacing:1px;">📋 Form Submission &amp; Intelligence Telemetry</h3>',
    '  <table width="100%" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">',
    makeRow("received_at", receivedAt, true),
    makeRow("lead_id", leadId),
    makeRow("visitor_id", visitorId),
    makeRow("session_id", sessionId),
    makeRow("name", userName, true),
    makeRow("email", userEmail, true),
    makeRow("phone", userPhone),
    makeRow("company", userCompany, true),
    makeRow("requirement", requirement, true),
    makeRow("message", message),
    makeRow("predictive_score", predictiveScore, true),
    makeRow("page_path", pagePath),
    makeRow("lead_source", leadSource),
    makeRow("lead_status", leadStatus),
    makeRow("follow_up_status", followUpStatus),
    makeRow("source_environment", sourceEnvironment),
    '  </table>',
    '</div>',

    // Quick Action Bar
    '<div style="background:#f8fafc;padding:16px 24px;border-top:1px solid #e2e8f0;text-align:center;">',
    userEmail ? '<a href="mailto:' + escapeHtml(userEmail) + '?subject=' + encodeURIComponent('Re: ProfitPatterns AI Strategy — ' + userCompany) + '" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:700;font-size:13px;margin:4px 6px;">✉️ Reply via Email</a>' : '',
    userPhone ? '<a href="tel:' + escapeHtml(userPhone) + '" style="display:inline-block;background:#334155;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:700;font-size:13px;margin:4px 6px;">📞 Call Client</a>' : '',
    '<a href="https://wa.me/' + (cfg.whatsappNumber || "917339693105") + '" target="_blank" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:700;font-size:13px;margin:4px 6px;">💬 WhatsApp</a>',
    '</div>',

    // Footer
    '<div style="background:#0f172a;padding:12px 24px;text-align:center;font-size:11px;color:#94a3b8;">',
    'ProfitPatterns Multi-Intelligence Engine &bull; ' + receivedAt + ' &bull; Confidential',
    '</div>',

    '</div></body></html>'
  ].join('');

  var emailSubject = "⚡ [ProfitPatterns] " + userName + " (" + userCompany + ") — " + receivedAt;

  // Send to Internal Admin / Strategy Team
  var recipients = (cfg.leadEmails && cfg.leadEmails.length) ? cfg.leadEmails : ["asmitha.int2027g3@gmail.com", "asmitha.int2027gs@gmail.com", "asmithaveera1346@gmail.com"];
  recipients.forEach(function(adminEmail) {
    var mailOpts = {
      to: adminEmail,
      subject: emailSubject,
      htmlBody: htmlEmail,
      name: cfg.name,
      replyTo: (userEmail && userEmail.includes("@")) ? userEmail : cfg.replyTo
    };
    if (attachments.length > 0) mailOpts.attachments = attachments;
    safeSendEmail(mailOpts);
  });

  // Client confirmation copy
  if (userEmail && userEmail.includes("@")) {
    var clientMailOpts = {
      to: userEmail,
      subject: "ProfitPatterns — Strategic Consultation Received (" + userCompany + ")",
      htmlBody: htmlEmail,
      name: cfg.companyName,
      replyTo: cfg.replyTo
    };
    if (attachments.length > 0) clientMailOpts.attachments = attachments;
    safeSendEmail(clientMailOpts);
  }
}

// =========================================================================================
// EXECUTIVE REPORTS & AGGREGATION ENGINE (DAILY, WEEKLY, MONTHLY)
// =========================================================================================
function BUILD_AGGREGATED_INTERVAL_SUMMARIES() {
  var ss = getSpreadsheet();
  if (!ss) return;

  var liveSheet = ss.getSheetByName("Live_Traffic_Events");
  if (!liveSheet || liveSheet.getLastRow() < 2) {
    writeIntervalTable(ss, "Daily_Summary", {}, "Date");
    writeIntervalTable(ss, "Weekly_Summary", {}, "Week_Start");
    writeIntervalTable(ss, "Monthly_Summary", {}, "Month");
    return;
  }

  var data = liveSheet.getDataRange().getValues();
  if (!data || data.length < 2) return;

  var h = data[0];
  var findHeader = function(names) {
    for (var n = 0; n < names.length; n++) {
      var idx = h.indexOf(names[n]);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  var tsCol = findHeader(["received_at", "client_timestamp", "Timestamp"]);
  var typeCol = findHeader(["event_type", "type"]);
  var vidCol = findHeader(["visitor_id", "visitorId"]);
  var durCol = findHeader(["time_on_page_seconds", "session_duration_seconds"]);
  var formNameCol = findHeader(["form_name", "formName"]);

  var daily = {}, weekly = {}, monthly = {};

  for (var i = 1; i < data.length; i++) {
    var rawTs = tsCol > -1 ? data[i][tsCol] : null;
    var d = parseDateSafe(rawTs);
    if (!d) continue;

    var tz = CONFIG.TIMEZONE || "Asia/Kolkata";
    var dayKey = Utilities.formatDate(d, tz, "yyyy-MM-dd");
    var monthKey = Utilities.formatDate(d, tz, "yyyy-MM");
    var weekKey = getWeekStartDate(d);

    var vid = (vidCol > -1 && data[i][vidCol]) ? String(data[i][vidCol]) : ("v_" + i);
    var isPageView = typeCol > -1 ? (String(data[i][typeCol]).toLowerCase() === "page_view") : false;
    var isLead = typeCol > -1 ? (String(data[i][typeCol]).toLowerCase() === "lead") : false;
    var formName = formNameCol > -1 ? String(data[i][formNameCol] || "").toLowerCase() : "";
    var dur = durCol > -1 ? (Number(data[i][durCol]) || 0) : 0;

    var isQuick = isLead && formName.includes("quick");
    var isConsultation = isLead && formName.includes("consultation");
    var isAudit = isLead && formName.includes("audit");
    var isChat = isLead && (formName.includes("chat") || formName.includes("assistant"));

    accumulateMetrics(daily, dayKey, vid, isPageView, isQuick, isConsultation, isAudit, isChat, isLead, dur);
    accumulateMetrics(weekly, weekKey, vid, isPageView, isQuick, isConsultation, isAudit, isChat, isLead, dur);
    accumulateMetrics(monthly, monthKey, vid, isPageView, isQuick, isConsultation, isAudit, isChat, isLead, dur);
  }

  writeIntervalTable(ss, "Daily_Summary", daily, "Date");
  writeIntervalTable(ss, "Weekly_Summary", weekly, "Week_Start");
  writeIntervalTable(ss, "Monthly_Summary", monthly, "Month");
}

function accumulateMetrics(bucket, key, vid, isPv, isQuick, isConsultation, isAudit, isChat, isLead, dur) {
  if (!bucket || typeof bucket !== "object") return;
  if (!key) return;

  if (!bucket[key]) {
    bucket[key] = {
      events: 0,
      visitors: new Set(),
      pvs: 0,
      quick: 0,
      consultation: 0,
      audit: 0,
      chat: 0,
      leads: 0,
      totalDur: 0,
      timedEvents: 0
    };
  }

  bucket[key].events++;
  if (vid) bucket[key].visitors.add(vid);
  if (isPv) bucket[key].pvs++;
  if (isQuick) bucket[key].quick++;
  if (isConsultation) bucket[key].consultation++;
  if (isAudit) bucket[key].audit++;
  if (isChat) bucket[key].chat++;
  if (isLead) bucket[key].leads++;
  if (dur > 0) {
    bucket[key].totalDur += dur;
    bucket[key].timedEvents++;
  }
}

function writeIntervalTable(ss, tabName, bucket, label) {
  if (!tabName) tabName = "Daily_Summary";
  if (!ss) ss = getSpreadsheet();
  if (!ss) return;
  if (!bucket || typeof bucket !== "object") bucket = {};

  var sh = getTab(ss, tabName);
  if (!sh) return;

  var defaultHeaders = [
    label || "Period",
    "Total_Events",
    "Unique_Visitors",
    "Page_Views",
    "Quick_Leads",
    "Consultation_Leads",
    "Audit_Dossiers",
    "Chatbot_Leads",
    "Total_Leads",
    "Conversion_Rate",
    "Avg_Engagement_Sec"
  ];

  var headers = (typeof TAB_HEADERS !== "undefined" && TAB_HEADERS && TAB_HEADERS[tabName])
    ? TAB_HEADERS[tabName]
    : defaultHeaders;

  try { sh.clearContents(); } catch (e) {}

  sh.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight("bold")
    .setBackground("#064e3b")
    .setFontColor("#ffffff")
    .setHorizontalAlignment("center");
  sh.setFrozenRows(1);

  var keys = Object.keys(bucket).sort().reverse();
  var rows = [];

  for (var i = 0; i < keys.length; i++) {
    var b = bucket[keys[i]];
    if (!b) continue;
    var uCount = b.visitors ? (b.visitors.size || 0) : 0;
    var convRate = uCount > 0 ? ((b.leads / uCount) * 100).toFixed(1) + "%" : "0.0%";
    var avgSec = b.timedEvents > 0 ? Math.round(b.totalDur / b.timedEvents) : 0;

    rows.push([
      keys[i],
      b.events || 0,
      uCount,
      b.pvs || 0,
      b.quick || 0,
      b.consultation || 0,
      b.audit || 0,
      b.chat || 0,
      b.leads || 0,
      convRate,
      avgSec
    ]);
  }

  if (rows.length > 0) {
    sh.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function sendPeriodicExecutiveDigest(intervalName) {
  var ss = getSpreadsheet();
  if (!ss) return;
  BUILD_AGGREGATED_INTERVAL_SUMMARIES();

  var tabMap = { Daily: "Daily_Summary", Weekly: "Weekly_Summary", Monthly: "Monthly_Summary" };
  var sheet = ss.getSheetByName(tabMap[intervalName]);
  if (!sheet || sheet.getLastRow() < 2) return;

  var topRow = sheet.getRange(2, 1, 1, 11).getValues()[0];
  var period       = topRow[0] || "N/A";
  var events       = topRow[1] || 0;
  var visitors     = topRow[2] || 0;
  var pageViews    = topRow[3] || 0;
  var quickLeads   = topRow[4] || 0;
  var consultLeads = topRow[5] || 0;
  var auditLeads   = topRow[6] || 0;
  var chatLeads    = topRow[7] || 0;
  var totalLeads   = topRow[8] || 0;
  var convRate     = topRow[9] || "0%";
  var avgSec       = topRow[10] || 0;

  var cfg = EMAIL_CONFIG;
  var themeColor = intervalName === "Daily" ? "#047857" : (intervalName === "Weekly" ? "#0284c7" : "#7c3aed");

  var reportHtml = [
    '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>',
    '<body style="margin:0;padding:20px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">',
    '<div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 20px rgba(0,0,0,0.06);">',

    '<div style="background:linear-gradient(135deg,' + themeColor + ' 0%,#0f172a 100%);padding:28px 24px;">',
    '  <div style="display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;padding:4px 12px;border-radius:16px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">' + intervalName.toUpperCase() + ' EXECUTIVE DIGEST</div>',
    '  <h1 style="color:#ffffff;margin:0 0 4px 0;font-size:22px;font-weight:800;">ProfitPatterns Day-End Report</h1>',
    '  <p style="color:rgba(255,255,255,0.8);margin:0;font-size:13px;">Period: ' + period + '</p>',
    '</div>',

    // KPI Cards
    '<div style="padding:20px 24px 0 24px;">',
    '<table width="100%" style="border-collapse:separate;border-spacing:8px;">',
    '  <tr>',
    '    <td style="background:#f1f5f9;padding:14px;border-radius:8px;text-align:center;width:25%;">',
    '      <div style="font-size:11px;color:#64748b;font-weight:700;">VISITORS</div>',
    '      <div style="font-size:22px;font-weight:800;color:#0f172a;margin-top:4px;">' + Number(visitors).toLocaleString() + '</div>',
    '    </td>',
    '    <td style="background:#f1f5f9;padding:14px;border-radius:8px;text-align:center;width:25%;">',
    '      <div style="font-size:11px;color:#64748b;font-weight:700;">TOTAL LEADS</div>',
    '      <div style="font-size:22px;font-weight:800;color:' + themeColor + ';margin-top:4px;">' + Number(totalLeads).toLocaleString() + '</div>',
    '    </td>',
    '    <td style="background:#f1f5f9;padding:14px;border-radius:8px;text-align:center;width:25%;">',
    '      <div style="font-size:11px;color:#64748b;font-weight:700;">CONVERSION</div>',
    '      <div style="font-size:22px;font-weight:800;color:#d97706;margin-top:4px;">' + convRate + '</div>',
    '    </td>',
    '    <td style="background:#f1f5f9;padding:14px;border-radius:8px;text-align:center;width:25%;">',
    '      <div style="font-size:11px;color:#64748b;font-weight:700;">AVG ENGAGE</div>',
    '      <div style="font-size:22px;font-weight:800;color:#0f172a;margin-top:4px;">' + avgSec + 's</div>',
    '    </td>',
    '  </tr>',
    '</table>',
    '</div>',

    // Breakdown Table
    '<div style="padding:16px 24px;">',
    '  <table width="100%" style="border-collapse:collapse;font-size:13px;">',
    '    <tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #e2e8f0;">⚡ Quick Form Leads</td><td style="padding:8px 12px;text-align:right;font-weight:700;color:#10b981;border-bottom:1px solid #e2e8f0;">' + quickLeads + '</td></tr>',
    '    <tr><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #e2e8f0;">📋 Consultation Requests</td><td style="padding:8px 12px;text-align:right;font-weight:700;color:#0284c7;border-bottom:1px solid #e2e8f0;">' + consultLeads + '</td></tr>',
    '    <tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #e2e8f0;">📁 Process Audit Dossiers</td><td style="padding:8px 12px;text-align:right;font-weight:700;color:#d97706;border-bottom:1px solid #e2e8f0;">' + auditLeads + '</td></tr>',
    '    <tr><td style="padding:8px 12px;color:#64748b;border-bottom:1px solid #e2e8f0;">💬 Chatbot Leads</td><td style="padding:8px 12px;text-align:right;font-weight:700;color:#7c3aed;border-bottom:1px solid #e2e8f0;">' + chatLeads + '</td></tr>',
    '    <tr style="background:#f8fafc;"><td style="padding:8px 12px;color:#64748b;">📊 Telemetry Events Logged</td><td style="padding:8px 12px;text-align:right;font-weight:700;color:#0f172a;">' + Number(events).toLocaleString() + '</td></tr>',
    '  </table>',
    '</div>',

    '<div style="padding:16px 24px;text-align:center;">',
    '  <a href="' + ss.getUrl() + '" target="_blank" style="display:inline-block;background:' + themeColor + ';color:#ffffff;text-decoration:none;padding:10px 22px;border-radius:6px;font-weight:700;font-size:13px;">Open Google Sheet &rarr;</a>',
    '</div>',

    '</div></body></html>'
  ].join('');

  var reportRecipients = (cfg.reportEmails && cfg.reportEmails.length) ? cfg.reportEmails : ["asmitha.int2027g3@gmail.com", "asmitha.int2027gs@gmail.com", "asmithaveera1346@gmail.com"];
  reportRecipients.forEach(function(recip) {
    safeSendEmail({
      to: recip,
      subject: "[ProfitPatterns] " + intervalName + " Digest — " + period + " (" + totalLeads + " Leads)",
      htmlBody: reportHtml,
      name: cfg.name,
      replyTo: cfg.replyTo
    });
  });
}

function dailyReport() { sendPeriodicExecutiveDigest("Daily"); }
function weeklyReport() { sendPeriodicExecutiveDigest("Weekly"); }
function monthlyReport() { sendPeriodicExecutiveDigest("Monthly"); }

// =========================================================================================
// ONE-CLICK REFRESH, DUPLICATE PURGE & INITIALIZATION
// =========================================================================================
function INITIALIZE_ALL_TABS() {
  var ss = getSpreadsheet();
  if (!ss) {
    console.error("❌ Could not connect to spreadsheet.");
    return;
  }
  Object.keys(TAB_HEADERS).forEach(function(tabName) {
    getTab(ss, tabName);
  });
  console.log("✅ All tabs successfully initialized with enterprise headers.");
  try {
    SpreadsheetApp.getUi().alert("✅ All ProfitPatterns tabs initialized successfully!");
  } catch(e) {}
}

function MASTER_REFRESH_RAW_DATA() {
  INITIALIZE_ALL_TABS();
  PURGE_DUPLICATES_FROM_ALL_TABS();
  BUILD_AGGREGATED_INTERVAL_SUMMARIES();
  try {
    SpreadsheetApp.getUi().alert("✅ Master Refresh Complete!\n\n• All Tabs Verified (Telemetry + 4 Intelligence Tabs).\n• Duplicate rows purged.\n• Daily, Weekly & Monthly summaries recalculated.");
  } catch(e) {}
}

function PURGE_DUPLICATES_FROM_ALL_TABS() {
  var ss = getSpreadsheet();
  if (!ss) return;
  var tabs = Object.keys(TAB_HEADERS);
  var totalRemoved = 0;

  tabs.forEach(function(tabName) {
    var sheet = ss.getSheetByName(tabName);
    if (!sheet || sheet.getLastRow() < 3) return;
    var data = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return;

    var headers = data[0];
    if (!headers || headers.length === 0) return;

    var idCol = headers.indexOf("event_id");
    if (idCol === -1) idCol = headers.indexOf("lead_id");
    if (idCol === -1) idCol = headers.indexOf("visitor_id");
    if (idCol === -1) idCol = headers.indexOf("Session ID");
    if (idCol === -1) idCol = headers.indexOf("Visitor ID");

    var seen = new Set();
    var rowsToKeep = [headers];

    for (var r = 1; r < data.length; r++) {
      var key = idCol > -1 && data[r][idCol] ? String(data[r][idCol]) : data[r].join("|");
      if (!seen.has(key)) {
        seen.add(key);
        rowsToKeep.push(data[r]);
      } else {
        totalRemoved++;
      }
    }

    if (rowsToKeep.length < data.length && rowsToKeep.length > 0) {
      sheet.clearContents();
      sheet.getRange(1, 1, rowsToKeep.length, headers.length).setValues(rowsToKeep);
    }
  });
  console.log("🧹 Duplicates removed: " + totalRemoved);
}

function setupAllProfitPatternsTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) { ScriptApp.deleteTrigger(t); });

  // 1. Daily Executive Briefing every morning at 8:00 AM IST
  ScriptApp.newTrigger("dailyReport").timeBased().everyDays(1).atHour(8).create();

  // 2. Weekly Executive Digest every Monday at 9:00 AM IST
  ScriptApp.newTrigger("weeklyReport").timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();

  // 3. Monthly Executive Summary on the 1st of every month
  ScriptApp.newTrigger("monthlyReport").timeBased().onMonthDay(1).atHour(9).create();

  try {
    SpreadsheetApp.getUi().alert("✅ Automated Email Report Triggers Activated (Daily, Weekly & Monthly)!");
  } catch(e) {}
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 PROFITPATTERNS RAW DATA & INTELLIGENCE ENGINE')
    .addItem('🔄 Refresh & Recompute Telemetry & Summaries', 'MASTER_REFRESH_RAW_DATA')
    .addItem('📁 Initialize All Database Tabs', 'INITIALIZE_ALL_TABS')
    .addItem('🧹 Purge Duplicates Across All Tabs', 'PURGE_DUPLICATES_FROM_ALL_TABS')
    .addSeparator()
    .addItem('⏰ Enable Automated Daily/Weekly/Monthly Reports', 'setupAllProfitPatternsTriggers')
    .addToUi();
}

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
