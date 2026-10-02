/**
 * ProfitPatterns Multi-Intelligence Google Apps Script Backend (Code.gs)
 * 
 * Captures:
 * 1. Session Intelligence (Entry/Exit, Flow, Dwell Time, Bounce Risk, Funnel Stage)
 * 2. Traffic Intelligence (Source, Medium, Campaign, Attribution First/Last Touch)
 * 3. Geo Intelligence (Country, City, Region, Currency, Compliance)
 * 4. Time Zone Intelligence (Local Time, IANA Timezone, UTC Offset, Peak Hours)
 * 5. IP & Security Intelligence (Carrier/ISP, Network Type, Corporate Intent, Fraud Score)
 * 6. Lead Management (Form submissions, Contact, Consultations)
 * 7. Master Event Log (Audit trail of all interactions)
 */

// Handle incoming POST requests from the website
function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : "";
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Empty payload" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(rawData);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var now = new Date();

    var eventName = payload.event_name || payload.name || "event";
    var eventType = payload.event_type || payload.type || "custom_event";
    var isLead = (eventType === "lead" || eventName === "lead_submit" || payload.email || payload.phone) && 
                 eventName !== "form_start";

    // 1. Log Session Intelligence
    if (payload.session_id) {
      logSessionIntelligence(ss, payload, now);
    }

    // 2. Log Traffic Intelligence
    if (payload.traffic_source || payload.utm_source || payload.first_touch_attribution) {
      logTrafficIntelligence(ss, payload, now);
    }

    // 3. Log Geo & Timezone Intelligence
    if (payload.geo_country || payload.timezone_iana || payload.geo_city) {
      logGeoTimezoneIntelligence(ss, payload, now);
    }

    // 4. Log IP & Security Intelligence
    if (payload.ip_network_carrier || payload.network_carrier_type || payload.fraud_risk_score) {
      logIPSecurityIntelligence(ss, payload, now);
    }

    // 5. Log Inbound Lead (if contact details present)
    if (isLead && (payload.email || payload.phone || payload.name)) {
      logLeadManagement(ss, payload, now);
    }

    // 6. Master Event Log
    logMasterEvent(ss, payload, now);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", received: eventName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (health check)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "online", 
    service: "ProfitPatterns Intelligence Engine Backend",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- 1. Session Intelligence Logger ---
function logSessionIntelligence(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "Session_Intelligence", [
    "Timestamp", "Session ID", "Visitor ID", "Entry Point", "Current Page",
    "Page Dwell (s)", "Session Dwell (s)", "Navigation Flow", "Bounce Risk",
    "Funnel Stage", "User Intent", "Interactions Count"
  ]);

  sheet.appendRow([
    now,
    p.session_id || "",
    p.visitor_id || "",
    p.session_entry_point || "",
    p.page_path || p.page_url || "",
    p.page_dwell_seconds || p.time_on_page_seconds || "",
    p.session_dwell_seconds || "",
    p.session_navigation_flow || "",
    p.bounce_risk || "",
    p.funnel_stage || "",
    p.user_intent || "",
    p.interaction_count || 1
  ]);
}

// --- 2. Traffic Intelligence Logger ---
function logTrafficIntelligence(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "Traffic_Intelligence", [
    "Timestamp", "Session ID", "Visitor ID", "Traffic Category", "Raw Source",
    "Medium", "Campaign", "Search Term", "Ad Content", "Click ID / Tag",
    "First-Touch Attribution", "Last-Touch Attribution", "Channel ROI Score", "Referrer Domain"
  ]);

  sheet.appendRow([
    now,
    p.session_id || "",
    p.visitor_id || "",
    p.traffic_source_category || p.traffic_source || "",
    p.raw_source || p.utm_source || "",
    p.utm_medium || "",
    p.utm_campaign || "",
    p.utm_term || "",
    p.utm_content || "",
    p.click_id || "",
    p.first_touch_attribution || "",
    p.last_touch_attribution || "",
    p.channel_roi_score || "",
    p.referrer_url || p.previous_page || ""
  ]);
}

// --- 3. Geo & Timezone Intelligence Logger ---
function logGeoTimezoneIntelligence(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "Geo_Timezone_Intelligence", [
    "Timestamp", "Visitor ID", "Country", "Country Code", "City",
    "Region", "Continent", "Currency", "Market Tier", "Compliance Mode",
    "Local Clock Time", "Timezone (IANA)", "UTC Offset", "Day Phase",
    "Peak Hours Status", "Active Advisory Desk"
  ]);

  sheet.appendRow([
    now,
    p.visitor_id || "",
    p.geo_country || "",
    p.geo_country_code || "",
    p.geo_city || "",
    p.geo_region || "",
    p.geo_continent || "",
    p.geo_currency || "",
    p.geo_market_tier || "",
    p.compliance_mode || "",
    p.timezone_local_time || "",
    p.timezone_iana || p.timezone || "",
    p.timezone_utc_offset || "",
    p.timezone_day_phase || "",
    p.peak_engagement_status || "",
    p.active_advisory_desk || ""
  ]);
}

// --- 4. IP & Security Intelligence Logger ---
function logIPSecurityIntelligence(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "IP_Security_Intelligence", [
    "Timestamp", "Visitor ID", "Session ID", "Network Carrier / ISP",
    "Network Type", "Corporate Intent", "Fraud Risk Score", "Fraud Status",
    "Repeat Visits Velocity", "Security Tier", "Device Type", "Browser / OS"
  ]);

  sheet.appendRow([
    now,
    p.visitor_id || "",
    p.session_id || "",
    p.ip_network_carrier || p.network_carrier_type || "",
    p.ip_network_type || "",
    p.ip_corporate_intent || "",
    p.ip_fraud_risk_score || p.fraud_risk_score || "",
    p.ip_fraud_status || "",
    p.ip_visit_velocity || "",
    p.security_tier || "",
    p.device_type || "",
    (p.browser || "") + " (" + (p.operating_system || "") + ")"
  ]);
}

// --- 5. Lead Management Logger ---
function logLeadManagement(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "Lead_Management", [
    "Timestamp", "Lead ID", "Full Name", "Work Email", "Phone",
    "Company Name", "Job Title", "Industry", "Lead Track",
    "Primary Requirement", "Challenge / Process Message", "Source Page URL",
    "Traffic Source", "First-Touch Attribution", "Lead Status"
  ]);

  sheet.appendRow([
    now,
    p.event_id || ("lead_" + new Date().getTime()),
    p.name || p.fullName || "",
    p.email || p.workEmail || "",
    p.phone || "",
    p.company || "",
    p.jobTitle || p.job_title || "",
    p.industry || "",
    p.lead_type || p.docType || "Strategy Consultation",
    p.requirement || p.primaryGoal || "",
    p.challenge || p.message || p.processSummary || "",
    p.page_url || p.page_path || "",
    p.traffic_source || "",
    p.first_touch_attribution || "",
    "New Inbound"
  ]);
}

// --- 6. Master Event Audit Log ---
function logMasterEvent(ss, p, now) {
  var sheet = getOrCreateSheet(ss, "Master_Event_Log", [
    "Timestamp", "Event Name", "Event Type", "Event Category",
    "Page Path", "Visitor ID", "Session ID", "Target / CTA Text",
    "Predictive Synergy Score", "Traffic Source"
  ]);

  sheet.appendRow([
    now,
    p.event_name || "",
    p.event_type || "",
    p.event_category || "",
    p.page_path || p.page_url || "",
    p.visitor_id || "",
    p.session_id || "",
    p.event_label || p.cta_name || p.element_text || "",
    p.predictive_synergy_score || p.predictive_intent_score || "",
    p.traffic_source || ""
  ]);
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
  }
  return sheet;
}
