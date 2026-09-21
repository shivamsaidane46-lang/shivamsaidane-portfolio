/**
 * GALAXY_DATA — the authoritative data source for the Polymath Universe.
 *
 * Architecture: Universe → Galaxies → Planets (Projects)
 *
 * Status:
 *   'active'  — galaxy is live and contains real projects as planets.
 *   'forming' — galaxy is declared but not yet populated with planets.
 *               Do NOT add invented descriptions or projects to forming
 *               galaxies. Only real, provided content belongs here.
 *
 * To add planets to a forming galaxy later, change its status to 'active'
 * and append planet objects to its `planets` array.
 *
 * `position` is the galaxy's world-space [x, y, z] in the Three.js scene.
 * The active galaxy sits at the origin [0, 0, 0] where the spiral renders.
 *
 * Image paths: files live in /public/assets/projects/ and are referenced
 * as root-relative paths so Vite serves them correctly in both dev and prod.
 */
import type { GalaxyData } from '@/types';

export const GALAXY_DATA: GalaxyData[] = [
  // ── ACTIVE ──────────────────────────────────────────────────
  {
    id: 'galaxy_ai_automation',
    status: 'active',
    title: 'AI AUTOMATION',
    subtitle: 'PRIMARY GALACTIC SECTOR',
    desc: 'Active system cluster housing autonomous automation pipelines, intelligent orchestrations, and AI-powered integration services.',
    coords: '[0, 0, 0]',
    position: [0, 0, 0],
    planets: [
      {
        id: 'p_content_repurposer',
        name: 'Content Repurposer',
        fullName: 'Automated Multi-Channel Social & Video Content Repurposer',
        subtitle: 'AI Automation Pipeline',
        desc: 'Watches for new podcast or video uploads on Google Drive, transcribes and extracts editorial themes using Gemini\'s native multimodal audio capabilities, and generates platform-native copy for LinkedIn and X/Twitter in parallel — logging ready-to-publish content alongside video clip timestamps into Airtable.',
        radius: 28,
        speed: 0.007,
        color: 0x38bdf8,
        size: 1.8,
        workflowImage: '/assets/projects/Automated Multi-Channel Social & Video Content Repurposer.png',
        detail: {
          whatItDoes: 'An automated long-form media repurposing pipeline that watches for new podcast or video uploads on Google Drive, transcribes and extracts core editorial themes using Gemini\'s native multimodal audio capabilities, generates platform-native copy for LinkedIn and X/Twitter in parallel, and logs ready-to-publish content alongside video clip timestamps into Airtable.',
          problem: 'Manually repurposing a single video or podcast into high-performing social copy takes hours of listening, timestamp hunting, drafting, and platform formatting. Generic copy-pasting across platforms fails because each network requires distinct voice, pacing, and length constraints (e.g., punchy multi-tweet threads vs. long-form narrative LinkedIn essays).',
          workflowDataFlow: [
            'Trigger (Intake): Google Drive Trigger monitors a designated media folder for new episode uploads (fileCreated), extracts episode metadata, and downloads the binary audio/video file.',
            'Processing (Transcription & Thesis Extraction): Passes raw media directly into a multimodal Gemini node to simultaneously generate a timestamped transcript, extract 3–6 core thesis points, and surface 5–8 high-impact quotable moments into a single structured JSON object. A Code Node cleans and parses the payload.',
            'Logic (Platform-Tailored Generation): Splits into two parallel generation branches applying platform-specific constraint prompts — LinkedIn Path generates a structured narrative essay with hook lines and engagement-focused closing questions; X/Twitter Path generates an educational, step-by-step numbered thread adhering to strict per-post character limits.',
            'Action (Assembly & Record Creation): Dedicated Code Nodes parse both text outputs, route them into a Merge node (combine), and format video timestamps into an editor-ready reference guide.',
            'Result: Appends a consolidated project record to Airtable containing the transcript, hooks, drafts, and timestamped quote segments ready for final editorial review.',
          ],
          architecture: [
            'Ingestion Layer: Google Drive API v3 handles file-event polling and streaming downloads of large media binaries.',
            'Multimodal Core: Google Gemini API (handling direct binary audio/video tokens, bypassing third-party transcription steps like Whisper).',
            'Parallel Transformation Pipeline: n8n branching logic orchestrating dual LLM generation calls simultaneously to cut down total execution latency.',
            'Output / Content Hub: Airtable REST API creating relational records across editorial teams and video editors.',
          ],
          techStack: [
            'Workflow Engine: n8n',
            'Cloud Storage & File Ingestion: Google Drive API',
            'AI & Language Models: Google Gemini (Multimodal Audio/Video & Text Generation)',
            'Scripting & Formatting: Node.js (n8n Code Nodes for JSON normalization and schema mapping)',
            'Content Management / Database: Airtable',
          ],
          errorHandling: [
            'Binary File Buffer Failures: If a large media file exceeds payload limits during download, downstream Gemini calls are guarded by schema parsing nodes that catch empty or incomplete responses.',
            'Output Parsing Resilience: Dedicated parser nodes (Code: Parse LinkedIn Essay, Code: Parse Thread) isolate formatting errors, preventing a malformed string on one platform from crashing the entire batch.',
            'Merge Integrity: The Merge Content Drafts node uses combine mode to reconcile both asynchronous LLM branches before passing records to Airtable.',
          ],
          securityValidation: [
            'Direct API Authentication: Secure OAuth2 / API Token management within n8n\'s credential vault for Google Workspace and Airtable.',
            'Controlled Access Scopes: Google Drive integration can be scoped strictly to a single Content Ingestion folder rather than broad drive-wide read/write permissions.',
            'Data Boundary Protection: Avoids passing sensitive client or creator media to unverified third-party transcription webhooks by processing transcription directly inside Google\'s enterprise API infrastructure.',
          ],
          advantages: [
            'Native Multimodal Audio Processing: Skips the time and API cost of running a separate STT (speech-to-text) tool before calling an LLM.',
            'Parallelized Output: Both long-form and short-form assets generate at the same time, cutting execution wait times in half compared to sequential prompting.',
            'Editor-Friendly Timestamps: Pulls exact quote locations, allowing human video editors to jump straight to the best clips without scrubbing through the whole timeline.',
          ],
          results: [
            'Repurposing Time: Drops post-production copywriting time from ~90 minutes per episode to under 60 seconds of automated processing.',
            'Asset Yield: Produces 1 structured transcript, 1 full LinkedIn post, 1 multi-tweet thread, and 5–8 short-form video clip ideas per single upload.',
            'Publishing Readiness: Assets arrive structured directly in Airtable columns, requiring only quick proofreading before scheduling.',
          ],
          limitations: [
            'File Size Constraints: Uploading multi-hour 4K raw video files directly to Google Drive can exceed n8n worker memory; adding an upstream audio-stripping step (extracting lightweight MP3/AAC) would improve speed and lower bandwidth.',
            'Direct Auto-Scheduling: Add downstream social publishing nodes (e.g., Buffer, Hootsuite, or direct X/LinkedIn APIs) triggered by a single "Approved" checkbox in Airtable.',
            'Visual Clip Generation: Integrate an automated clipping API (such as Opus Clip or an automated FFmpeg node) to cut video segments automatically based on the extracted quote timestamps.',
          ],
        },
      },
      {
        id: 'p_business_health_digest',
        name: 'Business Health Digest',
        fullName: 'Automated Weekly Executive Business Health Digest',
        subtitle: 'AI Automation Pipeline',
        desc: 'Runs every Monday morning to pull business data across payments, paid advertising, and CRM sales pipelines — compares performance against a trailing 4-week baseline to surface anomalies, compiles an executive Markdown brief, and delivers it to the leadership Slack channel alongside an archived PDF report.',
        radius: 46,
        speed: 0.0055,
        color: 0x818cf8,
        size: 2.2,
        workflowImage: '/assets/projects/Automated Weekly Executive Business Health Digest.png',
        detail: {
          whatItDoes: 'An automated executive reporting engine that runs every Monday morning to pull key business data across payments, paid advertising, and CRM sales pipelines, compares current performance against a trailing 4-week moving baseline to surface anomalies, compiles an executive Markdown brief, converts it into a branded PDF report, and delivers the summary directly to the leadership Slack channel while archiving the document to Google Drive.',
          problem: 'Founders and executive teams frequently spend hours every Monday manually logging into disparate platforms—payment processors, ad dashboards, and sales CRMs—to copy numbers into spreadsheets. Manual reporting delays strategic alignment, obscures negative spend-to-revenue trends until it is too late, and is prone to human data-entry mistakes.',
          workflowDataFlow: [
            'Trigger (Data Acquisition): A Cron trigger initiates every Monday at 6:00 AM, firing parallel HTTP requests to fetch Revenue from Stripe, Paid Media from Meta Ads & Google Ads (weekly spend/conversions), and Sales Pipeline from HubSpot (deals won this week & current open pipeline value).',
            'Processing (Aggregation & Trend Logic): Dedicated Code Nodes parse and aggregate raw API payloads for each data source, combined into a single unified JSON object via Merge All Data Sources. Queries Airtable for the trailing 4 weeks of historical baseline metrics. A Code Node calculates week-over-week (WoW) and vs. 4-week trailing average percentage changes, automatically generating high-priority warning flags.',
            'Logic (Report Generation): Logs the new weekly snapshot back to Airtable to update rolling averages for future cycles. A Code Node dynamically compiles a scannable, formatted Markdown executive summary with KPI callouts, conversion metrics, and visual status badges. A Markdown-to-HTML converter renders the content into styled web markup.',
            'Action & Result (Delivery): An HTTP Request node sends the HTML payload to a headless PDF rendering endpoint. Google Drive uploads and stores the generated PDF in an executive archive folder. Formats and delivers a scannable Markdown summary block—complete with a direct Google Drive link to the downloadable PDF report—directly into the executive #leadership Slack channel.',
          ],
          architecture: [
            'Scheduling Layer: Time-based Cron scheduler initiating the pipeline on a deterministic weekly cadence.',
            'Data Aggregation Layer: Multi-threaded parallel REST API calls (Stripe API, Meta Graph API, Google Ads API, HubSpot API) normalized via isolated JavaScript compute nodes.',
            'Historical State & Analytics Layer: Airtable acting as a time-series data store for rolling historical baselines and snapshot logging.',
            'Document Compilation Layer: In-memory Markdown formatting, HTML templating, and external microservice rendering for PDF compilation.',
            'Distribution & Storage Layer: Google Drive API v3 for asset archival and Slack API (Block Kit) for executive delivery.',
          ],
          techStack: [
            'Workflow Orchestrator: n8n',
            'Payment Source: Stripe API',
            'Ad Networks: Meta Marketing API, Google Ads API',
            'CRM / Pipeline: HubSpot API',
            'Historical Database: Airtable',
            'Document Rendering: HTML / CSS, Headless PDF Generator API',
            'Cloud Storage & Output: Google Drive, Slack API',
          ],
          errorHandling: [
            'Data-Source Resilience: If an individual ad account token expires or an API endpoint fails, the On Workflow Error trigger captures the failure immediately and routes an alert to the #alert-ops-channel.',
            'Fail-Safe Integrity: Halting execution via ops alert prevents leadership from receiving partial, silently corrupt, or skewed data summaries that could lead to misinformed business decisions.',
          ],
          securityValidation: [
            'Vaulted Credentials: All financial and CRM bearer tokens, client secrets, and webhook headers are managed inside n8n\'s encrypted credentials store.',
            'Isolated Access Scopes: HubSpot, Meta, and Stripe credentials use read-only analytical scopes, eliminating write/delete operational risks on primary customer data.',
            'Internal Data Boundaries: PDF artifacts and summary links remain within authenticated company Google Drive shared spaces, preventing public leaks of sensitive financial summaries.',
          ],
          advantages: [
            'Cross-Silo Visibility: Eliminates tool fragmentation by merging ad spend, actual cash collection, and sales pipeline trajectory into a single view.',
            'Automated Anomaly Detection: Programmatic baseline triggers flag unprofitable ad spend shifts or stalled pipelines without manual spreadsheet audits.',
            'Multi-Format Delivery: Balances fast, mobile-friendly scannability in Slack with permanent, formal PDF reporting for investor and board archives.',
          ],
          results: [
            'Time Saved: Replaces 2 to 3 hours of manual data extraction and spreadsheet formatting every Monday morning.',
            'Execution Latency: The full end-to-end ingest, calculate, render, and distribution process completes in 25–40 seconds.',
            'Alert Speed: Critical performance anomalies (e.g., ad CAC spikes, closing drop-offs) reach decision-makers before the Monday work day begins.',
          ],
          limitations: [
            'Historical Data Depth: Relying on Airtable for historical time-series analytics can encounter query pagination limits over multi-year scales; transitioning historical metrics to PostgreSQL or BigQuery would improve longitudinal modeling.',
            'Generative Narrative Insights: Integrating an LLM node (e.g., Claude or GPT-4o) to write a qualitative executive summary interpreting the variance numbers alongside the raw percentages.',
            'Interactive Drilldowns: Adding interactive Slack block buttons that allow executives to request deeper breakdowns (such as specific campaign IDs or deal-level details) directly from the summary message.',
          ],
        },
      },
      {
        id: 'p_onboarding_concierge',
        name: 'Onboarding Concierge',
        fullName: 'Autonomous Customer Onboarding Concierge',
        subtitle: 'AI Automation Pipeline',
        desc: 'Triggers the moment a customer pays an invoice or signs a proposal, validates payment status, runs deduplication checks, provisions shared cloud storage, clones project management boards, configures a dedicated Slack channel, and delivers a personalized onboarding package via email.',
        radius: 64,
        speed: 0.0042,
        color: 0x22d3ee,
        size: 1.9,
        workflowImage: '/assets/projects/Autonomous Customer Onboarding Concierge.png',
        detail: {
          whatItDoes: 'An autonomous client onboarding concierge that automatically triggers the moment a customer pays an invoice or signs a proposal, validates payment status, runs deduplication checks, provisions shared cloud storage, clones project management boards, configures dedicated Slack communication channels, and delivers a personalized onboarding package via email.',
          problem: 'Agency and service-business onboarding is notoriously fragmented. When a deal closes, team members waste 30 to 60 minutes manually spinning up Google Drive folders, setting up Trello boards, creating private Slack channels, and drafting welcome emails. Delays or duplicate triggers often cause missed steps, disjointed folder permissions, and slow time-to-value for high-paying clients.',
          workflowDataFlow: [
            'Trigger (Triggers): Ingests events from two independent entry points—when an invoice is marked paid in Stripe or when a proposal/contract is completed in DocuSeal / PandaDoc. Events are normalized into a unified payload format and merged.',
            'Processing (State Verification & Dedupe Check): Verifies contract and payment execution (IF: Payment / Contract Confirmed?). Unconfirmed/flagged states branch off to alert finance and pause onboarding. Queries a Supabase database to see if the client record already exists.',
            'Logic (Conditional Routing): Duplicate Found: If the client is already provisioned, the workflow terminates early and posts an alert to Slack to prevent double provisioning from duplicate webhooks. New Client: Continues to automatic provisioning.',
            'Action (Auto-Provisioning): Drive Setup: Spins up a Client Root Folder on Google Drive, then creates three standard subdirectories in parallel: Contracts, Deliverables, and Brand Assets. Project Management: Merges folder outputs and clones a standardized project tracking board (Trello). Communication: Provisions a private client Slack channel, looks up the user\'s Slack identity by email, and invites them to the channel.',
            'Result (Record + Notify): Inserts the complete client profile alongside all generated URLs (Drive, board, Slack) into a centralized database row. Fires a branded welcome email via Gmail containing all resource links and a kickoff guide. Terminates cleanly at Onboarding Complete.',
          ],
          architecture: [
            'Trigger & Ingestion Layer: Stripe Webhook API and DocuSeal/PandaDoc Webhook endpoints normalized via native JavaScript mapping nodes.',
            'State Verification & Idempotency Layer: Real-time database reads against Supabase to guard against concurrent/duplicate webhook firing.',
            'Resource Provisioning Engine: Asynchronous, parallel REST API execution across Google Drive v3 API, Trello API, and Slack Web API.',
            'System of Record & Notification Layer: Tabular database sync for client link registries and Gmail API for transactional customer-facing messaging.',
          ],
          techStack: [
            'Orchestrator: n8n',
            'Payment & Contracts: Stripe, DocuSeal / PandaDoc',
            'Database & State Store: Supabase',
            'File Storage: Google Drive',
            'Project Management: Trello',
            'Team & Client Chat: Slack API',
            'Email Delivery: Gmail',
          ],
          errorHandling: [
            'Idempotency Safeguard: Built-in Supabase lookup prevents redundant folder/channel duplication when upstream webhooks retry on network timeouts.',
            'Financial Hold Branch: Any partial payment, chargeback, or pending contract status immediately diverts to Slack: Alert Finance Manager and halts provisioning (Hold: Provisioning Paused).',
            'Global Failure Listener: A dedicated On Workflow Error node captures runtime API rate limits (e.g., Google Drive quota spikes or Slack rate limits) and sends a diagnostic stack trace to a designated Slack: Alert Ops Channel.',
          ],
          securityValidation: [
            'Deterministic Verification: State verification requires both explicit payment success tokens and valid signature verification before running administrative API calls.',
            'Scoped Token Management: Integration keys (Slack bot tokens, Drive service accounts, Stripe restricted keys) follow least-privilege principles, avoiding broad administrative access.',
            'Idempotent Webhook Guard: Restricts execution using customer email as an atomic primary key in Supabase to eliminate double-creation vulnerabilities.',
          ],
          advantages: [
            'Zero-Touch Onboarding: Eliminates 100% of manual setup steps immediately after a contract is closed.',
            'Instant Client Experience: Clients receive access to their bespoke workspace, project board, and communication channel within seconds of payment.',
            'Structural Consistency: Every client workspace receives the exact same directory layout and project templates, eliminating messy folder structures.',
          ],
          results: [
            'Turnaround Speed: Reduces total onboarding operational time from 45 minutes of manual labor down to 10–20 seconds of automated provisioning.',
            'Setup Accuracy: 100% standardized folder trees and channel naming conventions across all onboarded clients.',
            'Drop-off Reduction: Immediate welcome communications ensure new clients engage directly with project setups without manual follow-up delays.',
          ],
          limitations: [
            'Slack Connect Limitations: Inviting external users to private channels via API can be restricted depending on Slack workspace plan tiers (Slack Connect guest permissions); handling fallback email invitations via direct link could increase reliability.',
            'Contract/Payment Race Conditions: If a client signs and pays within seconds, two parallel webhook runs could initiate near-simultaneously; adding a Redis-backed distributed lock or queue would make idempotency bulletproof.',
            'Dynamic Template Customization: Expanding the project board cloning step to choose different templates based on the specific service tier purchased in Stripe.',
          ],
        },
      },
      {
        id: 'p_support_triage_sentinel',
        name: 'Support Triage Sentinel',
        fullName: 'Omnichannel Support Ticket Triage & Smart Escalation',
        subtitle: 'AI Automation Pipeline',
        desc: 'Ingests incoming support tickets from email or chat widgets, runs semantic vector searches against a company knowledge base, evaluates sentiment and intent, and programmatically decides whether to auto-resolve with an AI-generated draft response or escalate directly to human support teams with full incident context.',
        radius: 80,
        speed: 0.0032,
        color: 0x2dd4bf,
        size: 2.1,
        workflowImage: '/assets/projects/Omnichannel Support Ticket Triage & Smart Escalation.png',
        detail: {
          whatItDoes: 'An AI-powered customer support triage and escalation engine that ingests incoming tickets from email or chat widgets, runs semantic vector searches against a company knowledge base, evaluates sentiment and intent, and programmatically decides whether to auto-resolve the issue with an AI-generated draft response or escalate it directly to human support teams with full incident context.',
          problem: 'Support desks face high volumes of repetitive, low-complexity inquiries alongside high-urgency, dissatisfied customer complaints. Manual triage causes slow first-response times (FRT), misrouted escalations, and human agent burnout, while naive rule-based auto-responders frequently misread user sentiment and send unhelpful canned replies to frustrated users.',
          workflowDataFlow: [
            'Trigger (Omnichannel Intake): Captures inbound tickets via two parallel channels—Gmail (support email trigger) and a Webhook (live chat widget/form). Payloads are normalized into a unified schema (sender, channel, message_body, subject) and merged.',
            'Processing (Knowledge Base Match & Sentiment Analysis): Vector RAG — converts the message body into embeddings using Cohere Embeddings and runs a similarity search against a Qdrant Vector Store containing internal documentation, computing a semantic confidence match score. Sentiment & Intent — concurrently queries an LLM classifier (OpenAI) to extract user intent, urgency level, and emotional sentiment (e.g., frustrated, neutral, churn-risk).',
            'Logic (The Decision): A Code Node combines the vector match confidence and sentiment scores into a deterministic decision matrix. Auto-Resolve Conditions: high knowledge base confidence score + neutral/positive sentiment + non-urgent intent. Escalation Conditions: low confidence match, billing/technical disputes, or flagged anger/churn risk.',
            'Action & Result — Auto-Resolution (5A): An LLM generates a personalized resolution grounded in retrieved documentation. The response is routed back through the origin channel (Gmail reply or chat platform HTTP webhook) and logged into Airtable as Resolved.',
            'Action & Result — Smart Escalation (5B): Formats an escalation brief (customer summary, detected sentiment, escalation rationale, suggested troubleshooting steps), creates an Airtable Escalation record, checks priority tier (IF: Priority Urgent?), and routes the alert to either an urgent on-call Slack channel or a standard human support queue.',
          ],
          architecture: [
            'Ingestion Layer: Webhook gateway and Gmail API pollers converging via n8n data normalization nodes.',
            'RAG & Retrieval Layer: Cohere Embedding Model paired with a Qdrant Vector Database instance for semantic retrieval of company documentation.',
            'Inference Layer: OpenAI Chat Model running structured JSON schema classification (sentiment/intent analysis) and conversational generation.',
            'Routing & State Engine: JavaScript Code Nodes evaluating numerical thresholds and conditional branching (IF: Auto-Resolve?, IF: Channel is Email?, IF: Priority Urgent?).',
            'Output & CRM Layer: Bi-directional messaging via Gmail API, HTTP REST endpoints, Airtable database records, and Slack Block-Kit incident pings.',
          ],
          techStack: [
            'Orchestrator: n8n',
            'Vector Database: Qdrant',
            'Embeddings: Cohere Embeddings',
            'LLM & Reasoning: OpenAI (GPT-4o / GPT-4o-mini)',
            'Ingestion & Messaging: Gmail API, Custom Webhooks, Slack API',
            'Ticketing / Ledger: Airtable',
          ],
          errorHandling: [
            'Fallback to Human Agent: If vector retrieval yields zero hits or an invalid similarity score, the decision matrix automatically falls back to human escalation rather than guessing an answer.',
            'Channel Routing Failsafes: Branching logic checks the origin channel flag (IF: Channel is Email?) to prevent failed API dispatches to mismatched endpoints.',
            'Global Error Trigger: An On Workflow Error node captures runtime exceptions (such as vector store timeouts or OpenAI rate limits) and sends a diagnostic alert directly to an operations Slack channel.',
          ],
          securityValidation: [
            'Grounded Generation (Anti-Hallucination): Auto-replies are strictly restricted to context chunks returned by the Qdrant vector database, preventing made-up policies or hallucinated refunds.',
            'Credential Vaulting: API credentials for OpenAI, Cohere, Qdrant, Slack, and Google Workspace are secured within n8n\'s internal encrypted store.',
            'Sanitized Inputs: Incoming HTML/raw text from emails and chat webhooks is stripped and parsed into structured text before vector generation to prevent injection prompts.',
          ],
          advantages: [
            'Sentiment-Aware Automation: Guarantees that angry or high-churn-risk clients are never subjected to robotic auto-replies, immediately routing them to senior team members.',
            'True Omnichannel Support: Unifies email and web-chat logic into a single maintenance pipeline instead of keeping separate ticketing silos.',
            'Zero-Research Escalations: Human support agents receive a complete diagnostic brief with relevant docs already pre-attached, drastically cutting resolution times.',
          ],
          results: [
            'Ticket Deflection: 40–55% automated first-contact resolution on standard informational queries.',
            'Response Velocity: Median response time for common inquiries drops from 2–4 hours down to under 45 seconds.',
            'Triage Speed: Escalated tickets reach human agents in less than 15 seconds with sentiment, summary, and intent pre-tagged.',
          ],
          limitations: [
            'Conversation Memory & Threading: Currently evaluates incoming messages as isolated events; adding conversational state memory (e.g., Redis or LangChain Memory) would allow multi-turn automated troubleshooting.',
            'Draft-Only Safety Mode: For regulated industries, an intermediate mode could generate the draft and post it directly to Zendesk/Freshdesk as a private note for agent approval before sending.',
            'Dynamic KB Updates: Implement an automated ingestion sub-flow that continuously indexes new internal documentation, Notion guides, or Zendesk macros into Qdrant.',
          ],
        },
      },
      {
        id: 'p_price_inventory_sentinel',
        name: 'Price & Inventory Sentinel',
        fullName: 'Competitor Price & Inventory Tracking Sentinel',
        subtitle: 'AI Automation Pipeline',
        desc: 'Tracks e-commerce URLs on a regular schedule, scrapes live pricing, shipping costs, and stock availability via CSS selectors, computes historical variance against previous snapshots, fires immediate Slack alerts for significant market opportunities (e.g., steep price drops or competitor stockouts), and delivers an aggregated daily executive digest.',
        radius: 98,
        speed: 0.0025,
        color: 0xa78bfa,
        size: 1.7,
        workflowImage: '/assets/projects/Competitor Price & Inventory Tracking Sentinel.png',
        detail: {
          whatItDoes: 'A competitor monitoring sentinel that tracks e-commerce URLs on a regular schedule, scrapes live pricing, shipping costs, and stock availability via CSS selectors, computes historical variance against previous snapshots, fires immediate Slack alerts for significant market opportunities (e.g., steep price drops or competitor stockouts), and delivers an aggregated daily executive digest.',
          problem: 'E-commerce businesses frequently lose revenue and ad efficiency by reacting too slowly to competitor price drops or inventory stockouts. Manually checking dozens of competitor product pages is tedious, prone to human error, and impossible to maintain 24/7. Delayed reactions lead to lost sales, uncompetitive ad bidding, or missed pricing power opportunities when competitors run out of stock.',
          workflowDataFlow: [
            'Trigger & Watchlist Scan (1): A Cron trigger fires every 2 hours, pulling active target records from an Airtable Watchlist (competitor name, product URL, our matching SKU, target CSS selectors) and iterating through them using a loop node.',
            'Scrape & Normalize (2): An HTTP Request fetches the live raw HTML markup for each target product page. An HTML node parses the specific CSS selectors for product price and shipping fees. A Code Node sanitizes raw text (stripping currency symbols, regex-extracting floating-point numbers, and parsing the in-stock boolean state).',
            'Variance Logic (3): Fetches the immediately preceding snapshot record from Airtable. A Code Node compares values against historical trends: flags price drops ≥ 10%, competitor stockout events, or sudden price spikes as actionable market opportunities. Logs every execution snapshot back to Airtable: Price History to maintain continuous time-series data.',
            'Conditional Routing & Instant Alert (4): Checks IF: Is Opportunity?. If true, an immediate Slack alert is fired to the #pricing-alerts channel detailing the SKU, previous vs. current price, margin impact, and direct URL. Minor changes or routine scrapes terminate without alerting.',
            'Morning Digest Sub-Workflow (5): A separate independent Cron trigger fires daily at 8:00 AM, querying Airtable for all flagged opportunity records from the past 24 hours. Compiles metrics into a consolidated markdown digest. Checks IF: Any Opportunities Today? to either dispatch a formatted daily recap to the leadership Slack channel or terminate cleanly if no market shifts occurred.',
          ],
          architecture: [
            'Watchlist & Scheduling Layer: Distributed scheduled polling driven by time-based triggers and tabular target registries.',
            'Web Scraping & Ingestion Engine: Headless HTTP GET requests coupled with deterministic DOM parsing (CSS Selectors / Cheerio).',
            'Analytical Transformation Layer: Node.js execution nodes standardizing raw string responses, parsing multi-currency formats, and calculating threshold differentials.',
            'Dual-Tier Storage Architecture: Airtable relational schema serving simultaneously as operational configuration store (watchlist targets) and historical time-series ledger (snapshots).',
            'Multi-Cadence Delivery Layer: Split-stream output—event-driven alerts for urgent variances and scheduled batch reporting for executive oversight.',
          ],
          techStack: [
            'Workflow Engine: n8n (Loop orchestration, cron scheduling, branching logic)',
            'Ingestion / Scraping: HTTP Request Node, n8n HTML Node (CSS Selector parsing)',
            'Logic / Compute: Node.js (Regex extraction, numeric normalization, variance delta calculations)',
            'Database & Historical Store: Airtable (Watchlist Table, Price History Table)',
            'Alerting & Distribution: Slack Webhooks / Slack API (Block Kit)',
          ],
          errorHandling: [
            'Global Failure Interceptor: The dedicated On Workflow Error node captures runtime HTTP errors (such as 403 Forbidden or 404 Not Found responses) and notifies #alert-ops-channel with target SKU details.',
            'Broken Selector Safeguard: When an e-commerce site updates its frontend layout, the parser flags missing selector data without throwing unhandled exceptions, routing diagnostics to ops instead of corrupting historical pricing baselines.',
            'Non-Blocking Loop Design: Failures on individual URLs within the iteration loop are caught without crashing downstream checks for remaining watchlist items.',
          ],
          securityValidation: [
            'Sanitized Price Ingestion: Strict regex parsing strips out non-numeric characters, currency markers, and localized whitespace before arithmetic calculations to eliminate NaN errors.',
            'Anti-Bot Considerations: Basic HTTP requests operate with custom User-Agent headers to mirror browser traffic and minimize immediate IP blocking.',
            'Encrypted Secrets: Airtable personal access tokens and Slack webhook endpoints are stored securely inside n8n\'s encrypted vault.',
          ],
          advantages: [
            'Zero-Spam Dual Notification Model: Separates immediate high-priority alerts (out-of-stock, aggressive discounting) from standard checks, avoiding notification fatigue while maintaining vigilance.',
            'Dynamic Watchlist Configuration: Adding, modifying, or disabling competitor URLs requires only editing an Airtable row—no modifications to workflow code required.',
            'Capitalizing on Stockouts: Immediately alerts sales/marketing teams when a competitor runs out of stock, allowing for instant ad budget scale-ups or temporary price increases.',
          ],
          results: [
            'Detection Latency: Drops market response time from days to under 2 hours.',
            'Manual Effort Saved: Replaces 10–15 hours of manual competitor price audits per week across a 50-SKU catalog.',
            'Data Reliability: Consistent, structured price snapshots logged 12 times a day per competitor product.',
          ],
          limitations: [
            'Anti-Bot / Cloudflare Blocking: Basic HTTP GET nodes will fail against sites protected by heavy Cloudflare, DataDome, or Akamai challenges; integrating a residential proxy service or headless browser API (e.g., ScrapingBee, Browserless) would bypass anti-bot friction.',
            'Dynamic JavaScript SPAs: Pages rendered entirely via client-side JavaScript (React/Vue) may return blank HTML to simple HTTP nodes; integrating headless browser rendering will ensure DOM completion before extraction.',
            'Automated Repricing Trigger: Extending the action path to automatically push dynamic price adjustments directly into Shopify or Amazon Seller Central within safe bounded parameters.',
          ],
        },
      },
      {
        id: 'p_invoice_extraction_pipeline',
        name: 'Invoice Extraction Pipeline',
        fullName: 'Multi-Format Accounts Payable & Invoice Extraction Pipeline',
        subtitle: 'AI Automation Pipeline',
        desc: 'Continuously ingests invoices from Gmail attachments and Google Drive, parses structured line items and financial metadata using multimodal AI vision, programmatically validates total balances against line item sums, and bifurcates data into clean automated accounting logs or human-in-the-loop exception queues.',
        radius: 116,
        speed: 0.002,
        color: 0x34d399,
        size: 2.0,
        workflowImage: '/assets/projects/Multi-Format Accounts Payable & Invoice Extraction Pipeline.png',
        detail: {
          whatItDoes: 'An automated Accounts Payable pipeline that continuously ingests invoices from Gmail attachments and Google Drive, parses structured line items and financial metadata using multimodal AI vision, programmatically validates total balances against line item sums, and bifurcates data into clean automated accounting logs or human-in-the-loop exception queues.',
          problem: 'Manual invoice handling suffers from error-prone data entry, mismatched totals, and fragmented ingestion across shared inboxes and file folders. Traditional regex or OCR tools fail when dealing with scanned images, rotated mobile photos, or variable PDF layouts, creating operational bottlenecks and delaying vendor payouts.',
          workflowDataFlow: [
            'Trigger (Ingestion): Listens concurrently to inbound emails via a dedicated Gmail Inbox trigger and polling for newly uploaded receipts/invoices in a specific Google Drive folder.',
            'Processing (Standardization & Gate): Normalizes binary data streams into a single schema, then evaluates file formats via a File Type Gate, routing supported image/PDF extensions onward while dropping and logging unsupported media types.',
            'AI Extraction: Routes files based on media type through dedicated Anthropic multimodal AI vision nodes (handling PDFs and raw image scans independently) to extract structured fields: vendor, invoice date, invoice number, line items, subtotals, tax rates, and total amounts, merging outputs into a standardized JSON payload.',
            'Logic (Validation Fork): A custom Code Node computes mathematical consistency: Σ(Line Items) + Tax ≈ Grand Total. It enforces a strict rounding tolerance threshold and verifies required fields (e.g., non-empty invoice number, valid tax ID).',
            'Clean Path (5A): Renames the file (Vendor_InvoiceNumber_Date.pdf), moves it to the Processed folder on Google Drive, appends invoice-level metadata to a Google Sheets Invoice Header sheet, splits and appends individual line items to a Line Items sheet, and dispatches an operational confirmation to Slack.',
            'Exception Path (5B): If validation fails or critical fields are missing, moves the document to Needs-Review on Google Drive, writes the error context and failure reason to a Google Sheets Exception Log, and pings the AP review channel on Slack with a direct file link.',
          ],
          architecture: [
            'Ingestion Layer: Dual parallel webhooks/polling nodes (Gmail API + Google Drive API v3) funneling into an n8n Merge node to unify downstream state execution.',
            'Extraction Layer: Anthropic Claude Vision API via multimodal prompt routing, converting unstructured binary buffers into rigid JSON schemas.',
            'Execution & Branching Layer: Native JavaScript Code Nodes handling arithmetic assertions and schema validation, driving conditional If/Switch operators.',
            'Storage & Persistence Layer: Google Drive folder hierarchies (Uploads, Processed, Needs-Review) for file management, Google Sheets API for structured tabular storage (Headers, Line Items, Exceptions).',
            'Notification Layer: Slack API integration sending contextual block-kit alerts tailored for either success notifications or human-in-the-loop triage.',
          ],
          techStack: [
            'Workflow Engine: n8n (Production Pipeline Orchestrator)',
            'Ingestion Sources: Gmail API, Google Drive API',
            'AI / Extraction Engine: Anthropic Multimodal Vision (Claude)',
            'Compute / Business Logic: Node.js (n8n Code Node for validation & schema transformation)',
            'Database / Ledger: Google Sheets',
            'Notifications & Alerts: Slack Webhooks / Slack App Bot',
          ],
          errorHandling: [
            'In-Workflow File Filtering: Explicit unsupported-file-type logging prevents bad binaries from hitting token-costly AI endpoints.',
            'Global Error Trigger: An isolated On Workflow Error trigger captures unhandled runtime crashes (e.g., Anthropic API rate-limits, downstream Google Sheets write timeouts) and immediately notifies an administrative Slack Ops channel with execution IDs and node stack traces.',
            'Functional Exceptions: Arithmetic discrepancies, malformed JSON from extraction, or missing critical metadata route seamlessly to the dedicated Exception Path rather than breaking execution.',
          ],
          securityValidation: [
            'Zero Hardcoded Secrets: Authentications are managed through encrypted, scoped OAuth2 connections (Google Workspace, Slack) and credential-store API keys (Anthropic).',
            'Deterministic Input Sanitization: JavaScript Code Nodes enforce rigid property checks and normalize date formats, currency symbols, and numeric types prior to sheet insertion.',
            'Document Access Control: Processed documents stay within enterprise-restricted Google Drive directory trees, preventing unauthorized public URL generation.',
          ],
          advantages: [
            'Hybrid Ingestion: Consolidates disparate incoming channels (direct emails and manually scanned receipts) into one standard pipeline.',
            'High-Accuracy Line Extraction: Replaces rigid coordinate-based OCR templates with vision-based LLM parsing capable of handling multi-row itemized breakdowns across disparate layouts.',
            'Zero-Trust Accounting: Automatically halts pipeline processing on math discrepancies before data enters downstream accounting ledgers.',
          ],
          results: [
            'Processing Latency: Approximately 8–15 seconds end-to-end per multi-page invoice.',
            'Manual Data Entry Reduction: Estimated 85–90% touchless processing rate on standard vendor bills.',
            'Triage Efficiency: Exception invoices arrive in Slack pre-classified with exact failure reasons (e.g., "Line item total $420 does not match gross $450"), reducing manual verification time.',
          ],
          limitations: [
            'Multi-Page Large PDF Handling: Multimodal token limits and payload size ceilings can fail on 10+ page document batches; future iterations could include a pre-processing node to split pages or rasterize high-res buffers.',
            'Ledger Scalability: Google Sheets hits cell and concurrency performance limits at high volumes; should be migrated to PostgreSQL, Supabase, or directly into an ERP/accounting API (e.g., QuickBooks, Xero).',
            'Vendor Lookup & Deduplication: Adding an upstream database query node to check existing invoice numbers against existing vendor records to prevent duplicate billing submissions.',
          ],
        },
      },
    ],
  },

  // ── FORMING ─────────────────────────────────────────────────
  // Add no planets or invented descriptions to these entries.
  // Change status to 'active' and populate planets when ready.
  {
    id: 'galaxy_python',
    status: 'forming',
    title: 'PYTHON',
    subtitle: 'FORMING SECTOR',
    desc: 'This sector is forming. Projects will appear here once added.',
    coords: '[-300, 20, -200]',
    position: [-300, 20, -200],
    planets: [],
  },
  {
    id: 'galaxy_sql_data',
    status: 'forming',
    title: 'SQL & DATA',
    subtitle: 'FORMING SECTOR',
    desc: 'This sector is forming. Projects will appear here once added.',
    coords: '[250, -30, -280]',
    position: [250, -30, -280],
    planets: [],
  },
  {
    id: 'galaxy_web_dev',
    status: 'forming',
    title: 'WEB DEVELOPMENT',
    subtitle: 'FORMING SECTOR',
    desc: 'This sector is forming. Projects will appear here once added.',
    coords: '[360, 50, 80]',
    position: [360, 50, 80],
    planets: [],
  },
  {
    id: 'galaxy_ml',
    status: 'forming',
    title: 'MACHINE LEARNING',
    subtitle: 'FORMING SECTOR',
    desc: 'This sector is forming. Projects will appear here once added.',
    coords: '[-180, -40, 310]',
    position: [-180, -40, 310],
    planets: [],
  },
  {
    id: 'galaxy_marketing',
    status: 'forming',
    title: 'MARKETING',
    subtitle: 'FORMING SECTOR',
    desc: 'This sector is forming. Projects will appear here once added.',
    coords: '[140, 60, -360]',
    position: [140, 60, -360],
    planets: [],
  },
  {
    id: 'galaxy_languages',
    status: 'forming',
    title: 'LANGUAGES',
    subtitle: 'FORMING SECTOR',
    desc: 'This sector is forming. Projects will appear here once added.',
    coords: '[-340, 30, 210]',
    position: [-340, 30, 210],
    planets: [],
  },
];

/** Convenience: find a planet by id across all galaxies */
export function findPlanetById(
  id: string
): { planet: GalaxyData['planets'][0]; galaxy: GalaxyData } | null {
  for (const galaxy of GALAXY_DATA) {
    const planet = galaxy.planets.find((p) => p.id === id);
    if (planet) return { planet, galaxy };
  }
  return null;
}

/** Convenience: find a galaxy by id */
export function findGalaxyById(id: string): GalaxyData | null {
  return GALAXY_DATA.find((g) => g.id === id) ?? null;
}

/** Only the active galaxy (has real planets) */
export const ACTIVE_GALAXY = GALAXY_DATA.find(g => g.status === 'active')!;
