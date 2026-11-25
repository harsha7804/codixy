const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, ShadingType, AlignmentType, HeadingLevel, BorderStyle, Header, Footer,
  PageNumber, TabStopType, LevelFormat, PageBreak, VerticalAlign, TableLayoutType,
} = require("docx");

const OUT = process.argv[2];
const logo = fs.readFileSync(path.join(__dirname, "logo.png"));

// ---------- Theme ----------
const NAVY = "0B1F4D", BLUE = "0A66FF", SKY = "1E90FF", LIGHT = "EAF2FF", ZEBRA = "F5F8FE",
  GREY = "5B6475", LINE = "D5DEEE", WHITE = "FFFFFF", GREEN = "0E9F6E";
const FONT = "Calibri";
const W = 9746; // A4 content width with 0.75in margins

const inr = (n) => "₹ " + n.toLocaleString("en-IN");

// ---------- Helpers ----------
const t = (text, o = {}) => new TextRun({ text, font: FONT, ...o });
const p = (text, o = {}) => new Paragraph({
  spacing: { after: 120, line: 290 }, ...o.para,
  children: Array.isArray(text) ? text : [t(text, { size: 21, color: "1F2937", ...o.run })],
});
const h1 = (num, text) => new Paragraph({
  heading: HeadingLevel.HEADING_1, pageBreakBefore: true,
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 6 } },
  children: [t(num + "  ", { color: BLUE }), t(text)],
});
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [t(text)] });
const bullet = (text, level = 0) => new Paragraph({
  numbering: { reference: "bul", level }, spacing: { after: 60, line: 276 },
  children: typeof text === "string" ? [t(text, { size: 21, color: "1F2937" })] : text,
});
const boldLead = (lead, rest) => bullet([t(lead, { bold: true, size: 21, color: NAVY }), t(rest, { size: 21, color: "1F2937" })]);
const spacer = (after = 120) => new Paragraph({ spacing: { after }, children: [] });

const border = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border };
const noB = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noB, bottom: noB, left: noB, right: noB, insideHorizontal: noB, insideVertical: noB };

function cell(content, width, o = {}) {
  const kids = (Array.isArray(content) ? content : [content]).map((c) =>
    typeof c === "string"
      ? new Paragraph({ alignment: o.align, spacing: { after: 0, line: 264 }, children: [t(c, { size: o.size || 19, bold: o.bold, color: o.color || "1F2937" })] })
      : c);
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
    margins: { top: 90, bottom: 90, left: 120, right: 120 },
    verticalAlign: o.valign || VerticalAlign.CENTER,
    columnSpan: o.span,
    borders: o.borders,
    children: kids,
  });
}

// Standard data table: navy header, zebra rows. opts.align: per-column alignment, opts.boldLast: highlight final row
function table(headers, rows, widths, opts = {}) {
  const head = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => cell(h, widths[i], { fill: NAVY, color: WHITE, bold: true, align: opts.align?.[i] })),
  });
  const body = rows.map((r, ri) => {
    const isTotal = opts.totalRows?.includes(ri);
    return new TableRow({
      cantSplit: true,
      children: r.map((c, i) => cell(c, widths[i], {
        fill: isTotal ? LIGHT : ri % 2 ? ZEBRA : WHITE,
        bold: isTotal || (opts.boldFirst && i === 0),
        color: isTotal ? NAVY : undefined,
        align: opts.align?.[i],
      })),
    });
  });
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, borders, rows: [head, ...body] });
}

// Callout box: light blue with blue left bar
function callout(title, lines) {
  const kids = [];
  if (title) kids.push(new Paragraph({ spacing: { after: 60 }, children: [t(title, { bold: true, size: 22, color: NAVY })] }));
  lines.forEach((l) => kids.push(new Paragraph({ spacing: { after: 40, line: 276 }, children: typeof l === "string" ? [t(l, { size: 20, color: "1F2937" })] : l })));
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    borders: { top: noB, bottom: noB, right: noB, insideHorizontal: noB, insideVertical: noB, left: { style: BorderStyle.SINGLE, size: 36, color: BLUE } },
    rows: [new TableRow({ children: [new TableCell({ width: { size: W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: LIGHT, color: "auto" }, margins: { top: 140, bottom: 140, left: 220, right: 200 }, children: kids })] })],
  });
}

// Stat cards grid
function statCards(items, cols = 4) {
  const cw = Math.floor(W / cols);
  const widths = Array(cols).fill(cw); widths[cols - 1] = W - cw * (cols - 1);
  const rows = [];
  for (let i = 0; i < items.length; i += cols) {
    rows.push(new TableRow({
      children: widths.map((w, j) => {
        const it = items[i + j];
        const fill = (i / cols + j) % 2 ? BLUE : NAVY;
        return new TableCell({
          width: { size: w, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: it ? fill : WHITE, color: "auto" },
          margins: { top: 160, bottom: 160, left: 120, right: 120 },
          borders: { top: { style: BorderStyle.SINGLE, size: 24, color: WHITE }, bottom: { style: BorderStyle.SINGLE, size: 24, color: WHITE }, left: { style: BorderStyle.SINGLE, size: 24, color: WHITE }, right: { style: BorderStyle.SINGLE, size: 24, color: WHITE } },
          children: it ? [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [t(it[0], { bold: true, size: 40, color: WHITE })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [t(it[1], { size: 18, color: "DCE8FF" })] }),
          ] : [new Paragraph("")],
        });
      }),
    }));
  }
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, borders: noBorders, rows });
}

// ---------- Data ----------
const QUOTE_NO = "CDX/QT/2026/AQR-001";
const DATE = "25 November 2026";
const VALID = "24 December 2026";

const modules = [
  ["Discovery, Business Analysis & UI/UX Design", 550000, "P0", [
    "Requirement workshops with management, sales, marketing, finance and legal teams",
    "Final BRD / SRS and requirement-by-requirement compliance matrix",
    "Solution architecture, data model and integration design",
    "User journeys and wireframes for all modules; high-fidelity UI for web and mobile",
    "Design system and clickable prototype / sandbox; up to 2 revision rounds per screen set"]],
  ["Core Platform, Security & Access Control", 600000, "P1", [
    "Secure login with OTP, email/password and MFA for administrators",
    "Role-based and attribute-based access control with field-level masking (phone, email, financial data)",
    "User, team, role, permission, project, territory and master-data management",
    "Complete audit trail, consent and communication-preference management",
    "Data retention, deletion and export/download controls"]],
  ["Public Website, CMS & SEO", 800000, "P1", [
    "25+ page types: Home, Buy, Rent, New Launches, Resale, Villas, Apartments, Plots, Commercial, Luxury, Investment, Localities, Project & Property detail, Developer pages, Compare, Saved, EMI Calculator, Requirement Form, Schedule Visit, About, Contact, Blogs, FAQs, Legal",
    "Premium hero search with Buy / Rent / Commercial tabs, featured projects, launches, developer showcase, testimonials",
    "CMS for pages, projects, locations, blogs, FAQs, banners and landing pages",
    "SEO: meta tags, Open Graph, canonical URLs, XML sitemap, robots, schema markup, 301 redirects, location SEO pages",
    "Server-side rendering, CDN, image optimisation; GA4, Meta Pixel, UTM and WhatsApp-click tracking"]],
  ["Unified Inventory Management", 650000, "P1", [
    "Developer projects → towers/blocks → units with pricing, availability, offers, commission and RERA",
    "Resale, rental, commercial and plot/land inventory in one central database",
    "Statuses: Draft, Pending Approval, Live, Reserved, Sold, Rented, Inactive",
    "Approval and verification workflow with Bronze / Silver / Gold badges",
    "Galleries, master/floor/unit plans, brochures, price sheets, videos, 360° tours, watermarked downloads",
    "Price and availability change log; automatic stale-listing flags"]],
  ["Property Search, Customer Accounts & Matching", 550000, "P1", [
    "Keyword and location search with 20+ filters (budget, BHK, area, possession, RERA, furnishing, facing, amenities, developer, verified)",
    "Map-based search with synchronised map/list view, nearby places and travel distances",
    "Customer accounts: OTP login, shortlist, compare, saved searches, alerts, enquiry and visit history, requirement profile",
    "Rule-based matching across developer, resale, rental and commercial inventory with “why recommended”"]],
  ["Lead Management, Central Data Pool & Customer 360", 900000, "P1", [
    "Central lead inbox with source, campaign and property-context attribution",
    "Unique master record per customer; duplicate detection and admin-approved merge",
    "Customer 360: contact, family tree, professional, investment/financial profile, past transactions, full activity timeline",
    "Data-completeness score and Updated / Not Updated indicators per profile section",
    "Admin-configurable funnel stages, lost reasons and reactivation",
    "Assignment: manual, round-robin, project, location, source, language/skill and workload-based; auto-reassignment, manager override, history",
    "Custom fields, global search, advanced filters, segmentation, bulk tools and Excel/CSV import with mapping"]],
  ["Lead Acquisition Integrations", 400000, "P1", [
    "Meta (Facebook & Instagram) Lead Ads and Google Ads lead forms",
    "Website and landing-page forms, webhooks and REST APIs",
    "WhatsApp, inbound call and missed-call lead creation; referral tracking",
    "LinkedIn, YouTube and property portals where official APIs are available; existing CRM import/API"]],
  ["Telecalling & Cloud Telephony", 450000, "P1", [
    "Click-to-call from web and mobile with automatic call logging",
    "Incoming-call pop-up showing only role-permitted customer details",
    "Call recordings (where legally permitted), dispositions, notes, callbacks and automatic next action",
    "IVR, call queues, extensions, missed-call tracking, number masking and do-not-call controls",
    "Daily targets, talk time, connected calls, and agent- and project-wise analytics"]],
  ["Communication Hub & Marketing Automation", 700000, "P2", [
    "WhatsApp Business API: shared inbox, templates, broadcasts, automation, delivery/read/reply status",
    "Email campaigns: branded templates, personalisation, scheduling, drip journeys, open/click/bounce tracking",
    "SMS and OTP (DLT compliant), push and in-app notifications",
    "Audience segmentation, nurturing, re-engagement and project-launch campaigns",
    "Opt-in/opt-out management, campaign ROI and lead-to-sale attribution"]],
  ["Site Visit Management & Follow-up Engine", 350000, "P1", [
    "Visit request, scheduling, coordinator assignment, calendar view, reschedule and cancel",
    "Automatic reminders to customer, channel partner and salesperson",
    "Attendance, check-in/check-out, feedback and no-show tracking",
    "Post-visit outcome prompts, next-best-action task queue and overdue escalation to managers"]],
  ["Field Sales, Geofencing & Live Location", 600000, "P2", [
    "Geofences around projects, offices and sales territories",
    "Nearby projects and eligible leads for field staff",
    "Consent-based live location during configured working hours; Available / Busy / On Visit / Offline status",
    "Manager live map of field team, geofence entry/exit alerts, route history with configurable retention",
    "Duplicate-visit prevention, ownership-conflict warnings and location-based lead assignment"]],
  ["Closing, Transactions & Deal Desk", 550000, "P3", [
    "Handover to closing team; unit, booking and transaction details",
    "Payment milestones, token/advance tracking, discounts with approval workflow",
    "Document, legal, agreement and registration status tracking",
    "Workflows for developer sale, resale, rental and commercial (LOI, lease execution, renewal)",
    "Offer and counter-offer; completed transactions feed back into Customer 360"]],
  ["Revenue, Incentive & Commission Engine", 650000, "P2", [
    "Configurable attribution: salesperson, telecaller, manager, closing team, marketing source, referral and CP",
    "Fixed, percentage, tiered, target-based, team-pool and split rules by project, role and transaction type",
    "Developer commission, CP share, Aqrevia override, resale/rental brokerage and renewal fees",
    "Approval workflow with Estimated / Pending / Approved / Received / Paid statuses",
    "Incentive and commission ledger, payout records, invoice references, dispute workflow and audit trail"]],
  ["Channel Partner (CP) Network", 600000, "P2", [
    "CP onboarding with KYC/business verification, profile and service areas",
    "Access to permitted inventory, marketing material downloads and project updates",
    "Lead registration with ownership lock, duplicate check, protection rules and violation tracking",
    "CP-to-CP co-broking: requests, accept/reject, masked customer details, commission split, digital acknowledgement, disputes",
    "CP dashboard with launches, leads, visits, bookings, commissions and KPIs"]],
  ["Developer Portal & Property Owner Portal", 450000, "P2", [
    "Developer: profile, projects, units, pricing and offers, leads, visits, bookings, CP performance, inventory movement, reports, announcements",
    "Owner: verification, add/edit property, media and documents, price/rent, visit approvals, enquiries, listing performance",
    "Strict data isolation between developers and owners"]],
  ["Training Academy & CP Rewards", 350000, "P3", [
    "Courses with video/PDF lessons and assessments",
    "Bronze / Silver / Gold / Platinum certification",
    "Points for visits, bookings, referrals and revenue; leaderboard, rewards and priority inventory access"]],
  ["Dashboards, Reports & Business Intelligence", 500000, "P2", [
    "Role dashboards: CEO/Management, Manager, Telecaller, Salesperson, Marketing, CP, Developer, Inventory and Finance",
    "All minimum metrics in the RFP: leads, calls, interest, visits, sales, revenue, incentives, marketing, field and follow-up",
    "Daily, weekly, monthly and custom reports by project, team, employee, source, campaign and territory",
    "Excel / CSV / PDF export by permission and scheduled reports to management"]],
  ["Mobile Applications (Android & iOS)", 900000, "P2/P3", [
    "Customer App: search, filters, map, property details, shortlist, compare, enquiry, WhatsApp/call, visits, requirements, notifications",
    "Partner & Team App (role-based): telecaller, sales executive, manager and CP modules: calling, tasks, visit check-in/out, nearby projects, live map, lead registration, collaboration, commissions, training",
    "Offline handling for essential field activity and push notifications",
    "Google Play Store and Apple App Store publishing support"]],
  ["AI Capabilities", 600000, "P4", [
    "AI lead scoring and conversion probability",
    "Call transcription, AI call summaries and disposition suggestions",
    "Next-best-action, property recommendations and salesperson-project matching",
    "Natural-language analytics for management"]],
  ["Data Migration", 200000, "P2", [
    "Migration from existing CRM and Excel/CSV: field mapping, cleansing, de-duplication, validation and reconciliation report"]],
  ["QA, Security, Deployment, Documentation & Training", 600000, "All", [
    "Functional, regression, performance/load and security (OWASP) testing; UAT support",
    "AWS cloud setup in Aqrevia's account, CI/CD, SSL, monitoring, automated backup and tested restore",
    "API documentation, technical documentation, user manuals",
    "Training for admins, managers, telecallers, sales teams and channel partners"]],
];
const GROSS = modules.reduce((s, m) => s + m[1], 0); // 1,19,50,000
const FINAL = 11000000;
const DISCOUNT = GROSS - FINAL;
const GST = FINAL * 0.18;

// ---------- Header / footer ----------
const header = new Header({
  children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: W }],
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 4 } },
    spacing: { after: 0 },
    children: [
      new ImageRun({ type: "png", data: logo, transformation: { width: 66, height: 44 } }),
      t("\t" + "Quotation  |  " + QUOTE_NO, { size: 16, color: GREY }),
    ],
  })],
});
const footer = new Footer({
  children: [new Paragraph({
    tabStops: [{ type: TabStopType.CENTER, position: W / 2 }, { type: TabStopType.RIGHT, position: W }],
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 4 } },
    children: [
      t("codixytechnologies.com  |  +91 63003 58759", { size: 16, color: GREY }),
      t("\tConfidential", { size: 16, color: GREY }),
      new TextRun({ font: FONT, size: 16, color: GREY, children: ["\tPage ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES] }),
    ],
  })],
});

// ---------- Cover ----------
const kv = (k, v) => new TableRow({ children: [
  cell(k, 3000, { color: GREY, size: 20, borders: { top: noB, left: noB, right: noB, bottom: border } }),
  cell(v, W - 3000, { bold: true, color: NAVY, size: 20, borders: { top: noB, left: noB, right: noB, bottom: border } }),
] });

const cover = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 300 }, children: [new ImageRun({ type: "png", data: logo, transformation: { width: 300, height: 199 } })] }),
  new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [W], borders: noBorders,
    rows: [new TableRow({ children: [new TableCell({
      width: { size: W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: NAVY, color: "auto" },
      margins: { top: 360, bottom: 360, left: 400, right: 400 },
      children: [
        new Paragraph({ spacing: { after: 80 }, children: [t("TECHNICAL & COMMERCIAL PROPOSAL", { size: 20, bold: true, color: "7FB2FF", characterSpacing: 40 })] }),
        new Paragraph({ spacing: { after: 120 }, children: [t("Aqrevia Unified Real Estate Platform", { size: 48, bold: true, color: WHITE })] }),
        new Paragraph({ spacing: { after: 0 }, children: [t("CRM & Customer Intelligence  •  Property Marketplace  •  Channel Partner Network  •  Web & Mobile Apps", { size: 20, color: "DCE8FF" })] }),
      ],
    })] })],
  }),
  new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], borders: noBorders,
    rows: [new TableRow({ height: { value: 80, rule: "exact" }, children: [new TableCell({ width: { size: W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: BLUE, color: "auto" }, children: [new Paragraph("")] })] })] }),
  spacer(360),
  new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [3000, W - 3000], borders: noBorders, rows: [
    kv("Quotation No.", QUOTE_NO),
    kv("Date of Issue", DATE),
    kv("Valid Until", VALID),
    kv("Prepared For", "Aqrevia: Management & Technology Evaluation Committee"),
    kv("Prepared By", "Codixy Technologies"),
    kv("Total Investment", inr(FINAL) + " + GST (18%)"),
    kv("Delivery", "16–18 months, in 4 phases (MVP live in ~6.5 months)"),
  ] }),
  spacer(500),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [t("Codixy Technologies", { bold: true, size: 22, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [t("Web  codixytechnologies.com     |     Phone  +91 63003 58759", { size: 19, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [t("This document is confidential and intended solely for Aqrevia.", { size: 16, italics: true, color: GREY })] }),
];

// ---------- Contents ----------
const sections = [
  "Cover Letter", "Executive Summary", "Our Understanding of Your Requirements", "Applications We Will Deliver",
  "Detailed Scope & Features", "Full-Stack Technology", "Architecture, Security & Non-Functional Requirements",
  "Third-Party Integrations", "Project Timeline & Milestones", "Team & Delivery Methodology", "Commercial Proposal",
  "Payment Terms & Fund Release Structure", "Recurring Third-Party Costs", "Warranty, Support & AMC",
  "Deliverables & Handover", "Assumptions & Client Responsibilities", "Exclusions", "Terms & Conditions",
  "Requirement Compliance Summary", "Acceptance & Authorisation",
];
const contents = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 6 } }, children: [t("Contents")] }),
  ...sections.map((s, i) => new Paragraph({
    spacing: { after: 90 },
    tabStops: [{ type: TabStopType.LEFT, position: 700 }],
    children: [t(String(i + 1).padStart(2, "0"), { bold: true, color: BLUE, size: 22 }), t("\t" + s, { size: 22, color: NAVY })],
  })),
];

// ---------- Body ----------
const body = [];
const S = (n) => String(n).padStart(2, "0");
let n = 0;

// 1 Cover letter
body.push(h1(S(++n), "Cover Letter"),
  p("To,"), p([t("The Management, Aqrevia", { bold: true, size: 21, color: NAVY })]),
  p([t("Subject: ", { bold: true, size: 21 }), t("Proposal for design, development and deployment of the Aqrevia Unified Real Estate CRM, Marketplace and Digital Distribution Platform", { size: 21 })]),
  p("Dear Sir / Madam,"),
  p("Thank you for sharing your requirement documents, “Aqrevia CRM: One Stop Solution for All Business Needs” and “Aqrevia Real Estate Website, Mobile App & Digital Distribution Platform”. We have studied both documents in detail and are pleased to submit our technical and commercial proposal."),
  p("Both documents describe one connected business: inventory, distribution, transactions and relationships. Rather than building two separate systems, Codixy Technologies proposes a single unified platform with one backend, one database and one Customer 360 record. Every module (website, CRM, channel partner network, developer and owner portals, and mobile apps) works from the same source of truth. This avoids duplicate data and integration overhead, and lowers the long-term cost of ownership."),
  p("The platform will be custom-built for Aqrevia, hosted in Aqrevia's own cloud account, and handed over with full source code and intellectual property, with no per-user licence fees and no vendor lock-in."),
  p("We look forward to partnering with Aqrevia on this journey."),
  spacer(120), p("Warm regards,"),
  p([t("For Codixy Technologies", { bold: true, size: 21, color: NAVY })]),
  p("codixytechnologies.com  |  +91 63003 58759"));

// 2 Executive summary
body.push(h1(S(++n), "Executive Summary"),
  p("Aqrevia requires an enterprise-grade real-estate technology platform covering the complete journey from lead generation to commission settlement. This is an enterprise-scale build, summarised below."),
  spacer(60),
  statCards([
    ["250–300", "Screens (web + mobile)"], ["8", "Apps & portals (6 user-facing + 2 internal)"], ["21", "Functional modules"], ["10+", "Third-party integrations"],
    ["15", "User roles with field-level security"], ["4", "Delivery phases"], ["6.5 mo", "MVP go-live"], ["16–18 mo", "Full platform delivery"],
  ]),
  spacer(200),
  h2("Core business flow supported"),
  callout(null, [[t("Data Sources → Central Data Pool → Customer 360 → Telecalling → Matching → Site Visit → Offer → Booking / Closing → Agreement → Registration → Revenue, Incentive & Commission → back to Data Pool", { size: 20, bold: true, color: NAVY })]]),
  spacer(120),
  h2("Why Codixy Technologies"),
  boldLead("One unified platform: ", "CRM and marketplace share a single customer record, so there is no duplicate data and no costly integration between two systems."),
  boldLead("100% ownership: ", "source code, database, designs, API documentation and IP are transferred to Aqrevia."),
  boldLead("No per-user licence fees: ", "unlike SaaS CRMs that charge per user per month, the platform scales with your team at no licence cost."),
  boldLead("Built for Indian real estate: ", "RERA fields, DLT-compliant SMS, WhatsApp-first communication, India data hosting and DPDP Act 2023 aligned privacy controls."),
  boldLead("Phased, low-risk delivery: ", "a working MVP in about 6.5 months, then expansion without rebuilding the core."),
  boldLead("Modular and configurable: ", "funnel stages, teams, assignment rules, incentive formulas and campaigns change through settings, not code."));

// 3 Understanding
body.push(h1(S(++n), "Our Understanding of Your Requirements"),
  p("Aqrevia's two documents describe complementary systems that share about 40% of their functionality. We will deliver them as one platform:"),
  table(["Requirement Area", "What Aqrevia Needs", "Primary Users"], [
    ["CRM & Customer Intelligence", "Central data pool, Customer 360, telecalling, field sales, geofencing, closing, revenue and incentive engine, marketing automation", "Telecallers, sales executives, managers, closing, marketing, finance"],
    ["Property Marketplace", "Public website, unified inventory, search and map discovery, customer accounts, resale/rental/commercial marketplaces", "Buyers, tenants, investors, corporate occupiers"],
    ["Distribution Network", "Channel partner onboarding, lead protection, CP-to-CP co-broking, commissions, training academy and rewards", "Channel partners, brokers, agents"],
    ["Supply-side Portals", "Developer portal for projects and units; owner portal for resale and rental listings", "Developers, property owners"],
    ["Operations & Governance", "Admin panel, approvals, audit logs, consent, security, dashboards and BI", "Super admin, CRM admin, content admin, legal, management"],
  ], [2300, 4646, 2800], { boldFirst: true }),
  spacer(160),
  callout("Key principle", ["Every customer interaction enriches the Customer 360 profile, and every stage of the sales process is measurable, configurable and auditable."]));

// 4 Applications
body.push(h1(S(++n), "Applications We Will Deliver"),
  p("The platform comprises six user-facing applications and portals plus two internal workspaces, all powered by a single secure backend."),
  table(["#", "Application", "Users", "Platform"], [
    ["1", "Public Website", "Buyers, tenants, investors, visitors", "Web (SEO-optimised, responsive)"],
    ["2", "Customer Mobile App", "Registered customers", "Android & iOS"],
    ["3", "Partner & Team Mobile App", "CPs, telecallers, sales executives, managers (role-based)", "Android & iOS"],
    ["4", "Channel Partner (CP) Portal", "Brokers, agents, CP firms", "Web"],
    ["5", "Developer Portal", "Real-estate developers", "Web"],
    ["6", "Property Owner Portal", "Resale, rental and commercial owners", "Web"],
    ["7", "CRM & Sales Workspace", "Telecalling, sales, closing, marketing, finance, legal teams", "Web (internal)"],
    ["8", "Admin & Operations Panel", "Super admin, CRM admin, content admin, management", "Web (internal)"],
  ], [600, 2900, 3646, 2600], { boldFirst: false, align: [AlignmentType.CENTER] }),
  spacer(160),
  h2("User roles supported"),
  p("Super Admin (CEO/Management), CRM Admin, Sales Manager, Telecaller, Sales Executive, Site Visit Coordinator, Closing/Transaction Executive, Marketing Executive, Finance Team, Legal Team, Content Admin, Channel Partner, Developer, Property Owner and Customer. All are governed by configurable role-based permissions and field-level data masking."));

// 5 Scope
body.push(h1(S(++n), "Detailed Scope & Features"),
  p("The scope is organised into 21 modules. Phase codes: P0 Discovery, P1 MVP, P2 Network & CRM Depth, P3 Marketplace, P4 AI & Scale."));
modules.forEach((m, i) => {
  body.push(new Paragraph({
    keepNext: true, spacing: { before: 200, after: 80 },
    shading: { type: ShadingType.CLEAR, fill: LIGHT, color: "auto" },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: BLUE, space: 6 } },
    tabStops: [{ type: TabStopType.RIGHT, position: W - 100 }],
    children: [t(`${S(i + 1)}  ${m[0]}`, { bold: true, size: 23, color: NAVY }), t(`\tPhase ${m[2]}`, { size: 18, color: BLUE, bold: true })],
  }));
  m[3].forEach((f) => body.push(bullet(f)));
});

// 6 Tech
body.push(h1(S(++n), "Full-Stack Technology"),
  p("We recommend a modern, proven, TypeScript-first stack that is widely supported, scalable and easy to hand over to any future team."),
  table(["Layer", "Technology", "Why We Chose It"], [
    ["Public Website", "Next.js (React, TypeScript), Tailwind CSS", "Server-side rendering for SEO and fast page loads"],
    ["Admin, CRM & Portals", "React / Next.js, shadcn/ui, TanStack Table & Query", "Rich, fast business interfaces from one shared codebase"],
    ["Mobile Apps", "React Native (Expo), TypeScript", "One codebase for Android and iOS; shares logic with web"],
    ["Backend / APIs", "Node.js with NestJS (modular monolith), REST + WebSockets", "Clean modular architecture, ready to split into services as Aqrevia scales"],
    ["Primary Database", "PostgreSQL with PostGIS", "Reliable relational data plus geofencing and nearby queries"],
    ["Cache & Job Queues", "Redis + BullMQ", "Reminders, campaigns, assignment and incentive calculations"],
    ["Search Engine", "Typesense / OpenSearch", "Instant property search with filters and geo-search"],
    ["Real-time", "Socket.IO", "Live field map, incoming-call pop-ups, live dashboards"],
    ["CMS", "Payload CMS (headless)", "Content, blogs, SEO fields and landing pages"],
    ["Analytics & BI", "Embedded Metabase; ClickHouse at scale", "Self-service reports and high-volume analytics"],
    ["Cloud & Hosting", "AWS Mumbai region (ECS/EC2, RDS, S3, CloudFront)", "India data residency, high availability, CDN"],
    ["Security", "JWT + OTP, TOTP MFA, RBAC/ABAC, AES-256 at rest, TLS 1.2+", "Enterprise-grade protection of PII and financial data"],
    ["DevOps & Monitoring", "Docker, GitHub Actions CI/CD, Sentry, CloudWatch / Grafana", "Automated releases, error tracking, uptime alerts"],
    ["AI (Phase 4)", "LLM APIs, speech-to-text, ML scoring models", "Call summaries, lead scoring, recommendations, natural-language analytics"],
  ], [2100, 3700, 3946], { boldFirst: true }));

// 7 Architecture
body.push(h1(S(++n), "Architecture, Security & Non-Functional Requirements"),
  h2("Architecture overview"),
  callout(null, [
    [t("Clients: ", { bold: true, size: 20, color: NAVY }), t("Website  •  Customer App  •  Partner & Team App  •  CP / Developer / Owner Portals  •  CRM Workspace  •  Admin Panel", { size: 20 })],
    [t("Gateway: ", { bold: true, size: 20, color: NAVY }), t("API Gateway with authentication, rate limiting and audit logging", { size: 20 })],
    [t("Services: ", { bold: true, size: 20, color: NAVY }), t("Identity & Access  •  Inventory  •  Leads & Customer 360  •  Communication  •  Visits & Field  •  Deals & Commission  •  CP Network  •  Reporting  •  AI", { size: 20 })],
    [t("Data: ", { bold: true, size: 20, color: NAVY }), t("PostgreSQL + PostGIS  •  Redis  •  Search Index  •  S3 Object Storage  •  Analytics Store", { size: 20 })],
    [t("Integrations: ", { bold: true, size: 20, color: NAVY }), t("WhatsApp  •  Telephony  •  SMS  •  Email  •  Meta / Google Ads  •  Maps  •  Payments  •  E-sign", { size: 20 })],
  ]),
  spacer(120),
  h2("Security & privacy controls"),
  ...[
    "HTTPS everywhere, encryption in transit (TLS 1.2+) and at rest (AES-256)",
    "Role-based and attribute-based access control with field-level masking of phone, email, address and financial data",
    "MFA for administrators, OTP login, session management and secure password policies",
    "Complete, tamper-evident audit trail for profile changes, assignments, location access and exports",
    "Consent, opt-in/opt-out and do-not-contact management aligned with the Digital Personal Data Protection Act, 2023",
    "Transparent, consent-based employee location tracking limited to configured working hours with minimal retention",
    "Secure file-upload validation, API rate limiting, OWASP Top-10 security testing before launch",
    "Automated daily backups, point-in-time recovery and a documented, tested disaster-recovery procedure",
  ].map((x) => bullet(x)),
  spacer(80),
  h2("Non-functional commitments"),
  table(["Area", "Commitment"], [
    ["Performance", "Public pages target < 2.5 s load (LCP) on 4G; API p95 response < 500 ms for standard operations"],
    ["Scalability", "Designed for 500+ concurrent internal users, 10,000+ CPs, 1,00,000+ listings and millions of lead records, with horizontal scaling"],
    ["Availability", "99.5% uptime target on recommended production infrastructure with monitoring and alerts"],
    ["Responsiveness", "Desktop, tablet and mobile web; Android 9+ and iOS 15+"],
    ["Maintainability", "Modular code, coding standards, automated tests and full documentation"],
    ["Accessibility & Localisation", "Semantic, keyboard-friendly UI with good contrast; architecture ready for Indian languages"],
  ], [2600, 7146], { boldFirst: true }));

// 8 Integrations
body.push(h1(S(++n), "Third-Party Integrations"),
  p("Codixy will build and configure all integrations. Accounts and subscriptions will be registered in Aqrevia's name, as required by the RFP."),
  table(["Integration", "Recommended Providers", "Purpose", "Phase"], [
    ["WhatsApp Business API", "Meta Cloud API / Gupshup / Interakt / WATI", "Inbox, templates, campaigns, reminders", "P1"],
    ["Cloud Telephony", "Exotel / Ozonetel / Knowlarity / MyOperator", "Click-to-call, IVR, recordings, pop-ups", "P1"],
    ["SMS & OTP", "MSG91 / Gupshup (DLT registered)", "OTP, alerts, reminders, campaigns", "P1"],
    ["Email", "AWS SES / SendGrid", "Transactional and campaign email", "P1–P2"],
    ["Lead Ads", "Meta Lead Ads, Google Ads lead forms", "Automatic lead capture with attribution", "P1"],
    ["Maps & Location", "Google Maps Platform / Ola Maps / Mapbox", "Map search, nearby places, geofencing", "P1–P2"],
    ["Push Notifications", "Firebase Cloud Messaging", "Mobile and in-app alerts", "P2"],
    ["Analytics", "Google Analytics 4, Meta Pixel", "Conversion and campaign tracking", "P1"],
    ["Cloud Storage / CDN", "AWS S3 + CloudFront", "Media, documents, fast delivery", "P1"],
    ["Payment Gateway (optional)", "Razorpay / Cashfree", "Online token / booking payments", "P3"],
    ["E-sign (optional)", "Leegality / Digio", "Digital agreements and co-broking acknowledgements", "P3"],
    ["Accounting / ERP (optional)", "Tally / Zoho Books (via API)", "Invoices and payout sync", "On request"],
  ], [2300, 3000, 3146, 1300], { boldFirst: true, align: [null, null, null, AlignmentType.CENTER] }));

// 9 Timeline
body.push(h1(S(++n), "Project Timeline & Milestones"),
  p("Delivery runs in four phases plus discovery, with overlap between design and development to shorten the overall timeline."),
  table(["Phase", "Scope", "Duration", "Indicative Window"], [
    ["P0: Discovery & Design", "Workshops, BRD/SRS, compliance matrix, architecture, wireframes, high-fidelity UI, prototype", "6 weeks", "Month 1 – mid Month 2"],
    ["P1: MVP", "Core platform, website, CMS, inventory, search, customer accounts, lead management, Customer 360, lead integrations, telecalling, WhatsApp, site visits, basic dashboards", "5 months", "Month 2 – Month 7"],
    ["P2: Network & CRM Depth", "Partner & Team app, field sales and geofencing, incentive engine, campaigns, CP network, developer and owner portals, advanced reports, data migration", "5 months", "Month 7 – Month 12"],
    ["P3: Marketplace", "Resale, rental and commercial workflows, deal desk, customer mobile app, training academy and rewards", "4 months", "Month 12 – Month 16"],
    ["P4: AI & Scale", "AI lead scoring, call summaries, recommendations, natural-language analytics, advanced BI, open APIs", "2.5 months", "Month 16 – Month 18"],
  ], [2200, 4446, 1300, 1800], { boldFirst: true, align: [null, null, AlignmentType.CENTER, AlignmentType.CENTER] }),
  spacer(160),
  h2("Key milestones"),
  table(["#", "Milestone", "Target"], [
    ["M1", "Project kick-off, access and accounts set up", "Week 1"],
    ["M2", "BRD/SRS and UI/UX sign-off; sandbox / clickable prototype", "Week 6"],
    ["M3", "Phase 1 UAT release", "Month 6"],
    ["M4", "MVP production go-live (website + CRM core)", "Month 6.5 – 7"],
    ["M5", "Phase 2 UAT and go-live (mobile app, CP network, incentives)", "Month 12"],
    ["M6", "Phase 3 go-live (marketplace, customer app, academy)", "Month 16"],
    ["M7", "Phase 4 go-live, final handover and project closure", "Month 18"],
  ], [800, 6646, 2300], { align: [AlignmentType.CENTER, null, AlignmentType.CENTER] }),
  spacer(120),
  callout("Timeline dependencies", [
    "Timelines assume timely feedback (within 5 business days), availability of client stakeholders, and timely completion of third-party approvals (WhatsApp Business verification, DLT registration, Meta app review, telephony KYC). Delays in these items will extend the schedule correspondingly.",
  ]));

// 10 Team
body.push(h1(S(++n), "Team & Delivery Methodology"),
  table(["Role", "Count", "Responsibility"], [
    ["Project Manager / Business Analyst", "1", "Planning, requirements, client communication, status reporting"],
    ["Solution Architect / Tech Lead", "1", "Architecture, code quality, security, technical decisions"],
    ["UI/UX Designers", "1–2", "Research, wireframes, high-fidelity design, design system"],
    ["Backend Developers", "3", "APIs, database, integrations, rule engines"],
    ["Frontend Developers", "2–3", "Website, CRM workspace, portals, admin panel"],
    ["Mobile Developers", "2", "Customer app and Partner & Team app"],
    ["QA Engineers", "2", "Manual and automated testing, performance and security testing"],
    ["DevOps Engineer", "Part-time", "Cloud, CI/CD, monitoring, backups"],
  ], [3300, 1100, 5346], { boldFirst: true, align: [null, AlignmentType.CENTER] }),
  spacer(160),
  h2("How we work"),
  boldLead("Agile sprints: ", "two-week sprints with a demo to Aqrevia at the end of every sprint."),
  boldLead("Transparency: ", "shared project board, weekly status report and a fortnightly steering review."),
  boldLead("Environments: ", "separate Development, Staging/UAT and Production environments."),
  boldLead("Quality gates: ", "code review, automated tests and QA sign-off before every release."),
  boldLead("Single point of contact: ", "a dedicated project manager for all communication and escalation."));

// 11 Commercials
const modRows = modules.map((m, i) => [S(i + 1), m[0], m[2], inr(m[1])]);
modRows.push(["", "Gross Total", "", inr(GROSS)]);
modRows.push(["", "Less: Unified Platform Bundle Discount", "", "− " + inr(DISCOUNT)]);
modRows.push(["", "Net Project Cost (excluding GST)", "", inr(FINAL)]);
modRows.push(["", "GST @ 18%", "", inr(GST)]);
modRows.push(["", "Total Project Cost (including GST)", "", inr(FINAL + GST)]);
const L = modRows.length;
body.push(h1(S(++n), "Commercial Proposal"),
  p("All amounts are in Indian Rupees (INR). This is a one-time development cost; recurring third-party costs are listed separately in Section 13."),
  h2("Module-wise investment"),
  table(["#", "Module", "Phase", "Amount"], modRows, [700, 5846, 1100, 2100],
    { align: [AlignmentType.CENTER, null, AlignmentType.CENTER, AlignmentType.RIGHT], totalRows: [L - 5, L - 3, L - 1] }),
  spacer(200),
  h2("Phase-wise investment"),
  table(["Phase", "Scope", "Duration", "Amount (excl. GST)"], [
    ["P0", "Discovery, BRD/SRS & UI/UX Design", "6 weeks", inr(550000)],
    ["P1", "MVP: Website, CRM Core, Leads, Telecalling, WhatsApp, Site Visits", "5 months", inr(3500000)],
    ["P2", "Network & CRM Depth: Field App, Geofencing, Incentives, CP Network, Portals", "5 months", inr(3600000)],
    ["P3", "Marketplace: Resale, Rental, Commercial, Customer App, Academy", "4 months", inr(2350000)],
    ["P4", "AI & Scale: AI Features, Advanced BI, Open APIs", "2.5 months", inr(1000000)],
    ["", "Total", "16–18 months", inr(FINAL)],
  ], [900, 5246, 1500, 2100], { align: [AlignmentType.CENTER, null, AlignmentType.CENTER, AlignmentType.RIGHT], totalRows: [5] }),
  spacer(160),
  callout("Commercial highlights", [
    "No per-user licence fee. Add unlimited internal users, CPs and customers without additional licence cost.",
    "Fixed price per phase for the agreed scope. Phases 2–4 are confirmed in writing after Phase 0 sign-off.",
    "Full source code and IP transferred to Aqrevia on receipt of full payment.",
  ]));

// 12 Payment terms
const pay = [
  ["1", "On signing of agreement / purchase order", "Phase 0: 100% advance", 550000],
  ["2", "Phase 1 kick-off (after design sign-off)", "Phase 1: 30% advance", 1050000],
  ["3", "Phase 1 UAT release", "Phase 1: 40%", 1400000],
  ["4", "Phase 1 production go-live", "Phase 1: 30%", 1050000],
  ["5", "Phase 2 kick-off", "Phase 2: 30% advance", 1080000],
  ["6", "Phase 2 UAT release", "Phase 2: 40%", 1440000],
  ["7", "Phase 2 production go-live", "Phase 2: 30%", 1080000],
  ["8", "Phase 3 kick-off", "Phase 3: 30% advance", 705000],
  ["9", "Phase 3 UAT release", "Phase 3: 40%", 940000],
  ["10", "Phase 3 production go-live", "Phase 3: 30%", 705000],
  ["11", "Phase 4 kick-off", "Phase 4: 30% advance", 300000],
  ["12", "Phase 4 UAT release", "Phase 4: 40%", 400000],
  ["13", "Final go-live, source code & IP handover", "Phase 4: 30%", 300000],
];
let cum = 0;
const payRows = pay.map((r) => { cum += r[3]; return [r[0], r[1], r[2], inr(r[3]), Math.round((cum / FINAL) * 100) + "%"]; });
payRows.push(["", "Total", "", inr(cum), "100%"]);
body.push(h1(S(++n), "Payment Terms & Fund Release Structure"),
  p("Payments follow a phase-wise advance-and-milestone model. Each phase is funded by an advance at kick-off, with the remaining balance split between UAT release and production go-live. This keeps Aqrevia's investment directly tied to delivered, working software."),
  spacer(40),
  statCards([["30%", "Advance at phase kick-off"], ["40%", "On UAT release"], ["30%", "On production go-live"]], 3),
  spacer(200),
  h2("Fund release schedule"),
  table(["#", "Payment Trigger", "Basis", "Amount (excl. GST)", "Cumulative"], payRows, [600, 3746, 2200, 1900, 1300],
    { align: [AlignmentType.CENTER, null, null, AlignmentType.RIGHT, AlignmentType.CENTER], totalRows: [payRows.length - 1] }),
  spacer(160),
  h2("Payment conditions"),
  ...[
    "GST at 18% (or as applicable at the time of invoicing) is charged extra on every invoice.",
    "Invoices are payable within 7 days of the invoice date by bank transfer (NEFT / RTGS / IMPS).",
    "Work on a phase begins only after receipt of that phase's advance payment.",
    "TDS, if applicable, may be deducted as per the Income Tax Act, and the TDS certificate must be shared every quarter.",
    "Delayed payments beyond 15 days attract interest at 1.5% per month. Codixy may pause work until outstanding dues are cleared, and timelines will extend accordingly.",
    "If UAT feedback is not provided within 10 business days of a UAT release, the milestone will be deemed accepted for invoicing purposes.",
    "Third-party subscription, usage and government fees are paid directly by Aqrevia to the respective providers.",
  ].map((x) => bullet(x)),
  spacer(80),
  callout("Bank details for payment", [
    "Account Name: Codixy Technologies   |   Bank: [Bank Name]   |   A/c No.: [Account Number]",
    "IFSC: [IFSC Code]   |   Branch: [Branch]   |   GSTIN: [GSTIN]   |   PAN: [PAN]",
  ]));

// 13 Recurring
body.push(h1(S(++n), "Recurring Third-Party Costs"),
  p("The following costs are paid directly by Aqrevia to the providers and are not part of the development fee. Figures are indicative estimates at launch scale (about 50 internal users) and vary with usage and the provider's pricing at the time."),
  table(["Item", "Indicative Cost", "Billing"], [
    ["Cloud hosting (AWS Mumbai)", "₹ 15,000 – 40,000 at launch; ₹ 60,000 – 1,50,000 at scale", "Monthly"],
    ["WhatsApp Business API", "Meta per-message fees (marketing ~₹ 0.80–0.90; utility ~₹ 0.12–0.15) + provider fee ₹ 2,000–5,000 if a provider is used", "Usage / monthly"],
    ["SMS & OTP", "~₹ 0.15 – 0.25 per SMS; DLT registration (one-time, government fee)", "Usage"],
    ["Email service", "~USD 0.10 per 1,000 emails (AWS SES)", "Usage"],
    ["Cloud telephony", "~₹ 1,000 – 2,000 per agent per month + ₹ 0.50 – 1.20 per minute", "Monthly / usage"],
    ["Maps & location services", "₹ 10,000 – 1,00,000 depending on traffic and provider", "Monthly / usage"],
    ["Background-location SDK licence", "~USD 400 – 1,000", "One-time"],
    ["Apple Developer / Google Play", "USD 99 per year / USD 25 one-time", "Annual / one-time"],
    ["Monitoring, error tracking, backups", "₹ 2,000 – 8,000", "Monthly"],
    ["Domain & SSL", "Domain at actual cost; SSL free (Let's Encrypt / AWS ACM)", "Annual"],
    ["AI APIs (Phase 4)", "Usage-based, typically ₹ 5,000 – 30,000", "Monthly / usage"],
  ], [2700, 5346, 1700], { boldFirst: true }),
  spacer(120),
  callout(null, ["Estimated total at launch: about ₹ 40,000 – 80,000 per month, scaling with usage. Codixy will help optimise these costs and recommend cost-effective providers."]));

// 14 Warranty & AMC
body.push(h1(S(++n), "Warranty, Support & AMC"),
  h2("Free warranty"),
  p("Each phase includes a 3-month free warranty from its production go-live. During warranty, Codixy fixes any defect where delivered functionality deviates from the approved scope, at no cost."),
  h2("Annual Maintenance Contract (optional, after warranty)"),
  table(["Feature", "Standard AMC", "Premium AMC"], [
    ["Monthly fee (excl. GST)", inr(150000), inr(200000)],
    ["Bug fixes & security patches", "Included", "Included"],
    ["Server monitoring & backups", "Included", "Included, 24×7 alerting"],
    ["Minor enhancements", "Up to 40 hours / month", "Up to 80 hours / month"],
    ["Support hours", "Mon–Sat, 10 AM – 7 PM IST", "Mon–Sun, extended hours"],
    ["Dedicated account manager", "No", "Yes"],
    ["Monthly health & performance report", "Yes", "Yes, with quarterly review"],
  ], [3746, 3000, 3000], { boldFirst: true, align: [null, AlignmentType.CENTER, AlignmentType.CENTER] }),
  spacer(160),
  h2("Support SLA"),
  table(["Severity", "Definition", "Response", "Resolution Target"], [
    ["Critical (S1)", "Production down or core business blocked", "2 hours", "8 hours"],
    ["High (S2)", "Major feature not working, no workaround", "4 hours", "24 hours"],
    ["Medium (S3)", "Feature impaired, workaround available", "1 business day", "3 business days"],
    ["Low (S4)", "Cosmetic issue or minor query", "2 business days", "Next scheduled release"],
  ], [1800, 3946, 1800, 2200], { boldFirst: true, align: [null, null, AlignmentType.CENTER, AlignmentType.CENTER] }));

// 15 Deliverables
body.push(h1(S(++n), "Deliverables & Handover"),
  ...[
    "Business Requirement Document (BRD), Software Requirement Specification (SRS) and requirement compliance matrix",
    "Solution architecture, database schema and integration design documents",
    "UI/UX design files (Figma) and design system",
    "Public website, CRM workspace, admin panel, CP, developer and owner portals: production deployed",
    "Customer App and Partner & Team App published on Google Play Store and Apple App Store",
    "Complete source code in Aqrevia's Git repository, with build and deployment scripts",
    "API documentation (OpenAPI/Swagger), technical documentation and deployment runbook",
    "User manuals and training videos for each role",
    "Training sessions for admins, managers, telecallers, sales teams and channel partners",
    "Test plans, test reports, security test report, and backup and restore test report",
    "Credentials and ownership handover of all infrastructure and third-party accounts",
  ].map((x) => bullet(x)));

// 16 Assumptions
body.push(h1(S(++n), "Assumptions & Client Responsibilities"),
  h2("Assumptions"),
  ...[
    "The platform is built for Aqrevia's own business use (single organisation). A multi-tenant SaaS version for resale to other businesses is not included and can be quoted separately.",
    "Final screens, field-level rules, incentive formulas and workflows will be frozen in the Phase 0 BRD/SRS. Changes after sign-off follow the change-request process.",
    "LinkedIn, YouTube and property-portal integrations depend on the availability of official APIs and partner access from those platforms.",
    "The English language is used at launch; the architecture will support Indian languages in future.",
    "UI design includes up to 2 revision rounds per screen set.",
  ].map((x) => bullet(x)),
  h2("Aqrevia's responsibilities"),
  ...[
    "Nominate a single point of contact (SPOC) with decision-making authority and give feedback within 5 business days.",
    "Provide content, property data, images, brand guidelines, legal text (privacy policy, terms) and sample incentive/commission formulas.",
    "Create and own accounts for AWS, WhatsApp Business, telephony, SMS (DLT), email, maps, Apple and Google developer programmes, and share access with Codixy.",
    "Complete KYC and verification for third-party providers on time.",
    "Provide existing CRM and Excel data with export access for migration.",
    "Carry out UAT with business users and sign off within the agreed time.",
  ].map((x) => bullet(x)));

// 17 Exclusions
body.push(h1(S(++n), "Exclusions"),
  p("The following are not included in this quotation and can be provided on request at additional cost:"),
  ...[
    "Third-party subscription, usage, licence and government fees (cloud, WhatsApp, SMS, telephony, maps, app store, DLT, etc.)",
    "Content writing, professional photography, videography, 3D renders and 360° tour production",
    "Paid digital marketing, ad campaign management and SEO content creation beyond technical SEO",
    "Hardware, telephony devices, office network and on-premise infrastructure",
    "Multi-tenant SaaS or white-label version of the CRM",
    "Native ERP / accounting implementation (only API integration is in scope, on request)",
    "Features not explicitly listed in this document or the signed-off BRD/SRS",
    "Legal advice on compliance; Codixy implements technical controls, while legal compliance sign-off remains with Aqrevia",
  ].map((x) => bullet(x)));

// 18 T&C
const tc = [
  ["Validity", "This quotation is valid for 30 days from the date of issue (until " + VALID + ")."],
  ["Scope & Change Requests", "Work is limited to the scope in this document and the signed-off BRD/SRS. Any addition or change will be assessed for effort, cost and timeline impact, and taken up only after written approval of a change request. Change requests are billed at ₹ 1,000 per hour or as mutually agreed."],
  ["Intellectual Property", "On receipt of full payment, all rights to the custom source code, designs, database and documentation developed for this project transfer to Aqrevia. Codixy retains rights to its pre-existing tools, libraries and generic components, which are licensed to Aqrevia perpetually and royalty-free for use within this platform. Open-source components remain under their respective licences."],
  ["Confidentiality", "Both parties will keep all business, technical and customer information confidential during the engagement and for 3 years after it ends. A separate NDA can be executed if required."],
  ["Data Protection", "Codixy will process Aqrevia's data only to deliver this project, will follow the security controls described in this document, and will not retain production data after handover except as required for support."],
  ["Acceptance", "Each release is accepted on successful UAT. Aqrevia will report defects within 10 business days of a UAT release; otherwise the release is deemed accepted. Go-live may proceed with no open Critical or High severity defects."],
  ["Warranty", "3 months from the go-live of each phase, covering defects against the approved scope. The warranty does not cover changes made by third parties, misuse, or issues caused by third-party services or infrastructure outside Codixy's control."],
  ["Delays", "Timelines are subject to timely payments, feedback, content, approvals and third-party verifications. Delays attributable to Aqrevia or third parties extend timelines correspondingly. A project paused at Aqrevia's request for more than 60 days may be re-planned, subject to resource availability."],
  ["Termination", "Either party may terminate with 30 days' written notice. On termination, Aqrevia pays for all work completed up to the termination date, and Codixy hands over the work product for which payment has been received. Advances for work not yet started will be adjusted against work completed."],
  ["Limitation of Liability", "Codixy's total aggregate liability under this engagement is limited to the fees actually received for the phase in which the claim arises. Neither party is liable for indirect, incidental or consequential damages, including loss of profits or data."],
  ["Non-Solicitation", "During the engagement and for 12 months after it ends, neither party will directly solicit or hire the other party's employees involved in this project without written consent."],
  ["Force Majeure", "Neither party is liable for delays caused by events beyond reasonable control, including natural disasters, pandemics, government actions, war, or widespread internet or cloud-provider outages."],
  ["Governing Law & Disputes", "This engagement is governed by the laws of India. Disputes will first be resolved through mutual discussion, failing which through arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration at [City]."],
  ["Entire Agreement", "This proposal, together with the signed Master Services Agreement and the approved BRD/SRS, forms the entire agreement. In case of conflict, the signed agreement prevails."],
];
body.push(h1(S(++n), "Terms & Conditions"),
  ...tc.flatMap(([k, v], i) => [
    new Paragraph({ keepNext: true, spacing: { before: 140, after: 40 }, children: [t(`${n}.${i + 1}  ${k}`, { bold: true, size: 22, color: NAVY })] }),
    p(v),
  ]));

// 19 Compliance
const C = "Custom", TP = "Custom + Third-Party";
body.push(h1(S(++n), "Requirement Compliance Summary"),
  p("A summary of Codixy's response against Aqrevia's requirement documents. A detailed line-by-line compliance matrix will be delivered in Phase 0. Because the platform is custom-built for Aqrevia, all functionality is classified as Custom development, with external providers where noted."),
  table(["Requirement Area (RFP Reference)", "Response", "Phase", "Status"], [
    ["Data sources & lead acquisition (CRM §4, Platform §12, §26)", TP, "P1", "✔ Covered"],
    ["Central data pool & Customer 360 (CRM §5, Platform §12.1)", C, "P1", "✔ Covered"],
    ["Configurable sales funnel (CRM §6)", C, "P1", "✔ Covered"],
    ["Telecalling & cloud telephony (CRM §7–8)", TP, "P1", "✔ Covered"],
    ["WhatsApp, email & SMS (CRM §9–11, Platform §22)", TP, "P1–P2", "✔ Covered"],
    ["Project management & project-wise teams (CRM §12–13)", C, "P1", "✔ Covered"],
    ["Lead assignment & distribution (CRM §14)", C, "P1", "✔ Covered"],
    ["Field sales & site visits (CRM §15, §20, Platform §15)", C, "P1–P2", "✔ Covered"],
    ["Geofencing & live location (CRM §16–19)", TP, "P2", "✔ Covered"],
    ["Closing & transaction management (CRM §21, Platform §16)", C, "P3", "✔ Covered"],
    ["Revenue, incentive & commission engine (CRM §22–23, Platform §17)", C, "P2", "✔ Covered"],
    ["Dashboards, KPIs & reports (CRM §24–27, §37, §39, Platform §28)", C, "P1–P2", "✔ Covered"],
    ["Marketing automation & segmentation (CRM §28–29)", C, "P2", "✔ Covered"],
    ["Roles, security, privacy & audit (CRM §32–34, Platform §4, §31)", C, "P1", "✔ Covered"],
    ["Public website, CMS & SEO (Platform §5, §23)", C, "P1", "✔ Covered"],
    ["Search, discovery & detail pages (Platform §6–7, §25)", TP, "P1", "✔ Covered"],
    ["Customer accounts & requirements (Platform §8)", C, "P1", "✔ Covered"],
    ["Unified inventory, approval & verification (Platform §9–10, §24)", C, "P1", "✔ Covered"],
    ["CP network, lead protection & co-broking (Platform §11, §14)", C, "P2", "✔ Covered"],
    ["Property matching (Platform §13)", C, "P1 / P4 (AI)", "✔ Covered"],
    ["Developer & owner portals (Platform §18–19)", C, "P2", "✔ Covered"],
    ["Resale, rental & commercial marketplaces (Platform §20–21)", C, "P3", "✔ Covered"],
    ["Training academy & rewards (Platform §27)", C, "P3", "✔ Covered"],
    ["Mobile applications (CRM §36, Platform §29)", TP, "P2–P3", "✔ Covered"],
    ["Admin & operations panel (Platform §30)", C, "P1", "✔ Covered"],
    ["AI capabilities (CRM §41, Platform §41)", TP, "P4", "✔ Covered"],
    ["Payment gateway, e-sign, ERP (Platform §33)", "Third-Party (optional)", "P3 / On request", "◐ Optional"],
  ], [4600, 2146, 1500, 1500], { align: [null, null, AlignmentType.CENTER, AlignmentType.CENTER] }));

// 20 Acceptance
const sigCell = (title, lines) => new TableCell({
  width: { size: W / 2, type: WidthType.DXA },
  margins: { top: 200, bottom: 200, left: 200, right: 200 },
  shading: { type: ShadingType.CLEAR, fill: ZEBRA, color: "auto" },
  children: [
    new Paragraph({ spacing: { after: 200 }, children: [t(title, { bold: true, size: 22, color: NAVY })] }),
    ...lines.map((l) => new Paragraph({ spacing: { after: 260 }, children: [t(l, { size: 20, color: "1F2937" })] })),
  ],
});
const sigLines = ["Name: ____________________________", "Designation: ______________________", "Signature: ________________________", "Date: _____________________________", "Company Seal:"];
body.push(h1(S(++n), "Acceptance & Authorisation"),
  p("By signing below, both parties accept this proposal, including the scope, commercials, payment schedule and terms and conditions, as the basis for the Master Services Agreement."),
  spacer(120),
  new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W / 2, W / 2], borders,
    rows: [new TableRow({ children: [sigCell("For Aqrevia", sigLines), sigCell("For Codixy Technologies", sigLines)] })] }),
  spacer(400),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new ImageRun({ type: "png", data: logo, transformation: { width: 120, height: 80 } })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [t("Thank you for considering Codixy Technologies.", { bold: true, size: 24, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [t("codixytechnologies.com   |   +91 63003 58759", { size: 20, color: BLUE })] }));

// ---------- Document ----------
const doc = new Document({
  creator: "Codixy Technologies",
  title: "Quotation – Aqrevia Unified Real Estate Platform",
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 34, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 220 }, keepNext: true, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { font: FONT, size: 25, bold: true, color: BLUE }, paragraph: { spacing: { before: 220, after: 100 }, keepNext: true, outlineLevel: 1 } },
    ],
  },
  numbering: { config: [{ reference: "bul", levels: [
    { level: 0, format: LevelFormat.BULLET, text: "▪", alignment: AlignmentType.LEFT, style: { run: { color: BLUE }, paragraph: { indent: { left: 460, hanging: 280 } } } },
    { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 900, hanging: 280 } } } },
  ] }] },
  sections: [{
    properties: { titlePage: true, page: { margin: { top: 1080, bottom: 1000, left: 1080, right: 1080, header: 500, footer: 450 } } },
    headers: { default: header, first: new Header({ children: [new Paragraph("")] }) },
    footers: { default: footer, first: new Footer({ children: [new Paragraph("")] }) },
    children: [...cover, ...contents, ...body],
  }],
});

Packer.toBuffer(doc).then((b) => { fs.writeFileSync(OUT, b); console.log("OK", OUT, "gross", GROSS, "discount", DISCOUNT, "paysum", cum); });
