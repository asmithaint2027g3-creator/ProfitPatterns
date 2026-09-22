export interface SubmenuItem {
  id: string;
  title: string;
  description: string;
  to: string;
  iconName: string;
  categoryRef?: string;
  preview?: {
    title: string;
    description: string;
    highlights: string[];
    ctaText: string;
    ctaTo: string;
  };
}

export interface MegaCategory {
  id: string;
  label: string;
  description: string;
  defaultPreview: {
    title: string;
    description: string;
    highlights: string[];
    ctaText: string;
    ctaTo: string;
  };
}

export interface MegaMenuSection {
  menuKey: "about" | "solutions" | "industries" | "insights" | "resources" | "contact" | "who-we-serve";
  label: string;
  to: string;
  leftCategoryLabel: string;
  leftDescription: string;
  categories: MegaCategory[];
  items: SubmenuItem[];
  bottomCta: {
    text: string;
    actionLabel: string;
    to: string;
  };
}

export const megaMenuData: Record<string, MegaMenuSection> = {
  about: {
    menuKey: "about",
    label: "About",
    to: "/about",
    leftCategoryLabel: "ORGANIZATION & MISSION",
    leftDescription: "A business-first advisory dedicated to turning artificial intelligence into measurable operational profit.",
    categories: [
      {
        id: "overview",
        label: "Company Overview",
        description: "Who we are, our core purpose, and why we exist in the consulting landscape.",
        defaultPreview: {
          title: "Business-First AI Strategy",
          description: "We eliminate technology speculation. Every initiative must tie directly to P&L impact, risk reduction, or gross margin expansion.",
          highlights: [
            "Independent advisory with zero software vendor bias",
            "Direct engagement with experienced strategy practitioners",
            "Clear baseline and KPI measurement on every project",
          ],
          ctaText: "Explore Our Story",
          ctaTo: "/about",
        },
      },
      {
        id: "methodology",
        label: "Philosophy & Principles",
        description: "Our five foundational operating principles and business-first perspective.",
        defaultPreview: {
          title: "Technology Serves Business, Not Vice Versa",
          description: "Having access to technology does not automatically create value. The difficult question is where a business should actually use it.",
          highlights: [
            "Understand the problem before recommending code",
            "Equally willing to recommend against AI when unneeded",
            "Operational simplicity over artificial complexity",
          ],
          ctaText: "Read Our Principles",
          ctaTo: "/about",
        },
      },
      {
        id: "engagement",
        label: "How We Partner",
        description: "Our five-step structured engagement process and client interaction models.",
        defaultPreview: {
          title: "The ProfitPatterns Framework",
          description: "A disciplined, repeatable five-stage path from discovery to measured financial outcomes with full transparency.",
          highlights: [
            "Structured 30-day proof-of-value validation",
            "Clear milestone deliverables and executive briefings",
            "Hands-on enablement for your internal team",
          ],
          ctaText: "View Engagement Model",
          ctaTo: "/how-it-works",
        },
      },
    ],
    items: [
      {
        id: "about-main",
        title: "About ProfitPatterns",
        description: "Our story, mission, and dedication to measurable business value",
        to: "/about",
        iconName: "Compass",
        categoryRef: "overview",
        preview: {
          title: "About ProfitPatterns",
          description: "ProfitPatterns exists to bridge the disconnect between rapid AI developments and pragmatic P&L results.",
          highlights: [
            "Founded on commercial reality, not speculative hype",
            "Focused on operational leverage and unit economics",
            "Direct advisory for CEOs, COOs, and growth leaders",
          ],
          ctaText: "Read Company Profile",
          ctaTo: "/about",
        },
      },
      {
        id: "our-approach",
        title: "Our Approach",
        description: "Start with the business problem, then find the technology",
        to: "/about",
        iconName: "Search",
        categoryRef: "overview",
        preview: {
          title: "Business-First Analysis",
          description: "We examine business objectives, workflows, and unit economics before discussing architecture or algorithms.",
          highlights: [
            "Rigorous process mapping and bottleneck diagnosis",
            "Commercial opportunity assessment with projected payback",
            "Tailored implementation roadmap with risk controls",
          ],
          ctaText: "Learn How We Analyze",
          ctaTo: "/about",
        },
      },
      {
        id: "why-profitpatterns",
        title: "Why ProfitPatterns",
        description: "Five reasons organizations choose our business-first advisory",
        to: "/about",
        iconName: "ShieldCheck",
        categoryRef: "methodology",
        preview: {
          title: "Five Pillars of Trust",
          description: "Explore why high-growth enterprises partner with ProfitPatterns over traditional IT contractors.",
          highlights: [
            "Pragmatic, commercially validated recommendations",
            "Strict non-disclosure and data privacy integrity",
            "Continuous focus on gross margin enhancement",
          ],
          ctaText: "See Why We Are Different",
          ctaTo: "/about",
        },
      },
      {
        id: "how-we-work",
        title: "How We Work",
        description: "The 5-stage framework from question to measured outcome",
        to: "/how-it-works",
        iconName: "Workflow",
        categoryRef: "engagement",
        preview: {
          title: "The 5-Stage Framework",
          description: "Every engagement runs through: Understand, Identify, Design, Implement, and Measure.",
          highlights: [
            "Stage 1: Comprehensive operational diagnostic",
            "Stage 3: Architectural blueprints & vendor vetting",
            "Stage 5: Continuous performance and ROI tracking",
          ],
          ctaText: "Review Step-by-Step Process",
          ctaTo: "/how-it-works",
        },
      },
      {
        id: "faq",
        title: "FAQ & Engagement Terms",
        description: "Honest, straightforward answers to common consulting questions",
        to: "/faq",
        iconName: "HelpCircle",
        categoryRef: "engagement",
        preview: {
          title: "Common Questions Answered",
          description: "Transparent answers about our fee structures, timelines, team composition, and expected outcomes.",
          highlights: [
            "Fixed-scope assessments and strategic sprints",
            "Average engagement timeline of 4 to 12 weeks",
            "Clear criteria for client readiness and success",
          ],
          ctaText: "Read Complete FAQ",
          ctaTo: "/faq",
        },
      },
    ],
    bottomCta: {
      text: "Want to understand how we would approach your business challenge?",
      actionLabel: "Schedule an Introductory Call",
      to: "/contact",
    },
  },

  solutions: {
    menuKey: "solutions",
    label: "Solutions",
    to: "/solutions",
    leftCategoryLabel: "PRACTICE AREAS & CAPABILITIES",
    leftDescription: "Targeted advisory engagements designed to solve structural bottlenecks and create operational leverage.",
    categories: [
      {
        id: "strategy-ai",
        label: "AI & Growth Strategy",
        description: "Executive alignment, commercial AI strategy, and profit architecture.",
        defaultPreview: {
          title: "AI Strategy & Commercial Roadmap",
          description: "Align generative models, machine learning, and predictive capabilities directly with P&L performance.",
          highlights: [
            "Identification of high-yield AI use cases",
            "Comprehensive technical feasibility & cost modeling",
            "Executive leadership governance & risk framework",
          ],
          ctaText: "Explore AI Strategy",
          ctaTo: "/solutions/ai-strategy",
        },
      },
      {
        id: "operations-automation",
        label: "Automation & Operations",
        description: "Intelligent workflow orchestration, process engineering, and efficiency.",
        defaultPreview: {
          title: "Autonomous Workflow Orchestration",
          description: "Remove friction, handoff latency, and repetitive manual tasks across your core operating pipelines.",
          highlights: [
            "End-to-end process elimination before automation",
            "Modern integration across legacy software stacks",
            "Substantial reduction in operating overhead",
          ],
          ctaText: "Explore Business Automation",
          ctaTo: "/solutions/business-automation",
        },
      },
      {
        id: "data-decisions",
        label: "Data, Analytics & Digital",
        description: "Predictive signals, unified data foundations, and digital transformation.",
        defaultPreview: {
          title: "Unified Decision Signals & Data Truth",
          description: "Transform fragmented databases and operational logs into clear, actionable executive intelligence.",
          highlights: [
            "High-confidence predictive forecasting models",
            "Automated KPI dashboards and anomaly alerts",
            "Clean data architecture ready for AI ingestion",
          ],
          ctaText: "Explore Data & Analytics",
          ctaTo: "/solutions/data-analytics",
        },
      },
    ],
    items: [
      {
        id: "ai-strategy",
        title: "AI Strategy Consulting",
        description: "Align artificial intelligence directly with gross margin expansion",
        to: "/solutions/ai-strategy",
        iconName: "Brain",
        categoryRef: "strategy-ai",
        preview: {
          title: "AI Strategy Consulting",
          description: "Build an AI strategy around your specific business model rather than retrofitting generic AI tools into your workflows.",
          highlights: [
            "Avoid costly speculative proof-of-concepts",
            "Prioritize initiatives with measurable 90-day returns",
            "Build defensible proprietary data advantages",
          ],
          ctaText: "View Solution Details",
          ctaTo: "/solutions/ai-strategy",
        },
      },
      {
        id: "business-automation",
        title: "Business Automation",
        description: "Eliminate manual friction with reliable automated workflows",
        to: "/solutions/business-automation",
        iconName: "Cpu",
        categoryRef: "operations-automation",
        preview: {
          title: "Intelligent Business Automation",
          description: "Automate repetitive customer communication, data reconciliation, reporting, and operational handoffs.",
          highlights: [
            "10x faster execution cycles across key departments",
            "Error-free document and transactional processing",
            "Frees human talent for strategic client delivery",
          ],
          ctaText: "View Automation Practice",
          ctaTo: "/solutions/business-automation",
        },
      },
      {
        id: "data-analytics",
        title: "Data & Analytics",
        description: "Transform raw enterprise data into executive decision signals",
        to: "/solutions/data-analytics",
        iconName: "BarChart3",
        categoryRef: "data-decisions",
        preview: {
          title: "Data & Decision Analytics",
          description: "Turn scattered operational metrics into a reliable single source of truth that guides critical decisions.",
          highlights: [
            "Predictive customer churn and demand indicators",
            "Executive margin tracking across products & clients",
            "Elimination of manual spreadsheet compiling",
          ],
          ctaText: "View Analytics Practice",
          ctaTo: "/solutions/data-analytics",
        },
      },
      {
        id: "process-optimization",
        title: "Process Optimization",
        description: "Re-engineer workflows for peak velocity before applying tech",
        to: "/solutions/process-optimization",
        iconName: "Workflow",
        categoryRef: "operations-automation",
        preview: {
          title: "Business Process Optimization",
          description: "Never automate an inefficient process. We streamline operational steps, remove unnecessary checks, and maximize throughput.",
          highlights: [
            "Detailed value-stream bottleneck identification",
            "Cycle time reduction between inquiry and fulfillment",
            "Standard operating procedures engineered for scale",
          ],
          ctaText: "View Process Engineering",
          ctaTo: "/solutions/process-optimization",
        },
      },
      {
        id: "digital-transformation",
        title: "Digital Transformation",
        description: "Pragmatic modernization grounded in strict unit economics",
        to: "/solutions/digital-transformation",
        iconName: "Layers",
        categoryRef: "data-decisions",
        preview: {
          title: "Pragmatic Digital Modernization",
          description: "Modernize legacy systems incrementally without multi-year disruptions or ballooning contractor budgets.",
          highlights: [
            "Cloud infrastructure and API-first modularity",
            "High adoption rates through user-centric workflows",
            "Targeted milestones with continuous value releases",
          ],
          ctaText: "View Transformation Practice",
          ctaTo: "/solutions/digital-transformation",
        },
      },
      {
        id: "profit-growth-strategy",
        title: "Profit & Growth Strategy",
        description: "Discover latent pricing, margin, and cost-efficiency patterns",
        to: "/solutions/profit-growth-strategy",
        iconName: "TrendingUp",
        categoryRef: "strategy-ai",
        preview: {
          title: "Profit & Growth Strategy",
          description: "Combine strategic consulting with intelligence tools to uncover hidden margin expansion opportunities.",
          highlights: [
            "Granular unit-level profitability analysis",
            "Pricing optimization grounded in market sensitivity",
            "Cost-to-serve reduction across high-volume accounts",
          ],
          ctaText: "View Profit Strategy",
          ctaTo: "/solutions/profit-growth-strategy",
        },
      },
      {
        id: "ai-readiness",
        title: "AI Readiness Assessment",
        description: "Evaluate data, infrastructure, and team capabilities first",
        to: "/solutions/ai-readiness",
        iconName: "CheckCircle2",
        categoryRef: "strategy-ai",
        preview: {
          title: "AI Readiness & Gap Assessment",
          description: "A fast, comprehensive audit of your technical infrastructure, data cleanliness, and organizational readiness.",
          highlights: [
            "360-degree technical and data hygiene audit",
            "Prioritized matrix of quick wins vs. foundation builds",
            "Board-ready executive presentation with investment plan",
          ],
          ctaText: "View Readiness Diagnostic",
          ctaTo: "/solutions/ai-readiness",
        },
      },
    ],
    bottomCta: {
      text: "Need help identifying the right AI opportunity for your business?",
      actionLabel: "Talk to an Expert",
      to: "/contact",
    },
  },

  industries: {
    menuKey: "industries",
    label: "Industries",
    to: "/industries",
    leftCategoryLabel: "SECTORS & BUSINESS TYPES",
    leftDescription: "Every industry operates under distinct commercial pressures, regulatory requirements, and margin models.",
    categories: [
      {
        id: "knowledge-services",
        label: "Knowledge & Professional Services",
        description: "Firms whose primary output is human expertise, strategy, and advisory.",
        defaultPreview: {
          title: "Professional Services & Knowledge Work",
          description: "Accelerate deliverable synthesis, research, contract review, and client reporting while protecting margins.",
          highlights: [
            "Automated research briefs and drafting workflows",
            "Standardized knowledge capture across partner teams",
            "Dramatic decrease in non-billable overhead hours",
          ],
          ctaText: "Explore Professional Services",
          ctaTo: "/industries/professional-services",
        },
      },
      {
        id: "commerce-operations",
        label: "Commerce & Operations",
        description: "Companies managing physical logistics, inventory, and transaction flow.",
        defaultPreview: {
          title: "Retail, E-Commerce & Physical Ops",
          description: "Optimizing supply chain visibility, customer lifetime value, dynamic pricing, and warehouse fulfillment.",
          highlights: [
            "Automated demand forecasting and stock triggers",
            "Personalized retention and checkout support",
            "Real-time margin visibility across SKU portfolios",
          ],
          ctaText: "Explore Retail & E-Commerce",
          ctaTo: "/industries/retail-ecommerce",
        },
      },
      {
        id: "scale-finance",
        label: "Finance, Startups & SMBs",
        description: "Growing organizations building lean operating structures for fast scale.",
        defaultPreview: {
          title: "Financial Services, Startups & Growth SMBs",
          description: "High-compliance workflow automation, risk analysis, and scalable operational scaffolding for scaling teams.",
          highlights: [
            "Automated compliance checks and audit logging",
            "Lean operating leverage that grows without headcount",
            "Rapid deployment tailored to growth stage",
          ],
          ctaText: "Explore Growth Sectors",
          ctaTo: "/industries/startups",
        },
      },
    ],
    items: [
      {
        id: "startups",
        title: "Startups",
        description: "Build scalable intelligence and operating models from day one",
        to: "/industries/startups",
        iconName: "Rocket",
        categoryRef: "scale-finance",
        preview: {
          title: "Startups & Emerging Ventures",
          description: "Establish automated foundations that allow lean venture-backed teams to operate with the capacity of enterprise teams.",
          highlights: [
            "AI-powered customer onboarding and ticket triage",
            "Automated financial reconciliation and reporting",
            "Focus developer hours on core product differentiation",
          ],
          ctaText: "View Startup Solutions",
          ctaTo: "/industries/startups",
        },
      },
      {
        id: "smb",
        title: "Small & Medium Businesses",
        description: "High-ROI automation without enterprise complexity or cost",
        to: "/industries/small-medium-businesses",
        iconName: "Building2",
        categoryRef: "scale-finance",
        preview: {
          title: "Small & Medium Businesses",
          description: "Practical technologies that solve everyday staffing bottlenecks, customer response delays, and operational friction.",
          highlights: [
            "Immediate reduction in manual data entry hours",
            "Affordable implementation with near-instant payback",
            "No expensive dedicated IT team required",
          ],
          ctaText: "View SMB Solutions",
          ctaTo: "/industries/small-medium-businesses",
        },
      },
      {
        id: "prof-services",
        title: "Professional Services",
        description: "Empower partners and consultants with high-velocity tools",
        to: "/industries/professional-services",
        iconName: "Briefcase",
        categoryRef: "knowledge-services",
        preview: {
          title: "Professional & Advisory Services",
          description: "Transform legal, financial, and management consulting workflows with specialized intelligence pipelines.",
          highlights: [
            "Automated document summarization and analysis",
            "Standardized proposal and deliverable generation",
            "Higher realization rates on fixed-fee engagements",
          ],
          ctaText: "View Professional Services",
          ctaTo: "/industries/professional-services",
        },
      },
      {
        id: "retail-ecom",
        title: "Retail & E-Commerce",
        description: "Transform customer data and logistics into profit drivers",
        to: "/industries/retail-ecommerce",
        iconName: "ShoppingBag",
        categoryRef: "commerce-operations",
        preview: {
          title: "Retail & Multi-Channel Commerce",
          description: "Unify order fulfillment, stock prediction, dynamic discounting, and customer lifecycle engagement.",
          highlights: [
            "Reduced stockouts and inventory carrying costs",
            "Automated return processing and satisfaction monitoring",
            "Data-driven marketing attribution modeling",
          ],
          ctaText: "View Commerce Solutions",
          ctaTo: "/industries/retail-ecommerce",
        },
      },
      {
        id: "fin-services",
        title: "Financial & Business Services",
        description: "Secure, compliant automation for high-volume transactions",
        to: "/industries/financial-business-services",
        iconName: "Landmark",
        categoryRef: "scale-finance",
        preview: {
          title: "Financial Services & FinTech",
          description: "Automate loan processing, audit preparation, anomaly detection, and client reporting with bank-grade security.",
          highlights: [
            "Full regulatory compliance and audit trails",
            "Instant reconciliation across multiple banking systems",
            "Algorithmic risk assessment and portfolio tracking",
          ],
          ctaText: "View Financial Solutions",
          ctaTo: "/industries/financial-business-services",
        },
      },
      {
        id: "ops-driven",
        title: "Operations-Driven Businesses",
        description: "Eliminate supply chain, fulfillment, and field service bottlenecks",
        to: "/industries/operations-driven",
        iconName: "Factory",
        categoryRef: "commerce-operations",
        preview: {
          title: "Operations-Driven Enterprises",
          description: "Connect factory floors, logistics dispatch, and field service technicians with centralized operational intelligence.",
          highlights: [
            "Real-time dispatch optimization and route planning",
            "Predictive equipment maintenance schedules",
            "Elimination of communication gaps between office and field",
          ],
          ctaText: "View Operations Solutions",
          ctaTo: "/industries/operations-driven",
        },
      },
      {
        id: "growing-orgs",
        title: "Growing Organizations",
        description: "Systems that scale seamlessly as transaction volumes multiply",
        to: "/industries/growing-organizations",
        iconName: "ArrowUpRight",
        categoryRef: "scale-finance",
        preview: {
          title: "High-Growth Scaling Organizations",
          description: "Prevent growing pains by architecting systems that handle 5x to 10x volume increases without proportional headcount growth.",
          highlights: [
            "Modular architecture ready for organizational expansion",
            "Automated cross-departmental coordination",
            "Preserves agility while establishing corporate rigor",
          ],
          ctaText: "View Growth Solutions",
          ctaTo: "/industries/growing-organizations",
        },
      },
    ],
    bottomCta: {
      text: "Looking for tailored insights for your specific operational model?",
      actionLabel: "Talk to an Industry Specialist",
      to: "/contact",
    },
  },

  insights: {
    menuKey: "insights",
    label: "Insights",
    to: "/insights",
    leftCategoryLabel: "EXECUTIVE PERSPECTIVES",
    leftDescription: "Rigorous field notes, economic analyses, and architectural breakdowns written by strategic practitioners.",
    categories: [
      {
        id: "strategy-insights",
        label: "AI Strategy & Economics",
        description: "Macro analysis of enterprise AI adoption, pricing models, and ROI.",
        defaultPreview: {
          title: "The Commercial Economics of AI",
          description: "Read critical analyses on why enterprise generative AI pilots stall and how top leaders achieve positive returns.",
          highlights: [
            "Unit economics breakdown of custom model pipelines",
            "Buy vs. build evaluation frameworks",
            "Defensibility against commodity open-source models",
          ],
          ctaText: "Read AI Strategy Briefings",
          ctaTo: "/insights",
        },
      },
      {
        id: "automation-playbooks",
        label: "Automation & Process Engineering",
        description: "Detailed tactical blueprints for automating real-world workflows.",
        defaultPreview: {
          title: "Modern Operational Playbooks",
          description: "Tactical guides on architecting autonomous agent pipelines, removing handoff latency, and error handling.",
          highlights: [
            "Step-by-step workflow deconstructions",
            "Human-in-the-loop review architecture",
            "Benchmarked throughput and accuracy improvements",
          ],
          ctaText: "Browse Automation Guides",
          ctaTo: "/insights",
        },
      },
      {
        id: "data-trends",
        label: "Data Governance & Market Trends",
        description: "Navigating proprietary data moats, privacy, and emerging tech.",
        defaultPreview: {
          title: "Data Sovereignty & Market Analysis",
          description: "How enterprises protect confidential IP while leveraging frontier intelligence models.",
          highlights: [
            "Private enterprise deployment patterns",
            "Zero-data-retention security protocols",
            "Market shifts across enterprise SaaS ecosystems",
          ],
          ctaText: "Read Market Perspectives",
          ctaTo: "/insights",
        },
      },
    ],
    items: [
      {
        id: "insight-strategy",
        title: "AI Strategy in Practice",
        description: "Connecting intelligence directly to margin and unit economics",
        to: "/insights",
        iconName: "Lightbulb",
        categoryRef: "strategy-insights",
        preview: {
          title: "AI Strategy in Enterprise Practice",
          description: "Practical perspectives on avoiding the trap of proof-of-concept sprawl and aligning AI with strategic goals.",
          highlights: [
            "Frameworks for calculating operational leverage",
            "Identifying high-conviction pilot candidates",
            "Executive governance and alignment principles",
          ],
          ctaText: "Read Strategy Articles",
          ctaTo: "/insights",
        },
      },
      {
        id: "insight-automation",
        title: "Intelligent Automation",
        description: "Practical advice on what to automate and where to stop",
        to: "/insights",
        iconName: "Sliders",
        categoryRef: "automation-playbooks",
        preview: {
          title: "Intelligent Automation Playbooks",
          description: "A pragmatic guide to choosing between deterministic script rules, RPA tools, and LLM-based autonomous workflows.",
          highlights: [
            "The 5 questions to ask before writing automation",
            "Failure mode analysis and safety fallbacks",
            "Calculating true payback across human hours saved",
          ],
          ctaText: "Read Automation Playbooks",
          ctaTo: "/insights",
        },
      },
      {
        id: "insight-data",
        title: "Data & Decision Infrastructure",
        description: "Building reliable single sources of truth from fragmented data",
        to: "/insights",
        iconName: "Database",
        categoryRef: "data-trends",
        preview: {
          title: "Data Foundations for Modern AI",
          description: "Why clean data architecture beats larger parameters every time, and how to fix enterprise data hygiene.",
          highlights: [
            "ETL pipelines tailored for semantic indexing",
            "Real-time executive signal synthesis",
            "Eliminating conflicting KPI reports across silos",
          ],
          ctaText: "Read Data Architecture Notes",
          ctaTo: "/insights",
        },
      },
      {
        id: "insight-process",
        title: "Process Optimization",
        description: "Uncovering and repairing hidden enterprise bottlenecks",
        to: "/insights",
        iconName: "GitBranch",
        categoryRef: "automation-playbooks",
        preview: {
          title: "Uncovering Process Friction",
          description: "How to run non-invasive operational diagnostics that expose the true causes of delay in your organization.",
          highlights: [
            "Root-cause analysis vs. surface symptoms",
            "Eliminating unnecessary executive sign-off steps",
            "Designing frictionless handoffs across departments",
          ],
          ctaText: "Read Process Field Notes",
          ctaTo: "/insights",
        },
      },
      {
        id: "insight-digital",
        title: "Digital Transformation Realities",
        description: "Lessons from modernizing operations without breaking culture",
        to: "/insights",
        iconName: "RefreshCw",
        categoryRef: "strategy-insights",
        preview: {
          title: "Digital Transformation Realities",
          description: "Why technology adoption is fundamentally a change management challenge and how to secure high staff buy-in.",
          highlights: [
            "User-first workflow engineering",
            "Demonstrating immediate individual time savings",
            "Maintaining organizational momentum through sprints",
          ],
          ctaText: "Read Transformation Lessons",
          ctaTo: "/insights",
        },
      },
      {
        id: "insight-trends",
        title: "AI Technology Trends",
        description: "Separating commercial breakthroughs from speculative vendor hype",
        to: "/insights",
        iconName: "Compass",
        categoryRef: "data-trends",
        preview: {
          title: "Enterprise AI Trend Analysis",
          description: "Quarterly briefings on the practical commercial significance of new frontier models, agentic systems, and tooling.",
          highlights: [
            "Evaluating multimodal capabilities in operations",
            "Open source vs. proprietary API economics",
            "Predictions for autonomous enterprise systems",
          ],
          ctaText: "Explore Tech Trends",
          ctaTo: "/insights",
        },
      },
    ],
    bottomCta: {
      text: "Stay ahead of commercial AI shifts and strategic playbooks.",
      actionLabel: "Explore the Full Knowledge Base",
      to: "/insights",
    },
  },

  resources: {
    menuKey: "resources",
    label: "Resources",
    to: "/resources",
    leftCategoryLabel: "DIAGNOSTIC TOOLS & FRAMEWORKS",
    leftDescription: "Downloadable toolkits, scoring rubrics, and structured checklists to evaluate your organization.",
    categories: [
      {
        id: "assessment-tools",
        label: "Assessment & Scoring Matrices",
        description: "Quantify your readiness and identify high-conviction candidate initiatives.",
        defaultPreview: {
          title: "Executive Assessment Toolkits",
          description: "Structured diagnostic frameworks designed to benchmark capability maturity, data hygiene, and organizational readiness.",
          highlights: [
            "Self-guided scoring matrices with weighted evaluations",
            "Direct comparison against benchmarked industry leaders",
            "Instant clarity on immediate priorities",
          ],
          ctaText: "Access Diagnostic Toolkits",
          ctaTo: "/resources/ai-opportunity-assessment",
        },
      },
      {
        id: "checklists-guides",
        label: "Checklists & Playbooks",
        description: "Field-tested operational checklists prior to technology investment.",
        defaultPreview: {
          title: "Operational Review Checklists",
          description: "Step-by-step checklists to audit processes, evaluate software candidates, and prevent common implementation traps.",
          highlights: [
            "Comprehensive 20-point process health audit",
            "Automation feasibility checklist",
            "Clear sign-off criteria for leadership teams",
          ],
          ctaText: "Download Checklists",
          ctaTo: "/resources/business-automation-checklist",
        },
      },
      {
        id: "roi-cases",
        label: "Financial Models & Case Studies",
        description: "Financial payback templates and deconstructed engagement breakdowns.",
        defaultPreview: {
          title: "ROI Modeling & Verified Case Studies",
          description: "Understand the financial mechanics of intelligence systems and examine how similar organizations solved real problems.",
          highlights: [
            "P&L impact calculators and payback estimators",
            "Full architectural breakdowns and lessons learned",
            "Only verified case studies published",
          ],
          ctaText: "Explore ROI Models",
          ctaTo: "/resources/roi-business-value-guide",
        },
      },
    ],
    items: [
      {
        id: "ai-opportunity",
        title: "AI Opportunity Assessment",
        description: "Structured diagnostic framework to pinpoint high-value AI candidates",
        to: "/resources/ai-opportunity-assessment",
        iconName: "FileSearch",
        categoryRef: "assessment-tools",
        preview: {
          title: "AI Opportunity Assessment Toolkit",
          description: "Identify where AI creates genuine economic leverage versus where simpler automation or rule systems suffice.",
          highlights: [
            "Evaluates impact, technical feasibility, and data availability",
            "Outputs a prioritized 2x2 opportunity portfolio matrix",
            "Guides executive resource allocation",
          ],
          ctaText: "Access Assessment Tool",
          ctaTo: "/resources/ai-opportunity-assessment",
        },
      },
      {
        id: "automation-checklist",
        title: "Business Automation Checklist",
        description: "Identify which manual workflows are ripe for autonomous orchestration",
        to: "/resources/business-automation-checklist",
        iconName: "ListChecks",
        categoryRef: "checklists-guides",
        preview: {
          title: "Business Automation Checklist",
          description: "A 15-question evaluation to determine if a specific process is ready for automation, outsourcing, or elimination.",
          highlights: [
            "Scores volume, variability, and exception rates",
            "Calculates potential monthly staff hours saved",
            "Identifies hidden dependencies before work begins",
          ],
          ctaText: "Download Checklist",
          ctaTo: "/resources/business-automation-checklist",
        },
      },
      {
        id: "process-review",
        title: "Business Process Review",
        description: "Audit and streamline a workflow before writing code or buying tools",
        to: "/resources/business-process-review",
        iconName: "ClipboardCheck",
        categoryRef: "checklists-guides",
        preview: {
          title: "Business Process Review Guide",
          description: "Map your end-to-end customer and operational flows to eliminate wasteful steps before automating.",
          highlights: [
            "Step-by-step value stream mapping framework",
            "Bottleneck isolation checklist",
            "Ensures technology amplifies efficiency, not confusion",
          ],
          ctaText: "View Review Framework",
          ctaTo: "/resources/business-process-review",
        },
      },
      {
        id: "ai-readiness-checklist",
        title: "AI Readiness Checklist",
        description: "Benchmark data maturity, infrastructure, and team capabilities",
        to: "/resources/ai-readiness-checklist",
        iconName: "ShieldAlert",
        categoryRef: "assessment-tools",
        preview: {
          title: "AI Readiness Checklist",
          description: "A comprehensive scoring checklist covering data accessibility, security protocols, API readiness, and executive sponsorship.",
          highlights: [
            "Objective 100-point organizational readiness score",
            "Identifies critical technical blockers early",
            "Recommended preparation steps prior to vendor discussions",
          ],
          ctaText: "Download Readiness Scorecard",
          ctaTo: "/resources/ai-readiness-checklist",
        },
      },
      {
        id: "roi-guide",
        title: "ROI & Business Value Guide",
        description: "Model financial payback and P&L impact before deploying capital",
        to: "/resources/roi-business-value-guide",
        iconName: "Calculator",
        categoryRef: "roi-cases",
        preview: {
          title: "ROI & Financial Modeling Guide",
          description: "How to forecast total cost of ownership (TCO) and net cash flow impact for artificial intelligence investments.",
          highlights: [
            "Includes infrastructure, API tokens, and maintenance costs",
            "Quantifies both hard cost savings and revenue uplift",
            "Board-ready financial justification templates",
          ],
          ctaText: "Access ROI Guide",
          ctaTo: "/resources/roi-business-value-guide",
        },
      },
      {
        id: "case-studies-res",
        title: "Verified Case Studies",
        description: "Examine the technical thinking and outcomes behind our client work",
        to: "/resources/case-studies",
        iconName: "BookOpen",
        categoryRef: "roi-cases",
        preview: {
          title: "Verified Client Case Studies",
          description: "In-depth explorations of how mid-market and enterprise businesses partnered with ProfitPatterns to unlock growth.",
          highlights: [
            "Detailed before-and-after operational metrics",
            "Honest accounts of technical challenges and solutions",
            "Real ROI realized against original projections",
          ],
          ctaText: "Browse Case Studies",
          ctaTo: "/resources/case-studies",
        },
      },
    ],
    bottomCta: {
      text: "Need a custom evaluation matrix tailored to your executive team?",
      actionLabel: "Request a Custom Diagnostic",
      to: "/contact",
    },
  },

  contact: {
    menuKey: "contact",
    label: "Contact",
    to: "/contact",
    leftCategoryLabel: "START A CONVERSATION",
    leftDescription: "Connect directly with our strategy practice. No scripted sales pitches — just an honest discussion on business leverage.",
    categories: [
      {
        id: "direct-contact",
        label: "Immediate Inquiries",
        description: "Direct routes to our senior advisory team and partners.",
        defaultPreview: {
          title: "Direct Access to Strategic Advisors",
          description: "We respect your time. Every conversation starts with an analysis of your operational reality, not a software sales deck.",
          highlights: [
            "Guaranteed response within 1 business day",
            "Confidential, non-disclosure protected discovery",
            "Clear next steps or honest recommendation against project",
          ],
          ctaText: "Contact Us Today",
          ctaTo: "/contact",
        },
      },
      {
        id: "consultation-types",
        label: "Consultation Formats",
        description: "Choose between quick questions or structured architectural reviews.",
        defaultPreview: {
          title: "Tailored Discussion Formats",
          description: "Whether you have an immediate technical blocker or require a full commercial roadmap, choose the route that suits you.",
          highlights: [
            "15-minute introductory scoping discussion",
            "45-minute comprehensive strategy consultation",
            "Rapid feedback on feasibility and potential return",
          ],
          ctaText: "Book a Consultation",
          ctaTo: "/contact",
        },
      },
      {
        id: "remote-presence",
        label: "Office & Availability",
        description: "Operating remotely across global time zones.",
        defaultPreview: {
          title: "Remote-First Strategic Advisory",
          description: "We work seamlessly with executive teams across North America, Europe, Asia, and Australasia.",
          highlights: [
            "Flexible scheduling across all standard business hours",
            "Secure video and collaborative whiteboarding environments",
            "Rapid turnaround on diagnostic requests",
          ],
          ctaText: "View Availability & Contact Info",
          ctaTo: "/contact",
        },
      },
    ],
    items: [
      {
        id: "talk-to-expert",
        title: "Talk to an Expert",
        description: "Discuss your business challenges and explore practical opportunities",
        to: "/contact",
        iconName: "UserCheck",
        categoryRef: "direct-contact",
        preview: {
          title: "Speak with an Advisory Partner",
          description: "Share the specific bottleneck or opportunity you are considering. We will give you an objective read on feasibility.",
          highlights: [
            "No obligation and no canned software pitch",
            "Direct discussion with senior AI strategist",
            "Clear recommendations on whether a project makes sense",
          ],
          ctaText: "Schedule Discussion",
          ctaTo: "/contact",
        },
      },
      {
        id: "strategy-consultation",
        title: "Strategy Consultation",
        description: "Request a structured 45-minute architectural & commercial review",
        to: "/contact",
        iconName: "Calendar",
        categoryRef: "consultation-types",
        preview: {
          title: "Structured Strategy Consultation",
          description: "For leadership teams with defined projects or budgets seeking formal architectural guidance and roadmap planning.",
          highlights: [
            "Pre-call questionnaire to maximize discussion depth",
            "Technical architecture and risk review",
            "Immediate high-level ROI calculation",
          ],
          ctaText: "Request Consultation",
          ctaTo: "/contact",
        },
      },
      {
        id: "quick-enquiry",
        title: "Quick Enquiry",
        description: "Send a short message and receive a thoughtful response within 24 hours",
        to: "/contact",
        iconName: "Mail",
        categoryRef: "direct-contact",
        preview: {
          title: "Send a Quick Note",
          description: "Have a brief question or need confirmation on our capabilities? Submit a quick note and our team will respond directly.",
          highlights: [
            "Simple 3-field contact form",
            "Reviewed directly by practicing consultants",
            "Reply delivered straight to your inbox",
          ],
          ctaText: "Submit Quick Message",
          ctaTo: "/contact",
        },
      },
      {
        id: "chat-whatsapp",
        title: "Chat on WhatsApp",
        description: "Instant, asynchronous communication with our coordination team",
        to: "/contact",
        iconName: "MessageCircle",
        categoryRef: "direct-contact",
        preview: {
          title: "Direct WhatsApp Line",
          description: "The fastest route to confirm availability, ask scoping questions, or share background documents directly.",
          highlights: [
            "Instant connection to human team member",
            "Convenient for international executive schedules",
            "Seamless transition to calendar booking",
          ],
          ctaText: "Open WhatsApp Chat",
          ctaTo: "/contact",
        },
      },
    ],
    bottomCta: {
      text: "Ready to turn AI into a measurable profit advantage?",
      actionLabel: "Talk to an Expert Today",
      to: "/contact",
    },
  },
  "who-we-serve": {
    menuKey: "who-we-serve",
    label: "Who We Serve",
    to: "/who-we-serve",
    leftCategoryLabel: "WHO WE SERVE",
    leftDescription:
      "AI disruption, profitability pressure, and strategic uncertainty demand more than technology decisions. ProfitPatterns helps decision-makers translate AI into measurable business value and long-term competitive advantage.",
    categories: [
      {
        id: "icp-all",
        label: "Customer Segments",
        description: "Four distinct Ideal Customer Profiles",
        defaultPreview: {
          title: "Executive Strategic Partnership",
          description:
            "AI disruption, profitability pressure, and strategic uncertainty demand more than technology decisions. ProfitPatterns helps decision-makers translate AI into measurable business value and long-term competitive advantage.",
          highlights: [
            "Independent business-first advisory",
            "Multi-pattern economic advantage",
            "Measurable enterprise value creation",
          ],
          ctaText: "Explore All Segments",
          ctaTo: "/who-we-serve",
        },
      },
    ],
    items: [
      {
        id: "cxos-enterprise-leaders",
        title: "CXOs & Enterprise Leaders",
        description:
          "Translate AI potential into profit strategy, identify value leakage, and design transformation roadmaps aligned with growth, margins, and competitive positioning.",
        to: "/who-we-serve#cxos-enterprise-leaders",
        iconName: "Briefcase",
        categoryRef: "icp-all",
        preview: {
          title: "For CEOs, COOs & CFOs Leading Through AI Disruption",
          description:
            "Translate AI potential into profit strategy, identify value leakage, and design transformation roadmaps aligned with growth, margins, and competitive positioning.",
          highlights: [
            "15–25% EBITDA uplift",
            "6–18 month payback on AI investments",
            "Clear platform or ecosystem end-game",
          ],
          ctaText: "Explore CXOs & Enterprise Leaders →",
          ctaTo: "/who-we-serve#cxos-enterprise-leaders",
        },
      },
      {
        id: "boards-directors",
        title: "Boards & Directors",
        description:
          "Gain an independent business-first perspective on AI investments, capital allocation, governance, and long-term strategic defensibility.",
        to: "/who-we-serve#boards-directors",
        iconName: "ShieldCheck",
        categoryRef: "icp-all",
        preview: {
          title: "For Boards Demanding Clarity, Not AI Theater",
          description:
            "Gain an independent business-first perspective on AI investments, capital allocation, governance, and long-term strategic defensibility.",
          highlights: [
            "Confident AI governance",
            "Sharper capital allocation decisions",
            "Stronger strategic oversight",
          ],
          ctaText: "Explore Boards & Directors →",
          ctaTo: "/who-we-serve#boards-directors",
        },
      },
      {
        id: "private-equity-investors",
        title: "Private Equity & Investors",
        description:
          "Identify AI-driven value creation opportunities, develop repeatable portfolio playbooks, and improve visibility into EBITDA opportunities.",
        to: "/who-we-serve#private-equity-investors",
        iconName: "TrendingUp",
        categoryRef: "icp-all",
        preview: {
          title: "For Investors Focused on Value Creation, Not Experiments",
          description:
            "Identify AI-driven value creation opportunities, develop repeatable portfolio playbooks, and improve visibility into EBITDA opportunities.",
          highlights: [
            "Portfolio-wide value creation visibility",
            "Repeatable AI value-creation playbooks",
            "Faster identification of EBITDA opportunities",
          ],
          ctaText: "Explore Private Equity & Investors →",
          ctaTo: "/who-we-serve#private-equity-investors",
        },
      },
      {
        id: "family-owned-enterprises",
        title: "Family-Owned Enterprises",
        description:
          "Modernize with strategic clarity while protecting core profit pools, ownership priorities, organizational culture, and long-term resilience.",
        to: "/who-we-serve#family-owned-enterprises",
        iconName: "Compass",
        categoryRef: "icp-all",
        preview: {
          title: "For Owners Protecting Legacy While Building the Next Growth Engine",
          description:
            "Modernize with strategic clarity while protecting core profit pools, ownership priorities, organizational culture, and long-term resilience.",
          highlights: [
            "Stronger and more resilient profit engines",
            "Clearer next-generation growth opportunities",
            "Self-funded modernization roadmap",
          ],
          ctaText: "Explore Family-Owned Enterprises →",
          ctaTo: "/who-we-serve#family-owned-enterprises",
        },
      },
    ],
    bottomCta: {
      text: "AI disruption, profitability pressure, and strategic uncertainty demand more than technology decisions.",
      actionLabel: "View All 4 Strategic Segments",
      to: "/who-we-serve",
    },
  },
};
