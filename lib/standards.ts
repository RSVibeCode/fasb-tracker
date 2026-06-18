export const COMPANY_PROFILE = {
  name: "SerpApi LLC",
  type: "Private company (non-public business entity)",
  industry: "SaaS / API / Software",
  state: "Texas",
  fiscal_year: "Calendar year (Jan–Dec)",
  first_accrual_year: "FY 2026",
  revenue_model: "Subscription + API usage fees",
  size: "Small private company (~50 employees or fewer)",
  has_leases: true,
  has_equity_comp: true,
  has_debt: false,
  has_crypto: false,
  has_insurance_contracts: false,
  has_govt_grants: false,
};

export type Tier = 1 | 2 | 3;
export type Impact = "Critical" | "High" | "Medium" | "Low-Medium" | "Low" | "N/A";

export interface Standard {
  id: string;
  asu: string;
  topic: string;
  title: string;
  tier: Tier;
  status: string;
  private_effective: string;
  category: string;
  impact: Impact;
  summary: string;
  serpapi_impact: string;
  action: string;
  tags: string[];
  fasb_url?: string;
}

export const STANDARDS: Standard[] = [
  // ── TIER 1: Foundation ─────────────────────────────────────────────────────
  {
    id: "asc606",
    asu: "ASU 2014-09",
    topic: "ASC 606",
    title: "Revenue from Contracts with Customers",
    tier: 1,
    status: "Effective — must comply",
    private_effective: "FY beginning after Dec 15, 2018",
    category: "Revenue",
    impact: "Critical",
    summary:
      "Replaces all legacy revenue guidance with a unified 5-step model: (1) identify the contract, (2) identify performance obligations, (3) determine transaction price, (4) allocate price, (5) recognize as obligations are satisfied. Revenue is recognized when — or as — control of the promised good or service transfers to the customer.",
    serpapi_impact:
      "Each subscription period is a distinct performance obligation satisfied ratably over time. Prepaid annual subscriptions create deferred revenue on the balance sheet, recognized monthly. API usage/overage fees are recognized as consumed. Setup or onboarding fees must be evaluated separately — likely recognized ratably with the subscription unless they represent a distinct obligation.",
    action:
      "Document performance obligations per pricing tier. Build deferred revenue waterfall schedule (monthly recognition). Ensure QBO revenue accounts reflect recognized, not collected, amounts.",
    tags: ["Revenue", "Deferred Revenue", "MRR", "Subscriptions"],
    fasb_url: "https://www.fasb.org/page/document?pdf=ASU+2014-09.pdf",
  },
  {
    id: "asc340-40",
    asu: "ASU 2014-09 (companion)",
    topic: "ASC 340-40",
    title: "Contract Costs — Obtain & Fulfill",
    tier: 1,
    status: "Effective — must comply",
    private_effective: "Same as ASC 606",
    category: "Revenue",
    impact: "High",
    summary:
      "Incremental costs to obtain a contract (e.g., sales commissions) must be capitalized as an asset and amortized over the period of benefit. Practical expedient: expense immediately if the amortization period would be one year or less.",
    serpapi_impact:
      "Any commissions or referral fees paid to acquire subscriptions must be evaluated. If average customer life > 12 months, capitalization is required. If SerpApi uses the expedient, document that election formally. Capitalize costs to fulfill contracts only if they meet the asset recognition criteria.",
    action:
      "Review all commission/referral structures. Determine average customer contract duration. Formally elect and document the practical expedient if applicable.",
    tags: ["Commissions", "Contract Costs", "Capitalization", "Practical Expedient"],
  },
  {
    id: "asc350-40",
    asu: "ASU 2018-15",
    topic: "ASC 350-40",
    title: "Internal-Use Software Costs",
    tier: 1,
    status: "Effective — must comply",
    private_effective: "FY beginning after Dec 15, 2020",
    category: "Intangibles",
    impact: "High",
    summary:
      "Governs capitalization of costs incurred in developing or obtaining internal-use software. Three phases: (1) preliminary project stage — expense as incurred, (2) application development stage — capitalize direct costs including payroll, (3) post-implementation/operation stage — expense as incurred. ASU 2018-15 extended this model to hosting arrangements (cloud/SaaS tools the company uses).",
    serpapi_impact:
      "SerpApi's core platform, scraping infrastructure, and internal tooling are all in scope. Engineering salaries during the development phase are capitalizable. Cloud tools SerpApi subscribes to for internal use (e.g., internal dashboards, dev tooling) may also be capitalized under 2018-15. This creates significant intangible assets on the balance sheet in year one.",
    action:
      "Categorize all engineering projects by phase. Track developer time by project and phase. Build capitalized software asset schedule with amortization (typically 3–5 years straight-line).",
    tags: ["Software Dev", "Capitalization", "Intangibles", "Engineering Payroll"],
  },
  {
    id: "asc842",
    asu: "ASU 2016-02",
    topic: "ASC 842",
    title: "Leases",
    tier: 1,
    status: "Effective — must comply",
    private_effective: "FY beginning after Dec 15, 2021",
    category: "Leases",
    impact: "High",
    summary:
      "Requires virtually all leases with a term greater than 12 months to be recognized on the balance sheet as a right-of-use (ROU) asset and corresponding lease liability, measured at the present value of future lease payments. Operating leases produce straight-line P&L expense; finance leases produce front-loaded expense. Short-term lease practical expedient available for leases ≤ 12 months.",
    serpapi_impact:
      "The Austin office lease must be recorded as an ROU asset and lease liability at transition. Any equipment leases (servers, hardware) must also be evaluated. Vendor contracts (e.g., data center agreements, colocation) may contain embedded leases — a contract contains a lease if it conveys the right to control the use of an identified asset.",
    action:
      "Inventory all leases and vendor contracts with identified assets. Calculate PV of lease payments using incremental borrowing rate. Record ROU asset and lease liability in QBO. Evaluate short-term expedient for any leases ≤ 12 months.",
    tags: ["Leases", "ROU Asset", "Balance Sheet", "Office Lease"],
  },
  {
    id: "asc718",
    asu: "ASU 2016-09 + ASU 2018-07",
    topic: "ASC 718",
    title: "Stock-Based Compensation",
    tier: 1,
    status: "Effective — must comply",
    private_effective: "ASU 2016-09: FY after Dec 15, 2017 (private)",
    category: "Compensation",
    impact: "High",
    summary:
      "Requires fair-value measurement of equity awards at grant date, recognized as compensation expense over the vesting period. ASU 2016-09 simplified treatment of forfeitures (can elect to recognize as incurred), excess tax benefits, and minimum statutory withholding. Private companies may use simplified methods for expected term and historical volatility.",
    serpapi_impact:
      "All outstanding stock options, RSUs, or other equity grants require grant-date fair value computation (Black-Scholes or similar). Unvested portions require ongoing quarterly accrual. Forfeitures must be accounted for — document the policy election. Private company practical expedients for expected term are available.",
    action:
      "Pull all equity grant records. Compute grant-date fair values with Black-Scholes. Build vesting schedule and compensation expense accrual table. Document forfeiture accounting policy.",
    tags: ["Stock Options", "Equity", "Compensation", "Vesting"],
  },

  // ── TIER 2: Operational ────────────────────────────────────────────────────
  {
    id: "asc230",
    asu: "ASU 2016-15 + ASU 2016-18",
    topic: "ASC 230",
    title: "Statement of Cash Flows — Classification",
    tier: 2,
    status: "Effective",
    private_effective: "FY beginning after Dec 15, 2018",
    category: "Financial Statements",
    impact: "Medium",
    summary:
      "ASU 2016-15 clarifies classification of eight specific cash flow items (debt prepayments, contingent consideration, insurance proceeds, etc.). ASU 2016-18 requires restricted cash to be included with cash in the beginning and ending balances of the statement of cash flows, with a reconciliation to the balance sheet.",
    serpapi_impact:
      "The security deposit on SerpApi's office lease is likely restricted cash and must be included in the SCF cash reconciliation. If SerpApi ever receives insurance proceeds, pays debt prepayment penalties, or makes contingent payments, specific classification rules apply.",
    action:
      "Identify all restricted cash (security deposits, escrow). Include in SCF opening/closing cash balance with footnote reconciliation to balance sheet unrestricted cash.",
    tags: ["Cash Flow", "Restricted Cash", "Financial Statements", "Security Deposit"],
  },
  {
    id: "asc326",
    asu: "ASU 2016-13",
    topic: "ASC 326 (CECL)",
    title: "Current Expected Credit Losses",
    tier: 2,
    status: "Effective (non-public)",
    private_effective: "FY beginning after Dec 15, 2022",
    category: "Credit Losses",
    impact: "Medium",
    summary:
      "Replaces the incurred loss model with a forward-looking expected credit loss (CECL) model. Entities must estimate and recognize lifetime expected credit losses on financial assets (primarily trade receivables) at origination, rather than waiting until a loss is probable.",
    serpapi_impact:
      "Applies to SerpApi's accounts receivable. Even if collections are historically strong, CECL requires a forward-looking ACL (allowance for credit losses) based on historical loss rates, current conditions, and reasonable and supportable forecasts. The ACL reduces net AR on the balance sheet.",
    action:
      "Build AR aging analysis. Document historical write-off rates. Establish forward-looking ACL methodology and record ACL journal entry. Review and update each period.",
    tags: ["AR", "Credit Losses", "Allowance", "CECL"],
  },
  {
    id: "asc808",
    asu: "ASU 2018-18",
    topic: "ASC 808",
    title: "Collaborative Arrangements",
    tier: 2,
    status: "Effective",
    private_effective: "FY beginning after Dec 15, 2020",
    category: "Revenue",
    impact: "Low-Medium",
    summary:
      "Clarifies when transactions between participants in a collaborative arrangement are within the scope of ASC 606. A transaction is in scope of ASC 606 when the counterparty meets the definition of a customer (i.e., they have contracted to obtain outputs of the entity's ordinary activities in exchange for consideration).",
    serpapi_impact:
      "Relevant if SerpApi has API reseller agreements, data-sharing partnerships, or revenue-sharing arrangements. If the partner is a customer (pays for API output), it's ASC 606. If they're a collaborator sharing in risks and rewards, different treatment may apply.",
    action:
      "Review all reseller, partner, and data-sharing contracts. Determine whether each counterparty is a 'customer' under ASC 606 or a collaborative partner.",
    tags: ["Partnerships", "Resellers", "Collaboration", "Revenue"],
  },
  {
    id: "asc740",
    asu: "ASU 2019-12",
    topic: "ASC 740",
    title: "Income Taxes — Simplifications",
    tier: 2,
    status: "Effective",
    private_effective: "FY beginning after Dec 15, 2021",
    category: "Taxes",
    impact: "Medium",
    summary:
      "Removes certain exceptions from ASC 740 (intraperiod tax allocation, deferred taxes for outside basis differences, year-to-date loss in interim periods) and clarifies other areas including franchise taxes, step-up in tax basis, and allocation of tax expense in a legal entity that is not subject to tax.",
    serpapi_impact:
      "SerpApi as a Texas LLC may have pass-through tax treatment at the federal level, but Texas franchise tax (margin tax) is a direct entity-level tax. Any deferred tax assets from NOL carryforwards, capitalized software timing differences, or other items should be evaluated. If SerpApi converts to C-corp, full ASC 740 becomes critical.",
    action:
      "Coordinate with tax CPA on Texas franchise tax treatment. Assess deferred tax positions on software capitalization timing differences. Document entity-level tax accounting policy.",
    tags: ["Income Tax", "Deferred Tax", "Texas", "Franchise Tax"],
  },

  // ── TIER 3: Monitor ────────────────────────────────────────────────────────
  {
    id: "asc842-common-control",
    asu: "ASU 2023-01",
    topic: "ASC 842",
    title: "Leases: Common Control Arrangements",
    tier: 3,
    status: "Effective FY2024+",
    private_effective: "FY beginning after Dec 15, 2023",
    category: "Leases",
    impact: "Low",
    summary:
      "Clarifies accounting for leasehold improvements and lease terms in arrangements between entities under common control. Allows private companies to use the written terms of a lease (rather than legally enforceable terms) to determine classification and measurement.",
    serpapi_impact:
      "Relevant only if SerpApi leases space from a founder-owned or related entity. If the Austin office is leased from an unrelated third party, low impact. Flag if any related-party lease arrangements exist or arise.",
    action: "Confirm no related-party lease arrangements exist. Monitor if ownership/control structure changes.",
    tags: ["Leases", "Common Control", "Related Party"],
  },
  {
    id: "asc350-crypto",
    asu: "ASU 2023-08",
    topic: "ASC 350-60",
    title: "Crypto Assets — Fair Value Measurement",
    tier: 3,
    status: "Effective FY2025+",
    private_effective: "FY beginning after Dec 15, 2024",
    category: "Digital Assets",
    impact: "N/A",
    summary:
      "Requires fair value measurement of qualifying crypto assets with changes recognized in net income each period. Eliminates the previous lower-of-cost-or-market indefinite-lived intangible asset impairment model for crypto.",
    serpapi_impact:
      "Not applicable unless SerpApi holds Bitcoin, Ethereum, or other qualifying crypto assets on its balance sheet. If any crypto treasury strategy is adopted, mark-to-market accounting is now required with P&L volatility.",
    action:
      "Confirm no crypto holdings in treasury. Flag this standard if crypto acceptance or treasury strategy is ever considered.",
    tags: ["Crypto", "Fair Value", "Digital Assets", "Not Applicable"],
  },
  {
    id: "asc740-disclosures",
    asu: "ASU 2023-09",
    topic: "ASC 740",
    title: "Income Taxes — Enhanced Disclosures",
    tier: 3,
    status: "Effective FY2026 (non-public)",
    private_effective: "FY beginning after Dec 15, 2025",
    category: "Taxes",
    impact: "Low-Medium",
    summary:
      "Requires a tabular effective tax rate reconciliation showing specific categories and amounts, plus disclosure of income taxes paid disaggregated by federal, state, and foreign. This replaces the prior percentage-only reconciliation requirement.",
    serpapi_impact:
      "Directly applicable to SerpApi's FY2026 financial statements — the first full accrual year. The income tax footnote will need to include a tabular rate reconciliation and disaggregated taxes paid. Plan this into the FY2026 financial statement package.",
    action:
      "Include tabular tax rate reconciliation and disaggregated taxes-paid disclosure in FY2026 financial statement footnote planning. Coordinate with tax CPA on data needed.",
    tags: ["Income Tax", "Disclosures", "Footnotes", "FY2026"],
  },
  {
    id: "asc832",
    asu: "ASU 2025-10",
    topic: "ASC 832",
    title: "Government Grants",
    tier: 3,
    status: "Pending — not yet effective",
    private_effective: "TBD — early adoption permitted",
    category: "Government Assistance",
    impact: "Low",
    summary:
      "First-ever authoritative US GAAP standard specifically governing recognition, measurement, and presentation of government grants. Prior to this, US entities used IAS 20 by analogy. Includes guidance for grants related to assets and grants related to income.",
    serpapi_impact:
      "Low impact unless SerpApi receives government grants, SBIR/STTR funding, state economic development incentives, or tax incentives structured as grants. Texas and federal programs exist for tech companies — if any are used, this standard applies.",
    action:
      "Monitor. Evaluate if any state/federal grant or incentive programs are utilized now or in the future.",
    tags: ["Government Grants", "Incentives", "ASU 2025-10"],
  },
];

export const TIER_META: Record<Tier, { label: string; shortLabel: string; color: string; bg: string; border: string; dot: string }> = {
  1: {
    label: "Tier 1 — Foundation: Adopt Now",
    shortLabel: "Foundation",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fca5a5",
    dot: "#dc2626",
  },
  2: {
    label: "Tier 2 — Operational: Active Impact",
    shortLabel: "Operational",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fcd34d",
    dot: "#d97706",
  },
  3: {
    label: "Tier 3 — Monitor: Lower / Pending",
    shortLabel: "Monitor",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#93c5fd",
    dot: "#2563eb",
  },
};

export const IMPACT_DOT: Record<string, string> = {
  Critical: "#7f1d1d",
  High: "#b91c1c",
  Medium: "#92400e",
  "Low-Medium": "#1e40af",
  Low: "#1d4ed8",
  "N/A": "#9ca3af",
};

export const SYSTEM_PROMPT = `You are a senior technical accounting advisor specializing in US GAAP for private technology companies.

COMPANY CONTEXT:
${JSON.stringify(COMPANY_PROFILE, null, 2)}

Key facts:
- FY2026 is their FIRST full accrual-basis year (previously cash basis)
- The cash-to-accrual change is accounted for as a change in accounting principle under ASC 250
- They are a private SaaS/API company — not a public business entity, no SEC reporting
- They have subscriptions + usage-based revenue (critical for ASC 606 analysis)
- They have an office lease in Austin, TX
- They likely issue stock options or equity to employees
- They have significant internal software development costs

Your role:
- Answer questions about how specific FASB standards apply to this company
- Be direct and practical — Rex is a sophisticated Controller who wants specifics, not generalities
- Always cite ASC topic numbers and specific paragraph references when relevant
- Flag if a question involves judgment that requires a CPA/auditor sign-off
- Format responses in clean markdown with headers and bullet points where helpful
- Keep responses focused and actionable — no filler`;
