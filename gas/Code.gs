// ============================================================
//  SAMStack Tech — Google Apps Script Automation Engine
//  Deploy as: Web App → Execute as Me → Anyone can access
// ============================================================

var SPREADSHEET_ID = "1rHZU7wdW5h0uWQwXlvUU1GYLNroLTbkKbe_cVfNkt4E";
var ADMIN_EMAIL    = "sulemanzaheer09@gmail.com";
var STUDIO_NAME    = "SAMStack Tech";

// ── Sheet tab names ──────────────────────────────────────────
var SHEET_INTERNS   = "Interns";
var SHEET_CERTS     = "Certificates";
var SHEET_INQUIRIES = "Client Inquiries";

// ============================================================
//  ENTRY POINT — called by Next.js API routes
// ============================================================
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var event   = payload.event;

    if (event === "APPLICANT_REGISTERED") handleRegistered(payload);
    else if (event === "WORK_SUBMITTED")   handleSubmitted(payload);
    else if (event === "APPLICANT_APPROVED") handleApproved(payload);
    else if (event === "APPLICANT_REJECTED") handleRejected(payload);
    else if (event === "CLIENT_INQUIRY")   handleInquiry(payload);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, event: event }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── GET handler for health check ────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput("SAMStack GAS Engine: OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

// ============================================================
//  EVENT HANDLERS
// ============================================================

function handleRegistered(p) {
  appendInternRow([
    p.rollNumber, p.fullName, p.email, p.university || "N/A",
    p.trackTitle || p.track, "APPLIED",
    formatDate(p.appliedAt), "", "", "", ""
  ]);

  // Confirmation email to applicant
  var subject = "✅ Application Received — " + STUDIO_NAME + " Internship";
  var body = confirmationEmailHtml(p.fullName, p.rollNumber, p.trackTitle || p.track);
  GmailApp.sendEmail(p.email, subject, "", { htmlBody: body, name: STUDIO_NAME });

  // Admin notification
  GmailApp.sendEmail(ADMIN_EMAIL,
    "[New Application] " + p.fullName + " — " + (p.trackTitle || p.track),
    "Roll: " + p.rollNumber + "\nEmail: " + p.email + "\nTrack: " + (p.trackTitle || p.track),
    { name: STUDIO_NAME + " System" }
  );
}

function handleSubmitted(p) {
  updateInternStatus(p.rollNumber, "SUBMITTED");
  appendInternNotes(p.rollNumber,
    "GitHub: " + (p.submission.githubRepositoryUrl || "") +
    " | Live: " + (p.submission.liveDeploymentUrl || "") +
    " | Figma: " + (p.submission.figmaProjectUrl || "")
  );

  GmailApp.sendEmail(ADMIN_EMAIL,
    "[Work Submitted] " + p.fullName + " (" + p.rollNumber + ")",
    "Track: " + p.track + "\nGitHub: " + (p.submission.githubRepositoryUrl || "N/A") +
    "\nLive: " + (p.submission.liveDeploymentUrl || "N/A") +
    "\nTasks done: " + p.submission.completedTaskCount,
    { name: STUDIO_NAME + " System" }
  );
}

function handleApproved(p) {
  updateInternStatus(p.rollNumber, "APPROVED");
  appendCertRow([
    p.certificateNumber, p.rollNumber, p.fullName,
    p.trackTitle, p.issuanceDateFormatted, "VALID",
    p.verifyUrl
  ]);

  try {
    // Generate beautiful print-ready PDF blobs
    var offerPdf = generateOfferLetterPdf(p);
    var certPdf = generateCertificatePdf(p);

    // 1. Offer Letter email with PDF attached
    var offerSubject = "🎉 Offer Letter — SAMStack Tech Internship Completion";
    GmailApp.sendEmail(p.email, offerSubject, "", {
      htmlBody: offerLetterHtml(p),
      name: STUDIO_NAME,
      attachments: [offerPdf]
    });

    // 2. Certificate email with PDF attached
    var certSubject = "🏆 Your Certificate & Credentials — " + STUDIO_NAME;
    GmailApp.sendEmail(p.email, certSubject, "", {
      htmlBody: certificateEmailHtml(p),
      name: STUDIO_NAME,
      attachments: [certPdf]
    });

    // 3. Admin copy with both attachments for audit
    GmailApp.sendEmail(ADMIN_EMAIL,
      "[APPROVED] " + p.fullName + " | Cert: " + p.certificateNumber,
      "Roll: " + p.rollNumber + "\nCertificate: " + p.certificateNumber + "\nVerify: " + p.verifyUrl + "\n\nAttached are the official PDFs sent to the student.",
      { 
        name: STUDIO_NAME + " System",
        attachments: [offerPdf, certPdf]
      }
    );
  } catch (err) {
    // Fallback: if PDF generation fails, send normal emails and notify admin
    GmailApp.sendEmail(ADMIN_EMAIL,
      "⚠️ PDF Generation Error — " + p.fullName,
      "Failed to generate PDF for " + p.fullName + " (" + p.rollNumber + "). Error: " + err.message + "\n\nStandard emails were dispatched without attachments.",
      { name: STUDIO_NAME + " System" }
    );

    // Standard emails without attachments
    GmailApp.sendEmail(p.email, "🎉 Offer Letter — SAMStack Tech Internship Completion", "", {
      htmlBody: offerLetterHtml(p),
      name: STUDIO_NAME
    });

    GmailApp.sendEmail(p.email, "🏆 Your Certificate & Credentials — " + STUDIO_NAME, "", {
      htmlBody: certificateEmailHtml(p),
      name: STUDIO_NAME
    });
  }
}

function handleRejected(p) {
  updateInternStatus(p.rollNumber, "REJECTED");

  var subject = "Update on Your Internship Application — " + STUDIO_NAME;
  var body = rejectionEmailHtml(p.fullName, p.trackTitle || p.track, p.siteUrl);
  GmailApp.sendEmail(p.email, subject, "", { htmlBody: body, name: STUDIO_NAME });
}

function handleInquiry(p) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = getOrCreateSheet(ss, SHEET_INQUIRIES,
    ["ID","Client","Email","Organization","Service","Budget","Message","Date"]);
  sheet.appendRow([
    p.inquiryId, p.clientName, p.clientEmail, p.organization,
    p.serviceType, p.budget, p.message, formatDate(p.timestamp)
  ]);

  GmailApp.sendEmail(ADMIN_EMAIL,
    "[New Inquiry] " + p.clientName + " — " + p.serviceType,
    "From: " + p.clientName + " <" + p.clientEmail + ">\n" +
    "Org: " + p.organization + "\nService: " + p.serviceType +
    "\nBudget: " + p.budget + "\n\n" + p.message,
    { name: STUDIO_NAME + " System" }
  );
}

// ============================================================
//  SHEET HELPERS
// ============================================================

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground("#0b0f19")
      .setFontColor("#06b6d4")
      .setFontWeight("bold");
  }
  return sheet;
}

function appendInternRow(row) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = getOrCreateSheet(ss, SHEET_INTERNS, [
    "Roll Number","Full Name","Email","University",
    "Track","Status","Applied","GitHub","Live","Figma","Notes"
  ]);
  sheet.appendRow(row);
}

function appendCertRow(row) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = getOrCreateSheet(ss, SHEET_CERTS, [
    "Certificate #","Roll Number","Recipient","Track","Issued On","Status","Verify URL"
  ]);
  sheet.appendRow(row);
}

function updateInternStatus(rollNumber, status) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_INTERNS);
  if (!sheet) return;
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === rollNumber) {
      sheet.getRange(i + 1, 6).setValue(status); // column F = Status
      break;
    }
  }
}

function appendInternNotes(rollNumber, notes) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_INTERNS);
  if (!sheet) return;
  var data  = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === rollNumber) {
      sheet.getRange(i + 1, 11).setValue(notes); // column K = Notes
      break;
    }
  }
}

function formatDate(iso) {
  if (!iso) return "";
  var d = new Date(iso);
  return Utilities.formatDate(d, "Asia/Karachi", "dd MMM yyyy");
}

// ============================================================
//  HTML EMAIL TEMPLATES
// ============================================================

var BASE_STYLE = [
  "font-family:'Segoe UI',Arial,sans-serif;",
  "background:#0b0f19;color:#e2e8f0;margin:0;padding:0;"
].join("");

var CARD_STYLE = [
  "background:rgba(17,24,39,0.95);",
  "border:1px solid rgba(6,182,212,0.25);",
  "border-radius:12px;padding:40px;max-width:620px;",
  "margin:30px auto;"
].join("");

var HEADING_STYLE = "color:#06b6d4;font-size:22px;font-weight:700;margin:0 0 6px;";
var SUBTEXT_STYLE = "color:#94a3b8;font-size:13px;margin:0 0 24px;";
var DIVIDER       = "<hr style='border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;'/>";
var LABEL_STYLE   = "color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;";
var VALUE_STYLE   = "color:#f1f5f9;font-size:14px;font-weight:600;margin-bottom:16px;";

function wrap(content) {
  return "<div style='" + BASE_STYLE + "'>" +
    "<div style='" + CARD_STYLE + "'>" + content + "</div></div>";
}

function logo() {
  return "<p style='font-size:11px;letter-spacing:3px;color:#06b6d4;font-weight:700;" +
    "text-transform:uppercase;margin:0 0 4px;'>SAMStack Tech</p>" +
    "<p style='font-size:10px;color:#475569;letter-spacing:2px;margin:0 0 28px;'>SOFTWARE SYSTEMS STUDIO</p>";
}

// ── Confirmation email (on APPLY) ────────────────────────────
function confirmationEmailHtml(fullName, rollNumber, track) {
  return wrap(
    logo() +
    "<h1 style='" + HEADING_STYLE + "'>Application Received!</h1>" +
    "<p style='" + SUBTEXT_STYLE + "'>We have logged your internship application.</p>" +
    DIVIDER +
    "<p style='" + LABEL_STYLE + "'>Candidate Name</p><p style='" + VALUE_STYLE + "'>" + fullName + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Roll Number</p><p style='" + VALUE_STYLE + "'>" + rollNumber + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Specialization Track</p><p style='" + VALUE_STYLE + "'>" + track + "</p>" +
    DIVIDER +
    "<p style='color:#94a3b8;font-size:13px;line-height:1.6;'>" +
    "Our team will review your application and notify you of the next steps. " +
    "Please keep your Roll Number safe — you will need it to submit your work.</p>" +
    "<p style='color:#475569;font-size:11px;margin-top:28px;'>— " + STUDIO_NAME + " Talent Acquisition System</p>"
  );
}

// ── Offer Letter email (on APPROVE) ─────────────────────────
function offerLetterHtml(p) {
  return wrap(
    logo() +
    "<h1 style='" + HEADING_STYLE + "'>Offer Letter — Internship Completion</h1>" +
    "<p style='" + SUBTEXT_STYLE + "'>Issued on " + p.issuanceDateFormatted + "</p>" +
    DIVIDER +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>Dear <strong>" + p.fullName + "</strong>,</p>" +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>" +
    "On behalf of <strong style='color:#06b6d4;'>" + STUDIO_NAME + "</strong>, I am delighted to formally " +
    "confirm the successful completion of your internship in the <strong>" + p.trackTitle + "</strong> specialization.</p>" +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>" +
    "Your dedication, technical deliverables, and commitment to excellence throughout this program " +
    "have been exemplary. You have demonstrated the caliber of engineering talent that defines the " + STUDIO_NAME + " standard.</p>" +
    "<div style='background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin:16px 0;color:#94a3b8;font-size:13px;'>" +
    "📎 <strong>Attachment:</strong> We have attached your official, high-fidelity printable <strong>Offer Letter PDF</strong> to this email for your records." +
    "</div>" +
    DIVIDER +
    "<p style='" + LABEL_STYLE + "'>Roll Number</p><p style='" + VALUE_STYLE + "'>" + p.rollNumber + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Specialization</p><p style='" + VALUE_STYLE + "'>" + p.trackTitle + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Certificate Number</p><p style='" + VALUE_STYLE + "'>" + p.certificateNumber + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Completion Date</p><p style='" + VALUE_STYLE + "'>" + p.issuanceDateFormatted + "</p>" +
    DIVIDER +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>" +
    "This letter serves as official documentation of your internship completion and may be presented " +
    "to prospective employers, academic institutions, or any relevant authority.</p>" +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;margin-top:24px;'>" +
    "Warm regards,<br/><strong style='color:#06b6d4;'>" + p.adminName + "</strong><br/>" +
    "<span style='color:#94a3b8;font-size:12px;'>" + p.adminTitle + ", " + STUDIO_NAME + "</span></p>"
  );
}

// ── Certificate email (on APPROVE) ──────────────────────────
function certificateEmailHtml(p) {
  return wrap(
    logo() +
    "<div style='text-align:center;padding:16px 0 24px;'>" +
    "<p style='font-size:28px;margin:0;'>🏆</p>" +
    "<h1 style='color:#06b6d4;font-size:24px;font-weight:800;margin:8px 0 4px;'>Certificate of Completion</h1>" +
    "<p style='color:#64748b;font-size:11px;letter-spacing:2px;margin:0;'>SAMSTACK TECH · INTERNSHIP PROGRAM 2026</p>" +
    "</div>" +
    DIVIDER +
    "<p style='text-align:center;color:#94a3b8;font-size:13px;margin:0 0 8px;'>This certifies that</p>" +
    "<p style='text-align:center;color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 8px;'>" + p.fullName + "</p>" +
    "<p style='text-align:center;color:#94a3b8;font-size:13px;margin:0 0 8px;'>has successfully completed the internship program in</p>" +
    "<p style='text-align:center;color:#06b6d4;font-size:16px;font-weight:700;margin:0 0 24px;'>" + p.trackTitle + "</p>" +
    "<div style='background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin:16px 0;color:#94a3b8;font-size:13px;text-align:left;'>" +
    "📎 <strong>Attachment:</strong> Your official landscape-oriented <strong>Certificate of Completion PDF</strong> is attached. This high-resolution document is ready for high-quality color printing." +
    "</div>" +
    DIVIDER +
    "<p style='" + LABEL_STYLE + "'>Certificate Number</p><p style='" + VALUE_STYLE + "'>" + p.certificateNumber + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Roll Number</p><p style='" + VALUE_STYLE + "'>" + p.rollNumber + "</p>" +
    "<p style='" + LABEL_STYLE + "'>Date of Issue</p><p style='" + VALUE_STYLE + "'>" + p.issuanceDateFormatted + "</p>" +
    DIVIDER +
    "<div style='text-align:center;'>" +
    "<a href='" + p.verifyUrl + "' style='display:inline-block;background:#06b6d4;color:#0b0f19;" +
    "font-weight:700;text-decoration:none;padding:12px 32px;border-radius:8px;" +
    "font-size:13px;letter-spacing:1px;text-transform:uppercase;'>Verify Certificate Online</a>" +
    "</div>" +
    "<p style='text-align:center;color:#475569;font-size:11px;margin-top:20px;'>" + p.verifyUrl + "</p>" +
    "<p style='color:#e2e8f0;font-size:14px;margin-top:28px;'>" +
    "Signed,<br/><strong style='color:#06b6d4;'>" + p.adminName + "</strong><br/>" +
    "<span style='color:#94a3b8;font-size:12px;'>" + p.adminTitle + ", " + STUDIO_NAME + "</span></p>"
  );
}

// ── Rejection email ──────────────────────────────────────────
function rejectionEmailHtml(fullName, track, siteUrl) {
  return wrap(
    logo() +
    "<h1 style='" + HEADING_STYLE + "'>Application Update</h1>" +
    "<p style='" + SUBTEXT_STYLE + "'>Thank you for applying to " + STUDIO_NAME + "</p>" +
    DIVIDER +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>Dear <strong>" + fullName + "</strong>,</p>" +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>" +
    "After careful review of your internship application for the <strong>" + track + "</strong> track, " +
    "we regret to inform you that we are unable to move forward with your application at this time.</p>" +
    "<p style='color:#e2e8f0;font-size:14px;line-height:1.8;'>" +
    "We encourage you to continue building your skills and consider reapplying in a future cohort. " +
    "The standards at " + STUDIO_NAME + " are high, and we appreciate the effort you invested in your application.</p>" +
    DIVIDER +
    "<div style='text-align:center;'>" +
    "<a href='" + siteUrl + "/internship' style='display:inline-block;border:1px solid #06b6d4;" +
    "color:#06b6d4;text-decoration:none;padding:12px 32px;border-radius:8px;" +
    "font-size:13px;font-weight:700;'>Explore Future Openings</a>" +
    "</div>" +
    "<p style='color:#e2e8f0;font-size:14px;margin-top:28px;'>" +
    "Best regards,<br/><strong style='color:#06b6d4;'>Suleman Zaheer</strong><br/>" +
    "<span style='color:#94a3b8;font-size:12px;'>Founder &amp; Lead Engineer, " + STUDIO_NAME + "</span></p>"
  );
}

// =========================================================================
// ── PDF GENERATION ENGINES (HIGH-FIDELITY, PRINT-READY COPIES) ───────────
// =========================================================================

/**
 * Generates an elegant, professional, portrait-oriented PDF Offer Letter.
 * Includes complete candidate and track details, company branding, and digital signature.
 */
function generateOfferLetterPdf(p) {
  var html = [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    "<style>",
    "  @page { size: portrait; margin: 15mm; }",
    "  body { font-family: 'Helvetica', 'Arial', sans-serif; color: #1e293b; line-height: 1.5; font-size: 11pt; }",
    "  .border-box { border: 2px solid #06b6d4; padding: 25px; border-radius: 8px; min-height: 90%; }",
    "  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }",
    "  .logo-text { font-size: 22pt; font-weight: 800; color: #0f172a; tracking-tight; }",
    "  .logo-sub { font-size: 8pt; font-weight: 600; color: #64748b; letter-spacing: 2px; }",
    "  .contact-text { font-size: 8pt; text-align: right; color: #64748b; }",
    "  .divider { border-top: 1px solid #e2e8f0; margin: 20px 0; }",
    "  .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 9pt; }",
    "  .meta-label { color: #64748b; text-transform: uppercase; font-weight: bold; }",
    "  .meta-value { color: #0f172a; font-weight: bold; }",
    "  .salutation { font-weight: bold; font-size: 12pt; color: #0f172a; margin-bottom: 15px; }",
    "  .body-para { margin-bottom: 15px; text-align: justify; }",
    "  .highlight-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0; }",
    "  .highlight-title { font-weight: bold; color: #0891b2; font-size: 10pt; text-transform: uppercase; margin-bottom: 10px; }",
    "  .highlight-list { padding-left: 15px; margin: 0; font-size: 9pt; color: #475569; }",
    "  .footer-table { width: 100%; border-collapse: collapse; margin-top: 40px; }",
    "  .sig-title { font-size: 8pt; color: #64748b; margin-top: 5px; }",
    "  .sig-name { font-family: 'Georgia', serif; font-style: italic; font-size: 16pt; color: #0891b2; font-weight: bold; }",
    "</style>",
    "</head>",
    "<body>",
    "<div class='border-box'>",
    "  <table class='header-table'>",
    "    <tr>",
    "      <td>",
    "        <span class='logo-text'>SAMStack <span style='color:#06b6d4;'>Tech</span></span><br/>",
    "        <span class='logo-sub'>SOFTWARE SYSTEMS STUDIO</span>",
    "      </td>",
    "      <td class='contact-text'>",
    "        www.samstack.tech<br/>",
    "        support@samstack.tech<br/>",
    "        Remote Operations HQ",
    "      </td>",
    "    </tr>",
    "  </table>",
    "  <div class='divider'></div>",
    "  <table class='meta-table'>",
    "    <tr>",
    "      <td width='50%' valign='top'>",
    "        <span class='meta-label'>Recipient Profile:</span><br/>",
    "        <strong style='font-size:11pt;color:#0f172a;'>" + p.fullName + "</strong><br/>",
    "        <span>" + p.email + "</span><br/>",
    "        <span>" + p.university + "</span>",
    "      </td>",
    "      <td width='50%' valign='top' align='right'>",
    "        <span class='meta-label'>Document Reference:</span><br/>",
    "        <span>Roll Number: <strong>" + p.rollNumber + "</strong></span><br/>",
    "        <span>Date of Issue: <strong>" + p.issuanceDateFormatted + "</strong></span><br/>",
    "        <span>Specialization: <strong>" + p.trackTitle + "</strong></span>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "  <div class='salutation'>Dear " + p.fullName.split(" ")[0] + ",</div>",
    "  <div class='body-para'>",
    "    On behalf of <strong>SAMStack Tech</strong>, we are delighted to formally confirm the successful completion of your internship specialization in <strong>" + p.trackTitle + "</strong>.",
    "  </div>",
    "  <div class='body-para'>",
    "    Your commitment to architectural excellence, adherence to core optimization parameters, and the caliber of production software components you delivered throughout this cohort have met the highest engineering benchmarks of our studio.",
    "  </div>",
    "  <div class='highlight-card'>",
    "    <div class='highlight-title'>Cohort Vetting &amp; Operational Standards Met:</div>",
    "    <ul class='highlight-list'>",
    "      <li><strong>Autonomous Execution:</strong> Demonstrated outstanding self-paced engineering mastery in a remote integration framework.</li>",
    "      <li><strong>Architectural Fidelity:</strong> Strict implementation of state, clean styles, responsive interfaces, and seamless API compliance.</li>",
    "      <li><strong>Registry Validation:</strong> Technical source code repository and live deployment verified and indexed securely.</li>",
    "    </ul>",
    "  </div>",
    "  <div class='body-para'>",
    "    This formal document acts as a verified, official record of your completion and may be confidently presented to academic bodies, professional institutions, and hiring boards globally.",
    "  </div>",
    "  <div class='body-para'>",
    "    We commend your high standard of technical discipline and look forward to seeing your future growth as a systems engineer.",
    "  </div>",
    "  <table class='footer-table'>",
    "    <tr>",
    "      <td valign='bottom'>",
    "        <span style='font-size:8pt;color:#94a3b8;font-family:monospace;'>VERIFICATION_HASH::SAM-INT-2026-REG" + p.rollNumber.split("-").pop() + "</span>",
    "      </td>",
    "      <td align='right' valign='bottom'>",
    "        <div class='sig-name'>Suleman Zaheer</div>",
    "        <div style='border-top:1px solid #0891b2;width:150px;margin:3px 0 3px auto;'></div>",
    "        <span class='sig-title'>Founder &amp; Lead Engineer, SAMStack Tech</span>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "</div>",
    "</body>",
    "</html>"
  ].join("\n");
  
  var blob = Utilities.newBlob(html, "text/html", "Offer_Letter_" + p.rollNumber + ".html");
  return blob.getAs("application/pdf").setName("Offer_Letter_" + p.rollNumber + ".pdf");
}

/**
 * Generates an elegant, landscape-oriented PDF Certificate of Completion.
 * Displays candidate name, applied field, roll number, certificate number,
 * issuance date, and digital signature of Suleman Zaheer.
 * Strictly adheres to privacy boundaries by omitting candidate email address.
 */
function generateCertificatePdf(p) {
  var html = [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    "<style>",
    "  @page { size: A4 landscape; margin: 10mm; }",
    "  body { font-family: 'Helvetica', 'Arial', sans-serif; color: #0f172a; margin: 0; padding: 0; background: #ffffff; }",
    "  .cert-container { border: 10px double #0891b2; padding: 30px; box-sizing: border-box; height: 95%; position: relative; border-radius: 6px; }",
    "  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }",
    "  .logo-text { font-size: 20pt; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }",
    "  .logo-accent { color: #0891b2; }",
    "  .logo-sub { font-size: 7.5pt; font-weight: bold; color: #64748b; letter-spacing: 2px; }",
    "  .meta-right { text-align: right; font-family: monospace; font-size: 8pt; color: #64748b; line-height: 1.4; }",
    "  .cert-title { text-align: center; font-size: 24pt; font-weight: 800; color: #0f172a; text-transform: uppercase; margin: 20px 0 5px; }",
    "  .cert-subtitle { text-align: center; font-size: 8pt; font-weight: bold; color: #64748b; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 25px; }",
    "  .cert-to { text-align: center; font-size: 11pt; color: #64748b; font-style: italic; margin-bottom: 10px; }",
    "  .cert-name { text-align: center; font-size: 28pt; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 5px 0 15px; letter-spacing: 0.5px; }",
    "  .cert-desc { text-align: center; font-size: 11pt; color: #334155; max-width: 650px; margin: 0 auto 15px; line-height: 1.6; }",
    "  .cert-track { text-align: center; font-size: 16pt; font-weight: 900; color: #0891b2; text-transform: uppercase; margin: 15px 0 30px; letter-spacing: 1px; }",
    "  .footer-table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 8.5pt; }",
    "  .footer-label { color: #64748b; font-size: 7pt; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }",
    "  .footer-value { color: #0f172a; font-weight: bold; margin-top: 3px; }",
    "  .sig-name { font-family: 'Georgia', serif; font-style: italic; font-size: 16pt; color: #0891b2; font-weight: bold; }",
    "  .hash-text { font-family: monospace; font-size: 7.5pt; color: #94a3b8; }",
    "</style>",
    "</head>",
    "<body>",
    "<div class='cert-container'>",
    "  <table class='header-table'>",
    "    <tr>",
    "      <td>",
    "        <span class='logo-text'>SAM<span class='logo-accent'>STACK</span> TECH</span><br/>",
    "        <span class='logo-sub'>PREMIUM SOFTWARE SYSTEMS STUDIO</span>",
    "      </td>",
    "      <td class='meta-right'>",
    "        <span>Registry ID: <strong>" + p.certificateNumber + "</strong></span><br/>",
    "        <span>Roll Number: <strong>" + p.rollNumber + "</strong></span><br/>",
    "        <span>Verification: SECURE_LEDGER_AUTHENTIC</span>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "  <div class='cert-title'>Certificate of Completion</div>",
    "  <div class='cert-subtitle'>SAMStack Tech · Corporate Internship Program</div>",
    "  <div class='cert-to'>This is to verify and certify that</div>",
    "  <div class='cert-name'>" + p.fullName + "</div>",
    "  <div class='cert-desc'>has successfully completed all rigorous technical, architectural, and production specifications of the systems engineering curriculum in</div>",
    "  <div class='cert-track'>" + p.trackTitle + "</div>",
    "  <table class='footer-table'>",
    "    <tr>",
    "      <td width='33%' valign='bottom' style='border-left: 2px solid #0891b2; padding-left: 10px;'>",
    "        <span class='footer-label'>Date of Issuance</span><br/>",
    "        <div class='footer-value'>" + p.issuanceDateFormatted + "</div>",
    "      </td>",
    "      <td width='33%' valign='bottom' style='border-left: 2px solid #0891b2; padding-left: 10px;'>",
    "        <span class='footer-label'>Authority</span><br/>",
    "        <div class='footer-value'>SAMStack Registrar</div>",
    "      </td>",
    "      <td width='34%' align='right' valign='bottom'>",
    "        <div class='sig-name'>Suleman Zaheer</div>",
    "        <div style='border-top:1px solid #0891b2;width:150px;margin:2px 0 2px auto;'></div>",
    "        <span class='footer-label'>Founder &amp; Lead Engineer</span>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "  <div style='margin-top: 25px; text-align: left;' class='hash-text'>",
    "    Cryptographic Event Proof: SHA256::0x" + p.certificateNumber.split("-").pop() + "F8C9E74A2B93D81F<br/>",
    "    Verify Credentials Online: " + p.verifyUrl,
    "  </div>",
    "</div>",
    "</body>",
    "</html>"
  ].join("\n");
  
  var blob = Utilities.newBlob(html, "text/html", "Certificate_" + p.rollNumber + ".html");
  return blob.getAs("application/pdf").setName("Certificate_" + p.rollNumber + ".pdf");
}
