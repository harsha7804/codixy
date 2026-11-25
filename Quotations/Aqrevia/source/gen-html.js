const fs = require("fs");
const path = require("path");
const OUT = process.argv[2];
const logo = "data:image/png;base64," + fs.readFileSync(path.join(__dirname, "logo-sm.png")).toString("base64");
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const QUOTE = "CDX/QT/2026/AQR-001";

const modules = [
  ["Discovery, Business Analysis & UI/UX Design", 550000, "P0", ["Stakeholder workshops across management, sales, marketing, finance and legal", "Final BRD / SRS with requirement-by-requirement compliance matrix", "Solution architecture, data model and integration design", "Wireframes and high-fidelity UI for web and mobile, design system", "Clickable prototype / sandbox; 2 revision rounds per screen set"]],
  ["Core Platform, Security & Access Control", 600000, "P1", ["OTP, email/password login and MFA for administrators", "Role- and attribute-based access with field-level masking", "Users, teams, roles, projects, territories and master data", "Complete audit trail, consent and communication preferences", "Data retention, deletion and export controls"]],
  ["Public Website, CMS & SEO", 800000, "P1", ["25+ page types: Buy, Rent, New Launches, Resale, Villas, Plots, Commercial, Luxury, Localities, Project & Property detail, Compare, EMI Calculator, Blogs and more", "Premium hero search with Buy / Rent / Commercial tabs", "CMS for pages, projects, locations, blogs, FAQs, banners, landing pages", "Technical SEO: meta, Open Graph, canonical, sitemap, schema, 301s, location pages", "Server-side rendering, CDN, GA4, Meta Pixel, UTM and WhatsApp-click tracking"]],
  ["Unified Inventory Management", 650000, "P1", ["Projects → towers/blocks → units with pricing, offers, commission and RERA", "Resale, rental, commercial and plot inventory in one database", "Draft, Pending, Live, Reserved, Sold, Rented and Inactive statuses", "Verification workflow with Bronze / Silver / Gold badges", "Plans, brochures, price sheets, videos, 360° tours, watermarked downloads", "Price-change log and automatic stale-listing flags"]],
  ["Property Search, Customer Accounts & Matching", 550000, "P1", ["Keyword and location search with 20+ filters", "Map search with synced map/list, nearby places and distances", "Customer accounts: shortlist, compare, saved searches, alerts, visit history", "Rule-based matching across all inventory with “why recommended”"]],
  ["Lead Management, Data Pool & Customer 360", 900000, "P1", ["Central lead inbox with source, campaign and property attribution", "Unique master record, duplicate detection, approved merge", "Customer 360: family, profession, investments, transactions, timeline", "Completeness score and Updated / Not Updated indicators", "Configurable funnel stages, lost reasons and reactivation", "Round-robin, project, location, source, skill and workload assignment", "Custom fields, global search, segmentation, bulk Excel/CSV import"]],
  ["Lead Acquisition Integrations", 400000, "P1", ["Meta (Facebook & Instagram) Lead Ads and Google Ads lead forms", "Website forms, webhooks and REST APIs", "WhatsApp, inbound call and missed-call leads; referral tracking", "LinkedIn, YouTube and portals where official APIs exist"]],
  ["Telecalling & Cloud Telephony", 450000, "P1", ["Click-to-call from web and mobile with auto call logging", "Incoming-call pop-up with permitted customer details", "Recordings, dispositions, callbacks and automatic next action", "IVR, queues, missed calls, number masking, do-not-call controls", "Targets, talk time and agent- and project-wise analytics"]],
  ["Communication Hub & Marketing Automation", 700000, "P2", ["WhatsApp Business API: shared inbox, templates, broadcasts, automation", "Branded email campaigns, drip journeys, open/click/bounce tracking", "DLT-compliant SMS & OTP, push and in-app notifications", "Segmentation, nurturing, re-engagement and launch campaigns", "Opt-in/opt-out, campaign ROI and lead-to-sale attribution"]],
  ["Site Visit Management & Follow-up Engine", 350000, "P1", ["Scheduling, coordinator assignment, calendar, reschedule/cancel", "Automatic reminders to customer, CP and salesperson", "Attendance, check-in/out, feedback and no-show tracking", "Follow-up task queue and overdue escalation"]],
  ["Field Sales, Geofencing & Live Location", 600000, "P2", ["Geofences around projects, offices and territories", "Nearby projects and eligible leads for field staff", "Consent-based live location in working hours; availability status", "Manager live map, entry/exit alerts, route history", "Duplicate-visit prevention and location-based assignment"]],
  ["Closing, Transactions & Deal Desk", 550000, "P3", ["Closing-team handover, unit, booking and transaction details", "Payment milestones, token tracking, approved discounts", "Document, agreement and registration tracking", "Developer sale, resale, rental and commercial workflows", "Offers and counter-offers; feeds back into Customer 360"]],
  ["Revenue, Incentive & Commission Engine", 650000, "P2", ["Attribution to salesperson, telecaller, manager, closing, source, referral, CP", "Fixed, percentage, tiered, target, pool and split rules", "Developer commission, CP share, Aqrevia override, brokerage, renewals", "Estimated → Pending → Approved → Received → Paid workflow", "Ledger, payouts, invoice references, disputes and audit trail"]],
  ["Channel Partner (CP) Network", 600000, "P2", ["CP onboarding with KYC and business verification", "Permitted inventory, marketing material and project updates", "Lead registration with ownership lock and violation tracking", "CP-to-CP co-broking with masked details and commission split", "CP dashboard with KPIs"]],
  ["Developer Portal & Property Owner Portal", 450000, "P2", ["Developer: projects, units, pricing, leads, visits, bookings, CP performance", "Owner: listings, media, documents, price/rent, visit approvals, enquiries", "Strict data isolation between developers and owners"]],
  ["Training Academy & CP Rewards", 350000, "P3", ["Video/PDF courses and assessments", "Bronze / Silver / Gold / Platinum certification", "Points, leaderboard, rewards and priority inventory access"]],
  ["Dashboards, Reports & Business Intelligence", 500000, "P2", ["Dashboards for CEO, manager, telecaller, sales, marketing, CP, developer, finance", "Every minimum metric in the RFP", "Project, team, employee, source and territory reports", "Excel / CSV / PDF export and scheduled email reports"]],
  ["Mobile Applications (Android & iOS)", 900000, "P2/P3", ["Customer App: search, map, shortlist, compare, enquiry, visits, alerts", "Partner & Team App: telecaller, sales, manager and CP modules by role", "Offline handling for essential field work, push notifications", "Play Store and App Store publishing"]],
  ["AI Capabilities", 600000, "P4", ["AI lead scoring and conversion probability", "Call transcription, summaries and disposition suggestions", "Next-best-action and property recommendations", "Natural-language analytics for management"]],
  ["Data Migration", 200000, "P2", ["Mapping, cleansing, de-duplication, validation and reconciliation from existing CRM and Excel"]],
  ["QA, Security, Deployment, Docs & Training", 600000, "All", ["Functional, regression, load and OWASP security testing; UAT support", "AWS setup in Aqrevia's account, CI/CD, monitoring, tested backups", "API docs, technical documentation, user manuals", "Role-wise training for admins, managers, telecallers, sales and CPs"]],
];
const GROSS = modules.reduce((s, m) => s + m[1], 0), FINAL = 11000000, DISC = GROSS - FINAL, GST = FINAL * 0.18;

const apps = [
  ["Public Website", "Buyers, tenants, investors", "Web · SEO"],
  ["Customer App", "Registered customers", "Android · iOS"],
  ["Partner & Team App", "CPs, telecallers, sales, managers", "Android · iOS"],
  ["CP Portal", "Brokers, agents, CP firms", "Web"],
  ["Developer Portal", "Real-estate developers", "Web"],
  ["Owner Portal", "Resale, rental, commercial owners", "Web"],
  ["CRM & Sales Workspace", "Telecalling, sales, closing, marketing, finance", "Web · internal"],
  ["Admin & Operations Panel", "Super admin, CRM admin, content admin", "Web · internal"],
];

const stack = [
  ["Public website", "Next.js, React, TypeScript, Tailwind CSS", "Server-side rendering for SEO and fast loads"],
  ["CRM, portals & admin", "React / Next.js, shadcn/ui, TanStack", "Rich business interfaces from one codebase"],
  ["Mobile apps", "React Native (Expo), TypeScript", "One codebase for Android and iOS"],
  ["Backend & APIs", "Node.js, NestJS, REST + WebSockets", "Modular, ready to split into services at scale"],
  ["Database", "PostgreSQL + PostGIS", "Relational data plus geofencing queries"],
  ["Cache & queues", "Redis + BullMQ", "Reminders, campaigns, incentive jobs"],
  ["Search", "Typesense / OpenSearch", "Instant filtered and geo search"],
  ["Real-time", "Socket.IO", "Live field map, call pop-ups, dashboards"],
  ["CMS", "Payload CMS", "Content, blogs, SEO fields, landing pages"],
  ["Analytics", "Metabase; ClickHouse at scale", "Self-service and high-volume reporting"],
  ["Cloud", "AWS Mumbai: ECS, RDS, S3, CloudFront", "India data residency and high availability"],
  ["Security", "OTP + JWT, TOTP MFA, RBAC/ABAC, AES-256, TLS 1.2+", "Protection of PII and financial data"],
  ["DevOps", "Docker, GitHub Actions, Sentry, Grafana", "Automated releases and monitoring"],
  ["AI (Phase 4)", "LLM APIs, speech-to-text, ML scoring", "Summaries, scoring, recommendations"],
];

const integrations = [
  ["WhatsApp Business API", "Meta Cloud API / Gupshup / Interakt / WATI", "P1"],
  ["Cloud telephony", "Exotel / Ozonetel / Knowlarity / MyOperator", "P1"],
  ["SMS & OTP", "MSG91 / Gupshup (DLT registered)", "P1"],
  ["Email", "AWS SES / SendGrid", "P1–P2"],
  ["Lead ads", "Meta Lead Ads, Google Ads lead forms", "P1"],
  ["Maps & location", "Google Maps / Ola Maps / Mapbox", "P1–P2"],
  ["Push notifications", "Firebase Cloud Messaging", "P2"],
  ["Analytics", "Google Analytics 4, Meta Pixel", "P1"],
  ["Storage & CDN", "AWS S3 + CloudFront", "P1"],
  ["Payments (optional)", "Razorpay / Cashfree", "P3"],
  ["E-sign (optional)", "Leegality / Digio", "P3"],
  ["Accounting (optional)", "Tally / Zoho Books API", "On request"],
];

const phases = [
  ["P0", "Discovery & Design", 0, 1.5, "6 weeks", 550000, "Workshops, BRD/SRS, architecture, UI/UX, prototype"],
  ["P1", "MVP", 1.5, 6.5, "5 months", 3500000, "Website, CMS, inventory, search, leads, Customer 360, telecalling, WhatsApp, site visits"],
  ["P2", "Network & CRM Depth", 6.5, 11.5, "5 months", 3600000, "Team app, geofencing, incentives, campaigns, CP network, portals, migration"],
  ["P3", "Marketplace", 11.5, 15.5, "4 months", 2350000, "Resale, rental, commercial, deal desk, customer app, academy"],
  ["P4", "AI & Scale", 15.5, 18, "2.5 months", 1000000, "AI scoring, call summaries, recommendations, advanced BI, open APIs"],
];
const milestones = [
  ["M1", "Kick-off, access and accounts set up", "Week 1"],
  ["M2", "BRD/SRS and UI/UX sign-off, sandbox", "Week 6"],
  ["M3", "Phase 1 UAT release", "Month 6"],
  ["M4", "MVP production go-live", "Month 6.5–7"],
  ["M5", "Phase 2 go-live", "Month 12"],
  ["M6", "Phase 3 go-live", "Month 16"],
  ["M7", "Final go-live and handover", "Month 18"],
];

const pay = [
  ["Signing of agreement / PO", "P0 · 100% advance", 550000],
  ["Phase 1 kick-off", "P1 · 30% advance", 1050000], ["Phase 1 UAT release", "P1 · 40%", 1400000], ["Phase 1 go-live", "P1 · 30%", 1050000],
  ["Phase 2 kick-off", "P2 · 30% advance", 1080000], ["Phase 2 UAT release", "P2 · 40%", 1440000], ["Phase 2 go-live", "P2 · 30%", 1080000],
  ["Phase 3 kick-off", "P3 · 30% advance", 705000], ["Phase 3 UAT release", "P3 · 40%", 940000], ["Phase 3 go-live", "P3 · 30%", 705000],
  ["Phase 4 kick-off", "P4 · 30% advance", 300000], ["Phase 4 UAT release", "P4 · 40%", 400000], ["Final go-live, code & IP handover", "P4 · 30%", 300000],
];

const recurring = [
  ["Cloud hosting (AWS Mumbai)", "₹15k–40k at launch; ₹60k–1.5L at scale", "Monthly"],
  ["WhatsApp Business API", "Marketing ~₹0.80–0.90 / msg; utility ~₹0.12–0.15 / msg; provider ₹2k–5k", "Usage"],
  ["SMS & OTP", "~₹0.15–0.25 per SMS + one-time DLT registration", "Usage"],
  ["Email", "~USD 0.10 per 1,000 emails", "Usage"],
  ["Cloud telephony", "₹1k–2k per agent + ₹0.50–1.20 per minute", "Monthly"],
  ["Maps & location", "₹10k–1L depending on traffic", "Monthly"],
  ["Background-location SDK", "~USD 400–1,000", "One-time"],
  ["Apple / Google developer", "USD 99 per year / USD 25 one-time", "Annual"],
  ["Monitoring & backups", "₹2k–8k", "Monthly"],
  ["AI APIs (Phase 4)", "₹5k–30k, usage-based", "Monthly"],
];

const tc = [
  ["Validity", "This quotation is valid for 30 days, until 24 December 2026."],
  ["Change requests", "Work is limited to this document and the signed-off BRD/SRS. Changes are estimated for cost and time and taken up after written approval, at ₹1,000 per hour or as agreed."],
  ["Intellectual property", "On full payment, rights to custom source code, designs, database and documentation transfer to Aqrevia. Codixy's pre-existing generic components are licensed perpetually and royalty-free for this platform."],
  ["Confidentiality", "Both parties keep business, technical and customer information confidential during the engagement and for 3 years after. An NDA can be signed on request."],
  ["Acceptance", "Each release is accepted on successful UAT. Defects must be reported within 10 business days of a UAT release, otherwise the release is deemed accepted."],
  ["Warranty", "3 months from each phase go-live, for defects against approved scope. Excludes third-party changes, misuse and outages of services outside Codixy's control."],
  ["Delays", "Timelines depend on timely payments, feedback, content and third-party approvals. Delays from these extend the schedule accordingly."],
  ["Termination", "Either party may terminate with 30 days' written notice. Aqrevia pays for work completed; Codixy hands over all paid work product."],
  ["Limitation of liability", "Codixy's total liability is limited to fees received for the phase in which a claim arises. No liability for indirect or consequential loss."],
  ["Non-solicitation", "Neither party hires the other's project staff during the engagement and for 12 months after, without written consent."],
  ["Force majeure", "Neither party is liable for delays caused by events beyond reasonable control."],
  ["Governing law", "Laws of India. Disputes go to mutual discussion, then arbitration under the Arbitration and Conciliation Act, 1996."],
];

const compliance = [
  ["Lead acquisition & attribution", "P1"], ["Data pool & Customer 360", "P1"], ["Configurable sales funnel", "P1"], ["Telecalling & telephony", "P1"],
  ["WhatsApp, email & SMS", "P1–P2"], ["Projects & project-wise teams", "P1"], ["Lead assignment rules", "P1"], ["Field sales & site visits", "P1–P2"],
  ["Geofencing & live location", "P2"], ["Closing & transactions", "P3"], ["Revenue, incentive & commission", "P2"], ["Dashboards & reports", "P1–P2"],
  ["Marketing automation", "P2"], ["Security, privacy & audit", "P1"], ["Website, CMS & SEO", "P1"], ["Search & detail pages", "P1"],
  ["Customer accounts", "P1"], ["Inventory & verification", "P1"], ["CP network & co-broking", "P2"], ["Developer & owner portals", "P2"],
  ["Resale, rental & commercial", "P3"], ["Academy & rewards", "P3"], ["Mobile apps", "P2–P3"], ["AI capabilities", "P4"],
];

// ---------- render helpers ----------
const phaseCls = (p) => "ph-" + p.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
const table = (head, rows, cls = "") => `<div class="tbl-wrap"><table class="${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr${r.cls ? ` class="${r.cls}"` : ""}>${(r.cells || r).map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const ul = (items) => `<ul class="ticks">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

const nav = [
  ["summary", "Summary"], ["apps", "Applications"], ["scope", "Scope & features"], ["stack", "Technology"],
  ["security", "Security"], ["integrations", "Integrations"], ["timeline", "Timeline"], ["budget", "Budget"],
  ["payment", "Payment terms"], ["recurring", "Recurring costs"], ["support", "Warranty & AMC"], ["terms", "Terms"], ["compliance", "Compliance"], ["accept", "Acceptance"],
];
const sec = (id, num, title, inner, lead = "") => `<section id="${id}" class="sec"><header class="sec-head"><span class="sec-num">${num}</span><h2>${title}</h2></header>${lead ? `<p class="lead">${lead}</p>` : ""}${inner}</section>`;

let cum = 0;
const months = Array.from({ length: 19 }, (_, i) => i);

const html = `<title>Aqrevia Platform Quotation</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap">
<style>
/* Layout: navy cover band, then a sticky section rail beside a single reading column of proposal sections */
:root{
  --bg:#F4F7FC; --surface:#FFFFFF; --ink:#0B1F4D; --text:#1C2740; --muted:#5A6684; --line:#DCE4F2;
  --blue:#0A66FF; --blue-soft:#E8F0FF; --band:#0B1F4D; --band-text:#FFFFFF; --band-muted:#A9C2F5; --ok:#0E9F6E;
  --display:"Sora", "Segoe UI", system-ui, sans-serif; --body:"Inter", "Segoe UI", system-ui, sans-serif;
  --r:10px;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#0A1222; --surface:#111C33; --ink:#E7EEFC; --text:#D3DCEE; --muted:#93A2C2; --line:#22304D;
  --blue:#5B95FF; --blue-soft:#16264A; --band:#081633; --band-text:#FFFFFF; --band-muted:#9DB8EE; --ok:#34C38F; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#0A1222; --surface:#111C33; --ink:#E7EEFC; --text:#D3DCEE; --muted:#93A2C2; --line:#22304D;
  --blue:#5B95FF; --blue-soft:#16264A; --band:#081633; --band-text:#FFFFFF; --band-muted:#9DB8EE; --ok:#34C38F; color-scheme:dark}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:84px}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
body{background:var(--bg);color:var(--text);font:400 15px/1.65 var(--body);font-variant-numeric:tabular-nums}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--surface)}
a{color:var(--blue)}
h1,h2,h3{font-family:var(--display);color:var(--ink);text-wrap:balance;margin:0}
.wrap{max-width:1180px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}

/* top bar */
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:20;background:var(--surface);border-bottom:1px solid var(--line)}
.bar .wrap{display:flex;align-items:center;gap:16px;padding-block:10px}
.logo-chip{background:#fff;border-radius:8px;padding:4px 8px;display:flex;align-items:center}
.logo-chip img{height:36px;width:auto;display:block}
.bar .qno{font-size:13px;color:var(--muted);margin-left:auto;white-space:nowrap}
.bar .qno b{color:var(--ink);font-weight:600}

/* cover */
.cover{background:var(--band);color:var(--band-text);margin-top:0}
.cover .wrap{padding-block:56px 0}
.eyebrow{font:600 12px/1 var(--body);letter-spacing:.18em;text-transform:uppercase;color:var(--band-muted)}
.cover h1{color:var(--band-text);font-size:clamp(30px,5vw,52px);line-height:1.08;margin:14px 0 16px;max-width:15ch}
.cover p.sub{color:#D6E2FB;max-width:62ch;margin:0 0 32px;font-size:16px}
.meta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:rgba(255,255,255,.14);border-radius:var(--r) var(--r) 0 0;overflow:hidden}
.meta div{background:rgba(255,255,255,.05);padding:16px 18px;min-width:0}
.meta dt{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--band-muted)}
.meta dd{margin:4px 0 0;font:600 17px/1.3 var(--display);color:#fff}
.cover-rule{height:6px;background:linear-gradient(90deg,#0A66FF,#1E90FF)}

/* layout */
.layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:48px;padding-block:40px 80px}
.rail{position:sticky;top:84px;align-self:start;font-size:14px}
.rail p{font:600 12px/1 var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 12px}
.rail ol{list-style:none;margin:0;padding:0;border-left:2px solid var(--line)}
.rail a{display:block;padding:6px 0 6px 14px;margin-left:-2px;border-left:2px solid transparent;color:var(--muted);text-decoration:none}
.rail a:hover,.rail a:focus-visible{color:var(--blue);border-left-color:var(--blue);outline:none}
main{min-width:0;display:flex;flex-direction:column;gap:56px}

.sec-head{display:flex;align-items:baseline;gap:14px;padding-bottom:12px;border-bottom:2px solid var(--blue);margin-bottom:20px}
.sec-num{font:600 15px/1 var(--display);color:var(--blue)}
.sec-head h2{font-size:clamp(22px,3vw,28px)}
h3{font-size:18px;margin:28px 0 12px}
.lead{margin:0 0 20px;max-width:70ch}
p{margin:0 0 14px}

/* stat tiles */
.stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.stat{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px 16px}
.stat b{display:block;font:700 28px/1.1 var(--display);color:var(--ink)}
.stat span{font-size:13px;color:var(--muted)}
.stat.hl{background:var(--band);border-color:var(--band)}
.stat.hl b{color:#fff}.stat.hl span{color:var(--band-muted)}

.flow{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 0;padding:0;list-style:none}
.flow li{background:var(--blue-soft);color:var(--ink);font-weight:500;font-size:13px;padding:6px 12px;border-radius:999px}
.flow li:not(:last-child)::after{content:"→";margin-left:10px;color:var(--blue)}

.why{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 28px;margin-top:8px}
.why div{min-width:0}
.why b{display:block;color:var(--ink);font-family:var(--display);font-weight:600;margin-bottom:2px}
.why span{color:var(--muted);font-size:14px}

/* apps */
.apps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.app{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:16px;min-width:0;display:flex;flex-direction:column;gap:6px}
.app .k{font:600 12px/1 var(--display);color:var(--blue)}
.app h3{margin:0;font-size:16px}
.app p{margin:0;font-size:13px;color:var(--muted);flex:1}
.app .plat{font-size:12px;font-weight:600;color:var(--ink);background:var(--blue-soft);border-radius:6px;padding:3px 8px;align-self:flex-start}

/* modules */
.mods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.mod{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px;min-width:0}
.mod-top{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px}
.mod-top .n{font:600 13px/1.6 var(--display);color:var(--muted)}
.mod-top h3{margin:0;font-size:16px;flex:1;line-height:1.35}
.chip{font:600 11px/1 var(--body);letter-spacing:.04em;padding:5px 8px;border-radius:999px;white-space:nowrap;background:var(--blue-soft);color:var(--blue)}
.ticks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;font-size:14px}
.ticks li{padding-left:20px;position:relative}
.ticks li::before{content:"";position:absolute;left:2px;top:.6em;width:8px;height:8px;border-radius:2px;background:var(--blue)}
.mod .amt{margin-top:12px;padding-top:10px;border-top:1px dashed var(--line);font-size:13px;color:var(--muted);display:flex;justify-content:space-between}
.mod .amt b{color:var(--ink);font-family:var(--display)}

/* tables */
.tbl-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:var(--r);background:var(--surface)}
table{width:100%;border-collapse:collapse;font-size:14px}
th{background:var(--band);color:#fff;text-align:left;font-weight:600;padding:11px 14px;white-space:nowrap}
td{padding:10px 14px;border-top:1px solid var(--line);vertical-align:top}
tbody tr:nth-child(even) td{background:color-mix(in srgb,var(--blue-soft) 45%,transparent)}
td.num,th.num{text-align:right;white-space:nowrap}
tr.total td{background:var(--blue-soft)!important;font-weight:700;color:var(--ink)}
tr.grand td{background:var(--band)!important;color:#fff;font-weight:700;font-size:15px}
td:first-child{color:var(--ink);font-weight:500}

/* gantt */
.gantt{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:18px;overflow-x:auto}
.g-inner{min-width:620px}
.g-row{display:grid;grid-template-columns:170px 1fr;align-items:center;gap:12px;min-height:44px}
.g-label b{display:block;font:600 14px/1.2 var(--display);color:var(--ink)}
.g-label span{font-size:12px;color:var(--muted)}
.g-track{position:relative;height:28px;background:repeating-linear-gradient(90deg,transparent 0,transparent calc(100%/18 - 1px),var(--line) calc(100%/18 - 1px),var(--line) calc(100%/18))}
.g-bar{position:absolute;top:3px;bottom:3px;border-radius:6px;background:var(--blue);color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;padding:0 10px;white-space:nowrap;overflow:hidden}
.g-bar.p0{background:#4F7BD6}.g-bar.p1{background:#0A66FF}.g-bar.p2{background:#0B4FC4}.g-bar.p3{background:#0B3A93}.g-bar.p4{background:#0B1F4D;outline:1px solid #3A5BA8}
.g-axis{display:grid;grid-template-columns:170px 1fr;gap:12px;margin-top:6px}
.g-ticks{display:flex;justify-content:space-between;font-size:11px;color:var(--muted)}
.g-mvp{position:absolute;top:-6px;bottom:-6px;width:2px;background:var(--ok)}
.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--muted);margin-top:10px}
.legend i{display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--ok);margin-right:6px;vertical-align:-1px}

/* price hero */
.price{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:14px;margin-bottom:24px}
.price-main{background:var(--band);border-radius:var(--r);padding:26px;color:#fff}
.price-main .eyebrow{color:var(--band-muted)}
.price-main .big{font:700 clamp(34px,5vw,48px)/1 var(--display);margin:12px 0 6px;color:#fff}
.price-main p{color:#D6E2FB;margin:0;font-size:14px}
.price-side{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:flex;flex-direction:column;gap:10px;font-size:14px}
.price-side div{display:flex;justify-content:space-between;gap:12px}
.price-side div b{color:var(--ink)}
.price-side div.tot{border-top:1px solid var(--line);padding-top:10px;font-weight:700}

/* payment */
.split{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:18px}
.split div{border-radius:var(--r);padding:18px;background:var(--surface);border:1px solid var(--line)}
.split b{display:block;font:700 30px/1 var(--display);color:var(--blue)}
.split span{font-size:13px;color:var(--muted)}
.callout{background:var(--blue-soft);border-radius:var(--r);padding:16px 18px;margin-top:18px;font-size:14px}
.callout b{color:var(--ink)}

.sla{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.plan{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:20px}
.plan.pro{border:2px solid var(--blue)}
.plan h3{margin:0 0 4px}
.plan .pp{font:700 24px/1.2 var(--display);color:var(--ink)}
.plan .pp small{font:400 13px var(--body);color:var(--muted)}

.terms{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 28px}
.terms div{min-width:0;padding-top:12px;border-top:1px solid var(--line)}
.terms b{display:block;color:var(--ink);font-family:var(--display);font-weight:600;font-size:15px;margin-bottom:4px}
.terms span{font-size:14px;color:var(--muted)}

.comp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.comp div{display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 12px;font-size:14px;min-width:0}
.comp .ok{flex:none;width:20px;height:20px;border-radius:50%;background:var(--ok);color:#fff;font-size:12px;display:grid;place-items:center;font-weight:700}
.comp span.t{flex:1;min-width:0}
.comp em{font-style:normal;font-size:12px;color:var(--muted)}

.sign{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.sign div{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:20px}
.sign h3{margin:0 0 16px}
.sign p{border-bottom:1px solid var(--line);padding:18px 0 4px;margin:0;font-size:13px;color:var(--muted)}

.foot{background:var(--band);color:#D6E2FB}
.foot .wrap{padding-block:36px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
.foot h3{color:#fff;margin-bottom:6px}
.foot a{color:#fff}
.contact{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.btn{font:600 14px var(--body);border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:8px;padding:9px 14px;cursor:pointer;text-decoration:none}
.btn:hover,.btn:focus-visible{background:rgba(255,255,255,.12);outline:2px solid #fff;outline-offset:2px}
.btn.solid{background:#0A66FF;border-color:#0A66FF}

@media (max-width:980px){
  .layout{grid-template-columns:minmax(0,1fr)}
  .rail{display:none}
  .apps{grid-template-columns:repeat(2,minmax(0,1fr))}
  .comp{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:680px){
  .meta,.stats{grid-template-columns:repeat(2,minmax(0,1fr))}
  .mods,.why,.price,.sla,.terms,.sign,.apps,.comp{grid-template-columns:minmax(0,1fr)}
  .split{grid-template-columns:repeat(3,minmax(0,1fr))}
  .split b{font-size:24px}
  .bar .qno span{display:none}
}
</style>

<div class="bar"><div class="wrap">
  <span class="logo-chip"><img src="${logo}" alt="Codixy Technologies"></span>
  <span class="qno"><span>Quotation </span><b>${QUOTE}</b></span>
</div></div>

<div class="cover"><div class="wrap">
  <div class="eyebrow">Technical &amp; commercial proposal · Prepared for Aqrevia</div>
  <h1>Aqrevia Unified Real Estate Platform</h1>
  <p class="sub">One platform for CRM and customer intelligence, a property marketplace, the channel partner network, and web and mobile apps. It is custom-built, hosted in Aqrevia's own cloud, and handed over with full source code and IP.</p>
  <dl class="meta">
    <div><dt>Quotation no.</dt><dd>${QUOTE}</dd></div>
    <div><dt>Issued · valid until</dt><dd>25 Nov · 24 Dec 2026</dd></div>
    <div><dt>Investment</dt><dd>${inr(FINAL)} + GST</dd></div>
    <div><dt>Delivery</dt><dd>16–18 months · 4 phases</dd></div>
  </dl>
</div><div class="cover-rule"></div></div>

<div class="wrap layout">
<nav class="rail" aria-label="Sections"><p>Contents</p><ol>${nav.map(([id, l]) => `<li><a href="#${id}">${l}</a></li>`).join("")}</ol></nav>
<main>

${sec("summary", "01", "Executive summary", `
<div class="stats">
  <div class="stat hl"><b>250–300</b><span>Screens across web and mobile</span></div>
  <div class="stat"><b>8</b><span>Apps &amp; portals (6 user-facing, 2 internal)</span></div>
  <div class="stat"><b>21</b><span>Functional modules</span></div>
  <div class="stat"><b>10+</b><span>Third-party integrations</span></div>
  <div class="stat"><b>15</b><span>User roles with field-level security</span></div>
  <div class="stat"><b>4</b><span>Delivery phases</span></div>
  <div class="stat"><b>6.5 mo</b><span>MVP go-live</span></div>
  <div class="stat hl"><b>16–18 mo</b><span>Full platform delivery</span></div>
</div>
<h3>Business flow the platform runs</h3>
<ul class="flow">${["Data sources", "Data pool", "Customer 360", "Telecalling", "Matching", "Site visit", "Offer", "Booking", "Agreement", "Registration", "Commission & incentives"].map((x) => `<li>${x}</li>`).join("")}</ul>
<h3>Why Codixy Technologies</h3>
<div class="why">
  <div><b>One unified platform</b><span>CRM and marketplace share one customer record, so there's no duplicate data and no second system to integrate.</span></div>
  <div><b>100% ownership</b><span>Source code, database, designs, API docs and IP transfer to Aqrevia.</span></div>
  <div><b>No per-user licence fees</b><span>Add telecallers, CPs and customers without paying per seat.</span></div>
  <div><b>Built for Indian real estate</b><span>RERA fields, DLT SMS, WhatsApp-first, India hosting and DPDP Act 2023 privacy controls.</span></div>
  <div><b>Phased, low-risk delivery</b><span>A working MVP in about 6.5 months, then growth without rebuilding the core.</span></div>
  <div><b>Configurable, not hard-coded</b><span>Funnels, teams, assignment rules, incentive formulas and campaigns change in settings.</span></div>
</div>`, "Aqrevia's two requirement documents describe one connected business: inventory, distribution, transactions and relationships. We propose to build them as one enterprise-scale platform.")}

${sec("apps", "02", "Applications we deliver", `<div class="apps">${apps.map((a, i) => `<div class="app"><span class="k">App ${i + 1}</span><h3>${a[0]}</h3><p>${a[1]}</p><span class="plat">${a[2]}</span></div>`).join("")}</div>
<p style="margin-top:16px;font-size:14px;color:var(--muted)">Roles: Super Admin, CRM Admin, Sales Manager, Telecaller, Sales Executive, Site Visit Coordinator, Closing Executive, Marketing, Finance, Legal, Content Admin, Channel Partner, Developer, Property Owner and Customer.</p>`,
"Six user-facing applications and two internal workspaces, all running on one secure backend.")}

${sec("scope", "03", "Scope &amp; features", `<div class="mods">${modules.map((m, i) => `<article class="mod"><div class="mod-top"><span class="n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(m[0])}</h3><span class="chip">${m[2]}</span></div>${ul(m[3])}<div class="amt"><span>Module investment</span><b>${inr(m[1])}</b></div></article>`).join("")}</div>`,
"21 modules. Phase codes: P0 Discovery, P1 MVP, P2 Network &amp; CRM depth, P3 Marketplace, P4 AI &amp; scale.")}

${sec("stack", "04", "Full-stack technology", table(["Layer", "Technology", "Why"], stack), "A proven, TypeScript-first stack that any future team can pick up and maintain.")}

${sec("security", "05", "Security &amp; performance", `
<div class="why">
  <div><b>Encryption</b><span>TLS 1.2+ in transit, AES-256 at rest, HTTPS everywhere.</span></div>
  <div><b>Access control</b><span>Role- and attribute-based access, masking of phone, email, address and financial fields.</span></div>
  <div><b>Identity</b><span>OTP login, MFA for admins, session and password policies.</span></div>
  <div><b>Audit</b><span>Tamper-evident logs for profile edits, assignments, location access and exports.</span></div>
  <div><b>Privacy</b><span>Consent, opt-out and do-not-contact aligned with the DPDP Act, 2023.</span></div>
  <div><b>Location ethics</b><span>Consent-based tracking, limited to working hours, with minimal retention.</span></div>
  <div><b>Hardening</b><span>Upload validation, rate limiting and OWASP Top-10 testing before launch.</span></div>
  <div><b>Resilience</b><span>Daily backups, point-in-time recovery and a tested disaster-recovery plan.</span></div>
</div>
<h3>Non-functional commitments</h3>
${table(["Area", "Commitment"], [
  ["Performance", "Public pages under 2.5 s LCP on 4G; API p95 under 500 ms"],
  ["Scale", "500+ concurrent internal users, 10,000+ CPs, 1,00,000+ listings"],
  ["Availability", "99.5% uptime target with monitoring and alerts"],
  ["Devices", "Desktop, tablet, mobile web; Android 9+ and iOS 15+"],
  ["Localisation", "English at launch, architecture ready for Indian languages"],
])}`)}

${sec("integrations", "06", "Third-party integrations", table(["Integration", "Recommended providers", "Phase"], integrations), "Codixy builds every integration. Accounts are registered in Aqrevia's name.")}

${sec("timeline", "07", "Timeline &amp; milestones", `
<div class="gantt"><div class="g-inner">
${phases.map((p) => `<div class="g-row"><div class="g-label"><b>${p[0]} · ${p[1]}</b><span>${p[4]}</span></div><div class="g-track">${p[0] === "P2" ? "" : ""}<div class="g-bar ${p[0].toLowerCase()}" style="left:${(p[2] / 18) * 100}%;width:${((p[3] - p[2]) / 18) * 100}%">${p[4]}</div>${p[0] === "P1" ? `<div class="g-mvp" style="left:calc(${(6.5 / 18) * 100}% - 1px)" title="MVP go-live"></div>` : ""}</div></div>`).join("")}
<div class="g-axis"><span></span><div class="g-ticks">${months.filter((m) => m % 3 === 0).map((m) => `<span>M${m}</span>`).join("")}</div></div>
<div class="legend"><span><i></i>MVP go-live at month 6.5</span></div>
</div></div>
<h3>Key milestones</h3>
${table(["#", "Milestone", "Target"], milestones)}
<div class="callout"><b>Dependencies.</b> Dates assume feedback within 5 business days and timely third-party approvals (WhatsApp verification, DLT registration, Meta app review, telephony KYC).</div>`,
"Four phases after discovery. Design and development overlap to keep the total close to 16–18 months.")}

${sec("budget", "08", "Budget", `
<div class="price">
  <div class="price-main"><div class="eyebrow">Net project investment</div><div class="big">${inr(FINAL)}</div><p>Excluding 18% GST. One-time development cost for all 21 modules, 8 applications and 4 phases.</p></div>
  <div class="price-side">
    <div><span>Gross module total</span><b>${inr(GROSS)}</b></div>
    <div><span>Unified platform discount</span><b>− ${inr(DISC)}</b></div>
    <div><span>Net project cost</span><b>${inr(FINAL)}</b></div>
    <div><span>GST @ 18%</span><b>${inr(GST)}</b></div>
    <div class="tot"><span>Total incl. GST</span><b>${inr(FINAL + GST)}</b></div>
  </div>
</div>
<h3>Phase-wise investment</h3>
${table(["Phase", "Scope", "Duration", '<span style="float:right">Amount</span>'], [...phases.map((p) => [`${p[0]} · ${p[1]}`, p[6], p[4], `<span style="float:right">${inr(p[5])}</span>`]), { cls: "total", cells: ["Total", "", "16–18 months", `<span style="float:right">${inr(FINAL)}</span>`] }])}
<h3>Module-wise investment</h3>
${table(["#", "Module", "Phase", '<span style="float:right">Amount</span>'], [
  ...modules.map((m, i) => [String(i + 1).padStart(2, "0"), esc(m[0]), m[2], `<span style="float:right">${inr(m[1])}</span>`]),
  { cls: "total", cells: ["", "Gross total", "", `<span style="float:right">${inr(GROSS)}</span>`] },
  ["", "Unified platform bundle discount", "", `<span style="float:right">− ${inr(DISC)}</span>`],
  { cls: "total", cells: ["", "Net project cost", "", `<span style="float:right">${inr(FINAL)}</span>`] },
  ["", "GST @ 18%", "", `<span style="float:right">${inr(GST)}</span>`],
  { cls: "grand", cells: ["", "Total including GST", "", `<span style="float:right">${inr(FINAL + GST)}</span>`] },
])}`)}

${sec("payment", "09", "Payment terms &amp; fund release", `
<div class="split"><div><b>30%</b><span>Advance at phase kick-off</span></div><div><b>40%</b><span>On UAT release</span></div><div><b>30%</b><span>On production go-live</span></div></div>
${table(["#", "Payment trigger", "Basis", '<span style="float:right">Amount</span>', '<span style="float:right">Cumulative</span>'], [
  ...pay.map((r, i) => { cum += r[2]; return [String(i + 1), r[0], r[1], `<span style="float:right">${inr(r[2])}</span>`, `<span style="float:right">${Math.round((cum / FINAL) * 100)}%</span>`]; }),
  { cls: "total", cells: ["", "Total", "", `<span style="float:right">${inr(FINAL)}</span>`, `<span style="float:right">100%</span>`] },
])}
<h3>Payment conditions</h3>
${ul([
  "GST at 18% is added to every invoice.",
  "Invoices are payable within 7 days by NEFT, RTGS or IMPS.",
  "Work on a phase starts after its advance is received.",
  "TDS may be deducted as per law; certificates shared quarterly.",
  "Payments delayed beyond 15 days attract 1.5% interest per month, and work may pause until cleared.",
  "UAT releases without feedback within 10 business days are deemed accepted for invoicing.",
  "Third-party and government fees are paid directly by Aqrevia.",
])}`, "Each phase is funded by an advance at kick-off. The balance is split between UAT release and go-live, so payments follow delivered, working software.")}

${sec("recurring", "10", "Recurring third-party costs", table(["Item", "Indicative cost", "Billing"], recurring) + `<div class="callout"><b>About ₹40,000–80,000 per month at launch,</b> rising with usage. Aqrevia pays providers directly, and Codixy helps choose cost-effective plans.</div>`, "Not part of the development fee. Estimates are for about 50 internal users and depend on provider pricing at the time.")}

${sec("support", "11", "Warranty, support &amp; AMC", `
<p>Every phase includes a <b>3-month free warranty</b> from its go-live, covering defects against the approved scope.</p>
<div class="sla">
  <div class="plan"><h3>Standard AMC</h3><div class="pp">₹1,50,000 <small>per month + GST</small></div>${ul(["Bug fixes and security patches", "Server monitoring and backups", "Up to 40 enhancement hours a month", "Mon–Sat, 10 AM–7 PM IST", "Monthly health report"])}</div>
  <div class="plan pro"><h3>Premium AMC</h3><div class="pp">₹2,00,000 <small>per month + GST</small></div>${ul(["Everything in Standard", "24×7 alerting", "Up to 80 enhancement hours a month", "Extended support, all week", "Dedicated account manager and quarterly review"])}</div>
</div>
<h3>Support response times</h3>
${table(["Severity", "Definition", "Response", "Resolution"], [
  ["Critical", "Production down or core business blocked", "2 hours", "8 hours"],
  ["High", "Major feature broken, no workaround", "4 hours", "24 hours"],
  ["Medium", "Feature impaired, workaround exists", "1 business day", "3 business days"],
  ["Low", "Cosmetic issue or query", "2 business days", "Next release"],
])}
<h3>Deliverables at handover</h3>
${ul(["BRD, SRS and compliance matrix", "Architecture and database documentation", "Figma design files and design system", "All web apps deployed to production", "Both mobile apps published on Play Store and App Store", "Complete source code in Aqrevia's Git repository", "API docs, runbook, user manuals and training videos", "Test, security and backup-restore reports", "Ownership of all infrastructure and third-party accounts"])}`)}

${sec("terms", "12", "Terms &amp; conditions", `<div class="terms">${tc.map(([k, v]) => `<div><b>${k}</b><span>${esc(v)}</span></div>`).join("")}</div>
<h3>Not included</h3>
${ul(["Third-party subscription, usage and government fees", "Content writing, photography, video, 3D renders and 360° tour production", "Paid ad management and SEO content beyond technical SEO", "Multi-tenant SaaS or white-label version of the CRM", "Hardware and on-premise infrastructure", "Features outside this document or the signed BRD/SRS"])}`)}

${sec("compliance", "13", "Requirement compliance", `<div class="comp">${compliance.map(([a, p]) => `<div><span class="ok" aria-hidden="true">✓</span><span class="t">${a}</span><em>${p}</em></div>`).join("")}</div>
<p style="margin-top:14px;font-size:14px;color:var(--muted)">All areas are custom-built, with third-party providers where needed. Payment gateway, e-sign and ERP are optional. A line-by-line matrix is delivered in Phase 0.</p>`,
"Codixy's response against both Aqrevia requirement documents.")}

${sec("accept", "14", "Acceptance", `<div class="sign">
  <div><h3>For Aqrevia</h3><p>Name</p><p>Designation</p><p>Signature &amp; seal</p><p>Date</p></div>
  <div><h3>For Codixy Technologies</h3><p>Name</p><p>Designation</p><p>Signature &amp; seal</p><p>Date</p></div>
</div>`, "By signing, both parties accept this proposal's scope, commercials, payment schedule and terms as the basis for the Master Services Agreement.")}

</main>
</div>

<footer class="foot"><div class="wrap">
  <div><h3>Codixy Technologies</h3><div>Thank you for considering us for Aqrevia's platform.</div></div>
  <div class="contact">
    <a class="btn solid" href="https://codixytechnologies.com/" target="_blank" rel="noopener">codixytechnologies.com</a>
    <span class="btn" id="phone" style="cursor:text;user-select:all">+91 63003 58759</span>
    <button class="btn" id="copy-phone" type="button">Copy number</button>
  </div>
</div></footer>

<script>
document.getElementById("copy-phone").addEventListener("click", function () {
  var b = this, done = function (msg) { b.textContent = msg; setTimeout(function () { b.textContent = "Copy number"; }, 1800); };
  try {
    navigator.clipboard.writeText("+91 6300358759").then(function () { done("Copied"); }, function () { selectPhone(); done("Press Ctrl+C"); });
  } catch (e) { selectPhone(); done("Press Ctrl+C"); }
  function selectPhone() { var r = document.createRange(); r.selectNodeContents(document.getElementById("phone")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
});
</script>
`;
fs.writeFileSync(OUT, html);
console.log("written", OUT, Math.round(html.length / 1024) + "KB");
