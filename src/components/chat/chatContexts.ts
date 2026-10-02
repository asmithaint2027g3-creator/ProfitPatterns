export interface ChatOption {
  label: string;
  value: string;
  isPrimary?: boolean;
  link?: string;
}

export interface PageChatContext {
  key: string;
  pageName: string;
  badge: string;
  inputPlaceholder: string;
  nudgeTitle: string;
  nudgeText: string;
  getInitialMessage: (greeting: string, isRepeat: boolean, visitCount?: number) => string;
  initialOptions: ChatOption[];
  getAnswer: (
    query: string,
    rawInput: string,
  ) => { replyText: string; nextOptions?: ChatOption[] } | null;
}

function getVisitPrefix(greeting: string, isRepeat: boolean, visitCount: number = 1): string {
  if (!isRepeat || visitCount <= 1) {
    return `${greeting}!`;
  }
  if (visitCount === 2) {
    return `${greeting}! Welcome back 👋 (2nd visit)`;
  }
  if (visitCount === 3) {
    return `${greeting}! Welcome back for your 3rd visit 🔥`;
  }
  if (visitCount === 4) {
    return `${greeting}! Welcome back (4th visit) ⚡`;
  }
  return `${greeting}! Welcome back (Visit #${visitCount}) 👑`;
}

export function getPageChatContext(pathname: string): PageChatContext {
  const cleanPath = pathname.toLowerCase().split("?")[0].split("#")[0];

  // 1. ICP (Ideal Customer Profile)
  if (cleanPath.startsWith("/icp")) {
    return {
      key: "icp",
      pageName: "Ideal Customer Profile (ICP)",
      badge: "🎯 ICP FIT QUALIFICATION",
      inputPlaceholder: "Ask about fit, agency criteria, or qualification...",
      nudgeTitle: "Wondering if you qualify?",
      nudgeText: "Check if your firm matches our AI profit architecture criteria.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return isRepeat
          ? `${prefix}\n\nReady to verify if your agency or B2B consultancy qualifies for our custom profit engineering and AI architecture systems?`
          : `${prefix} Welcome to our Ideal Customer Profile (ICP) framework.\n\nI'm ProfitAI. I can evaluate whether your firm is the right strategic fit to eliminate operational drag and unlock predictable gross margins. What type of business do you run?`;
      },
      initialOptions: [
        { label: "Check My Firm's Fit", value: "icp_fit_check", isPrimary: true },
        { label: "Agency & Consultancy Fit", value: "icp_agency" },
        { label: "Revenue & Size Criteria", value: "icp_criteria" },
        { label: "Request Fit Assessment →", value: "request_callback" },
      ],
      getAnswer: (query) => {
        if (
          query === "icp_fit_check" ||
          query.includes("fit") ||
          query.includes("qualify") ||
          query.includes("am i a fit") ||
          query.includes("who is this for")
        ) {
          return {
            replyText:
              "ProfitPatterns is engineered specifically for established B2B service businesses, agencies, and consultancies doing **$1M to $20M ARR** with **10 to 100+ team members**.\n\n" +
              "Our ideal partners typically face 3 challenges:\n" +
              "1. **Margin Compression**: Scaling client headcount faster than net profitability.\n" +
              "2. **Operational Drag**: Founders and senior partners trapped inside delivery and manual oversight.\n" +
              "3. **Siloed Toolchains**: Disjointed processes causing scope creep and delayed handoffs.\n\n" +
              "Does this match what your firm is currently experiencing?",
            nextOptions: [
              { label: "Yes, this matches our firm →", value: "request_callback", isPrimary: true },
              { label: "Revenue & Size Criteria", value: "icp_criteria" },
              { label: "Submit Free Audit Form", value: "audit_page", link: "/audit-submission" },
            ],
          };
        }

        if (
          query === "icp_agency" ||
          query.includes("agency") ||
          query.includes("consultanc") ||
          query.includes("service firm")
        ) {
          return {
            replyText:
              "For digital agencies and consultancies, we replace disjointed manual workflows with autonomous agent pipelines.\n\n" +
              "• **Capacity**: Reclaim 40+ hours/week per pod from proposals, reporting, and data extraction.\n" +
              "• **Delivery Speed**: Accelerate client onboarding and turnaround by 60%.\n" +
              "• **Margin Health**: Stabilize gross profit margins above 45%.\n\n" +
              "Would you like to review relevant case studies or schedule a 15-minute fit briefing?",
            nextOptions: [
              { label: "Review Case Studies", value: "cs_page", link: "/case-studies" },
              { label: "Request a Callback →", value: "request_callback", isPrimary: true },
              { label: "Check Criteria", value: "icp_criteria" },
            ],
          };
        }

        if (
          query === "icp_criteria" ||
          query.includes("criteria") ||
          query.includes("threshold") ||
          query.includes("requirements")
        ) {
          return {
            replyText:
              "**ProfitPatterns Qualification Criteria:**\n\n" +
              "• **Business Model**: B2B Services, Digital Agencies, Consultancies, Professional Firms\n" +
              "• **Annual Revenue**: $1M – $20M ARR\n" +
              "• **Team Size**: 10 – 100+ employees / contractors\n" +
              "• **Leadership Commitment**: Ready to execute a 14-day diagnostic and implement AI systems.\n\n" +
              "Firms meeting these criteria typically uncover **$150k – $600k in annual profit leaks**.",
            nextOptions: [
              { label: "Schedule 15-Min Fit Call →", value: "calendar", link: "/contact", isPrimary: true },
              { label: "Request a Callback", value: "request_callback" },
              { label: "Free 14-Day Audit", value: "audit_page", link: "/audit-submission" },
            ],
          };
        }

        return null;
      },
    };
  }

  // 2. SOLUTIONS (/solutions and /solutions/:slug)
  if (cleanPath.startsWith("/solutions")) {
    return {
      key: "solutions",
      pageName: "Solutions Architecture",
      badge: "⚡ SOLUTIONS ARCHITECTURE",
      inputPlaceholder: "Ask about AI systems, margin leak recovery, automation...",
      nudgeTitle: "Exploring AI Solutions?",
      nudgeText: "Find out how our custom AI systems eliminate operational leaks.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return isRepeat
          ? `${prefix}\n\nReady to engineer a custom AI profit system for your operations? Which system are you exploring today?`
          : `${prefix} Exploring ProfitPatterns Solutions?\n\nI'm ProfitAI. We architect proprietary AI systems that eliminate margin leaks, automate heavy operations, and provide predictive intelligence. Which solution area can I assist you with?`;
      },
      initialOptions: [
        { label: "Stop Margin Leaks", value: "sol_leaks", isPrimary: true },
        { label: "AI Agent Automation", value: "sol_automation" },
        { label: "Predictive Profit Engine", value: "sol_predictive" },
        { label: "Free Solution Audit →", value: "audit_page", link: "/audit-submission" },
      ],
      getAnswer: (query) => {
        if (query === "sol_leaks" || query.includes("leak") || query.includes("margin") || query.includes("erosion")) {
          return {
            replyText:
              "Our **Margin Leak Architecture** uncovers and stops silent profit loss across:\n\n" +
              "1. **Scope Creep & Unbilled Deliverables** (automated task-to-contract tracking)\n" +
              "2. **Capacity Slippage** (real-time resource & utilization analytics)\n" +
              "3. **Client Churn Predictors** (early health flags 60 days before contract renewal)\n\n" +
              "On average, our 14-day diagnostic uncovers **$240,000+ in annual recoverable margin**.",
            nextOptions: [
              { label: "Run Free 14-Day Diagnostic →", value: "audit_page", link: "/audit-submission", isPrimary: true },
              { label: "Request a Callback", value: "request_callback" },
              { label: "AI Automation Architecture", value: "sol_automation" },
            ],
          };
        }

        if (query === "sol_automation" || query.includes("automation") || query.includes("agent") || query.includes("workflow")) {
          return {
            replyText:
              "Our **Autonomous Agent Workflows** deploy multi-agent systems to execute complex end-to-end tasks:\n\n" +
              "• **Lead Qualification & Enrichment**: Instant 24/7 ICP scoring and routing\n" +
              "• **Proposal & Scope Generation**: Auto-assembled briefs in under 5 minutes\n" +
              "• **Client Reporting & Onboarding**: Zero manual data entry for account managers\n\n" +
              "This reduces delivery cycle times by up to **70%** and frees up 40+ hours per team pod.",
            nextOptions: [
              { label: "Request Custom Scope →", value: "request_callback", isPrimary: true },
              { label: "Predictive Profit Engine", value: "sol_predictive" },
              { label: "Book Strategy Call", value: "calendar", link: "/contact" },
            ],
          };
        }

        if (query === "sol_predictive" || query.includes("predictive") || query.includes("model") || query.includes("analytics")) {
          return {
            replyText:
              "Our **Predictive Profit Intelligence Engine** connects directly with your CRM, ERP, and project management tools to give executives forward-looking clarity:\n\n" +
              "• Real-time gross margin forecast per client & account\n" +
              "• Forward capacity utilization modeling (60-day horizon)\n" +
              "• Automated profitability alerts when projects veer off margin targets.",
            nextOptions: [
              { label: "Request Architecture Demo →", value: "request_callback", isPrimary: true },
              { label: "Schedule Call", value: "calendar", link: "/contact" },
            ],
          };
        }

        return null;
      },
    };
  }

  // 3. SERVICES (/services and /services/:slug)
  if (cleanPath.startsWith("/services")) {
    return {
      key: "services",
      pageName: "Strategic Advisory & Services",
      badge: "💼 STRATEGIC ADVISORY",
      inputPlaceholder: "Ask about our 14-day diagnostic, fractional AI, retainers...",
      nudgeTitle: "Looking at our Services?",
      nudgeText: "Learn about our 14-day zero-risk diagnostic and implementation sprints.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return isRepeat
          ? `${prefix}\n\nCan I help clarify our engagement models, 14-day diagnostic sprint, or fractional leadership services?`
          : `${prefix} Viewing our Advisory & Service Offerings?\n\nI'm ProfitAI. I can guide you through our 14-day zero-risk diagnostic sprint, fractional Chief AI Officer engagements, and custom delivery buildouts. How can I assist?`;
      },
      initialOptions: [
        { label: "14-Day Diagnostic Sprint", value: "srv_diagnostic", isPrimary: true },
        { label: "Fractional AI Officer", value: "srv_fractional" },
        { label: "Pricing & Retainers", value: "pricing" },
        { label: "Book Strategy Call →", value: "calendar", link: "/contact" },
      ],
      getAnswer: (query) => {
        if (query === "srv_diagnostic" || query.includes("diagnostic") || query.includes("sprint")) {
          return {
            replyText:
              "The **14-Day AI Diagnostic Sprint** is our flagship zero-risk assessment:\n\n" +
              "1. **Day 1–4**: Workflow mapping, team interviews & toolchain audit\n" +
              "2. **Day 5–9**: Margin leak calculation & AI feasibility scoring\n" +
              "3. **Day 10–14**: Delivery of the Executive ROI Scorecard and step-by-step implementation blueprint.\n\n" +
              "This provides 100% clarity on where your profit leaks are before investing in any buildout.",
            nextOptions: [
              { label: "Submit Free Audit Form →", value: "audit_page", link: "/audit-submission", isPrimary: true },
              { label: "Request a Callback", value: "request_callback" },
              { label: "Fractional AI Officer", value: "srv_fractional" },
            ],
          };
        }

        if (query === "srv_fractional" || query.includes("fractional") || query.includes("leadership")) {
          return {
            replyText:
              "Our **Fractional Chief AI Officer / Profit Architect** service embeds seasoned technical and financial architects into your executive team:\n\n" +
              "• Ongoing AI strategy, vendor selection & architecture governance\n" +
              "• Oversight of automated agent deployments & security protocols\n" +
              "• Monthly margin optimization & board-level ROI reporting.",
            nextOptions: [
              { label: "Request Advisory Brief →", value: "request_callback", isPrimary: true },
              { label: "Schedule 15-Min Briefing", value: "calendar", link: "/contact" },
            ],
          };
        }

        return null;
      },
    };
  }

  // 4. CASE STUDIES (/case-studies and /case-studies/:slug)
  if (cleanPath.startsWith("/case-studies")) {
    return {
      key: "case-studies",
      pageName: "Case Studies & Verified ROI",
      badge: "📈 CASE STUDIES & ROI",
      inputPlaceholder: "Ask about client results, payback periods, metrics...",
      nudgeTitle: "Curious about client ROI?",
      nudgeText: "See how similar firms unlocked $420k+ in recovered margin.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return isRepeat
          ? `${prefix}\n\nWould you like me to highlight ROI metrics and timelines for a specific industry or company size?`
          : `${prefix} Reviewing our verified client case studies?\n\nI'm ProfitAI. I can break down the exact ROI metrics, payback periods, and architectural workflows we implemented for similar B2B firms.`;
      },
      initialOptions: [
        { label: "Agency Margin Case (+$420k)", value: "cs_agency", isPrimary: true },
        { label: "SaaS Ops Case (60% Speedup)", value: "cs_saas" },
        { label: "Professional Services Case", value: "cs_prof" },
        { label: "Request Relevant Case Study", value: "request_callback" },
      ],
      getAnswer: (query) => {
        if (query === "cs_agency" || query.includes("420k") || (query.includes("agency") && query.includes("case"))) {
          return {
            replyText:
              "📊 **Case Study: B2B Growth Agency ($6.5M ARR)**\n\n" +
              "• **Challenge**: Severe margin compression as team grew to 42 people; account directors spent 14+ hrs/wk on manual reporting.\n" +
              "• **Solution**: Implemented ProfitPatterns Autonomous Scoping & Multi-Agent Reporting Pipeline.\n" +
              "• **Results**: **+$420,000 net recovered profit** in 6 months, 38 hours saved per pod/week, gross margin rose from 31% to 48%.",
            nextOptions: [
              { label: "Request Fit Assessment →", value: "request_callback", isPrimary: true },
              { label: "SaaS Ops Case", value: "cs_saas" },
              { label: "Free 14-Day Audit", value: "audit_page", link: "/audit-submission" },
            ],
          };
        }

        if (query === "cs_saas" || query.includes("saas")) {
          return {
            replyText:
              "📊 **Case Study: B2B SaaS Enterprise ($12M ARR)**\n\n" +
              "• **Challenge**: 4-week client onboarding backlog and preventable customer churn.\n" +
              "• **Solution**: Deployed predictive customer health telemetry and AI-assisted onboarding copilot.\n" +
              "• **Results**: Onboarding time reduced by **60%**, client retention increased by **18%**, producing $310,000 in saved revenue.",
            nextOptions: [
              { label: "Schedule Roadmap Call →", value: "calendar", link: "/contact", isPrimary: true },
              { label: "Agency Case Study", value: "cs_agency" },
            ],
          };
        }

        if (query === "cs_prof" || query.includes("professional") || query.includes("consulting case")) {
          return {
            replyText:
              "📊 **Case Study: Strategic Advisory & Consulting Firm ($18M ARR)**\n\n" +
              "• **Challenge**: Senior partners spending 30% of billable time on document synthesis and compliance audits.\n" +
              "• **Solution**: Built secure, on-premise AI document intelligence system.\n" +
              "• **Results**: **$850,000 annual partner billable capacity unlocked**, with zero client data leakage.",
            nextOptions: [
              { label: "Request Similar Case Study →", value: "request_callback", isPrimary: true },
              { label: "Book Discovery Call", value: "calendar", link: "/contact" },
            ],
          };
        }

        return null;
      },
    };
  }

  // 5. AUDIT SUBMISSION (/audit-submission)
  if (cleanPath.startsWith("/audit-submission")) {
    return {
      key: "audit",
      pageName: "14-Day AI Diagnostic",
      badge: "📊 14-DAY AUDIT DESK",
      inputPlaceholder: "Ask about audit scope, timeline, confidentiality, NDA...",
      nudgeTitle: "Need help with the Audit?",
      nudgeText: "I can answer questions or help fast-track your submission.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return isRepeat
          ? `${prefix}\n\nDo you need any help completing the diagnostic form or would you like to speak directly with an auditor?`
          : `${prefix} Need help preparing or submitting your Free 14-Day AI Diagnostic?\n\nI'm ProfitAI. I can clarify assessment questions, verify scope requirements, or fast-track your scorecard review with our lead partner.`;
      },
      initialOptions: [
        { label: "What We Analyze (Scope)", value: "audit_scope", isPrimary: true },
        { label: "Data Security & NDA", value: "security" },
        { label: "Fast-Track Callback", value: "request_callback" },
        { label: "Direct WhatsApp Support", value: "whatsapp" },
      ],
      getAnswer: (query) => {
        if (query === "audit_scope" || query.includes("analyze") || query.includes("scope") || query.includes("what is in")) {
          return {
            replyText:
              "In the **14-Day Complimentary AI Diagnostic**, we analyze:\n\n" +
              "1. **Operational Bottlenecks**: Top 5 repetitive processes eating payroll hours.\n" +
              "2. **Margin Leakage Points**: Scope creep, delayed billing, and under-utilized billable talent.\n" +
              "3. **AI Automation Feasibility**: Exact toolchains and agent workflows suitable for your stack.\n" +
              "4. **Financial ROI Scorecard**: Clear model of projected net profit expansion over 12 months.",
            nextOptions: [
              { label: "Request Callback for Help →", value: "request_callback", isPrimary: true },
              { label: "Data Security & NDA", value: "security" },
            ],
          };
        }

        return null;
      },
    };
  }

  // 6. INDUSTRIES (/industries and /industries/:slug)
  if (cleanPath.startsWith("/industries")) {
    return {
      key: "industries",
      pageName: "Industry Architectures",
      badge: "🏭 INDUSTRY ARCHITECTURE",
      inputPlaceholder: "Ask about your industry vertical, benchmarks, cases...",
      nudgeTitle: "Industry-Specific AI",
      nudgeText: "See tailored AI architectures for your vertical.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return `${prefix} Looking for industry-tailored profit solutions?\n\nI'm ProfitAI. Whether you operate in Agencies, Legal, Financial Services, Tech/SaaS, or Healthcare, I can share relevant benchmarks, leak patterns, and AI systems.`;
      },
      initialOptions: [
        { label: "Agencies & Consultancies", value: "icp_agency", isPrimary: true },
        { label: "Legal & Advisory", value: "ind_legal" },
        { label: "Financial Services", value: "ind_finance" },
        { label: "Request Industry Scope →", value: "request_callback" },
      ],
      getAnswer: (query) => {
        if (query === "ind_legal" || query.includes("legal") || query.includes("law")) {
          return {
            replyText:
              "For **Legal & Advisory Firms**, we deploy secure, local AI document synthesis and contract review pipelines that speed up discovery by 75% while maintaining strict client confidentiality and bar compliance.",
            nextOptions: [
              { label: "Schedule Confidential Briefing →", value: "calendar", link: "/contact", isPrimary: true },
              { label: "Data Security & NDA", value: "security" },
            ],
          };
        }
        if (query === "ind_finance" || query.includes("finance") || query.includes("fintech") || query.includes("wealth")) {
          return {
            replyText:
              "For **Financial & Wealth Management Firms**, we build automated portfolio reporting agents, reconciliation anomaly monitors, and KYC/compliance triage workflows.",
            nextOptions: [
              { label: "Request Financial Brief →", value: "request_callback", isPrimary: true },
              { label: "Free 14-Day Audit", value: "audit_page", link: "/audit-submission" },
            ],
          };
        }
        return null;
      },
    };
  }

  // 7. HOW IT WORKS (/how-it-works)
  if (cleanPath.startsWith("/how-it-works")) {
    return {
      key: "how-it-works",
      pageName: "4-Phase Methodology",
      badge: "🛠️ 4-PHASE METHODOLOGY",
      inputPlaceholder: "Ask about the 4 phases, roadmap, timelines...",
      nudgeTitle: "How Our Process Works",
      nudgeText: "Explore our 4-phase roadmap from audit to full automation.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return `${prefix} Exploring our 4-phase rollout methodology?\n\nI'm ProfitAI. I can explain how we go from initial 14-day audit (Phase 1) to Profit Architecture (Phase 2), Agent Automation (Phase 3), and Ongoing Acceleration (Phase 4).`;
      },
      initialOptions: [
        { label: "Phase 1: 14-Day Diagnostic", value: "srv_diagnostic", isPrimary: true },
        { label: "Phase 2: Profit Architecture", value: "how_p2" },
        { label: "Phase 3: Agent Deployment", value: "sol_automation" },
        { label: "Book Strategic Briefing →", value: "calendar", link: "/contact" },
      ],
      getAnswer: (query) => {
        if (query === "how_p2" || query.includes("phase 2") || query.includes("architecture phase")) {
          return {
            replyText:
              "**Phase 2: Profit Architecture (Days 15–30)**\n\n" +
              "We design the technical blueprints for your custom AI agents, establish API connectors, map data security boundaries, and set measurable KPI baselines for margin recovery.",
            nextOptions: [
              { label: "Phase 3: Agent Deployment", value: "sol_automation" },
              { label: "Schedule Roadmap Call →", value: "calendar", link: "/contact", isPrimary: true },
            ],
          };
        }
        return null;
      },
    };
  }

  // 8. CONTACT (/contact)
  if (cleanPath.startsWith("/contact")) {
    return {
      key: "contact",
      pageName: "Advisory Contact Desk",
      badge: "📞 ADVISORY CONTACT DESK",
      inputPlaceholder: "Ask for an instant callback, calendar booking, WhatsApp...",
      nudgeTitle: "Ready to connect?",
      nudgeText: "I can arrange an immediate callback with our senior team.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return `${prefix} Ready to connect directly with ProfitPatterns leadership?\n\nI'm ProfitAI. I can arrange an immediate callback, book a 15-minute executive briefing, or open direct messaging on WhatsApp.`;
      },
      initialOptions: [
        { label: "Schedule 15-Min Briefing →", value: "calendar", link: "/contact", isPrimary: true },
        { label: "Request Instant Callback", value: "request_callback" },
        { label: "Chat on WhatsApp", value: "whatsapp" },
        { label: "Direct Email Desk", value: "email_desk" },
      ],
      getAnswer: (query) => {
        if (query === "email_desk" || query.includes("email") || query.includes("mail")) {
          return {
            replyText:
              "You can reach our senior consulting desk directly at **asmitha.int2027g3@gmail.com**.\n\nAlternatively, share your phone number or email right here in chat and I'll log a priority ticket for you immediately!",
            nextOptions: [
              { label: "Request a Callback →", value: "request_callback", isPrimary: true },
              { label: "Chat on WhatsApp", value: "whatsapp" },
            ],
          };
        }
        return null;
      },
    };
  }

  // 9. INSIGHTS / RESOURCES (/insights, /resources)
  if (cleanPath.startsWith("/insights") || cleanPath.startsWith("/resources")) {
    return {
      key: "insights",
      pageName: "Executive Playbooks & Insights",
      badge: "📚 RESEARCH & PLAYBOOKS",
      inputPlaceholder: "Ask about AI frameworks, margin scorecards, playbooks...",
      nudgeTitle: "Looking for Insights?",
      nudgeText: "Get executive playbooks on margin optimization and AI architecture.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return `${prefix} Browsing our profit engineering playbooks and insights?\n\nI'm ProfitAI. Tell me what operational challenge or AI topic you're researching, and I'll pull the best framework for you.`;
      },
      initialOptions: [
        { label: "AI Profit Playbook 2026", value: "res_playbook", isPrimary: true },
        { label: "Margin Leak Checklist", value: "sol_leaks" },
        { label: "Check ICP Fit", value: "icp_fit_check", link: "/icp" },
        { label: "Request Free Audit →", value: "audit_page", link: "/audit-submission" },
      ],
      getAnswer: (query) => {
        if (query === "res_playbook" || query.includes("playbook") || query.includes("guide")) {
          return {
            replyText:
              "📖 **The 2026 AI Profit Playbook for B2B Services** covers:\n\n" +
              "• 5 high-impact AI agents delivering 10x ROI in 30 days\n" +
              "• Eliminating founder delivery bottlenecks\n" +
              "• Protecting client gross margins through automated scoping.\n\n" +
              "Would you like us to email you the full executive brief?",
            nextOptions: [
              { label: "Request Full Playbook →", value: "request_callback", isPrimary: true },
              { label: "Free 14-Day Audit", value: "audit_page", link: "/audit-submission" },
            ],
          };
        }
        return null;
      },
    };
  }

  // 10. WHO WE SERVE (/who-we-serve)
  if (cleanPath.startsWith("/who-we-serve")) {
    return {
      key: "who-we-serve",
      pageName: "Who We Serve",
      badge: "👥 CLIENT PROFILES",
      inputPlaceholder: "Ask who we work with, firm types, qualifications...",
      nudgeTitle: "Is this built for you?",
      nudgeText: "See how we support agency founders, CEOs, and service leaders.",
      getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
        const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
        return `${prefix} Wondering if ProfitPatterns fits your organization?\n\nI'm ProfitAI. We work with growth-stage B2B agencies, consultancies, and tech-enabled service firms. Tell me about your team!`;
      },
      initialOptions: [
        { label: "Check My Firm's Fit", value: "icp_fit_check", isPrimary: true },
        { label: "Agency & Consulting Fit", value: "icp_agency" },
        { label: "Our Core Services", value: "services", link: "/services" },
        { label: "Request Fit Assessment →", value: "request_callback" },
      ],
      getAnswer: () => null,
    };
  }

  // DEFAULT (Home / About / General)
  return {
    key: "general",
    pageName: "ProfitPatterns Strategy Desk",
    badge: "✨ AI & PROFIT STRATEGIST",
    inputPlaceholder: "Ask ProfitAI or explore profit solutions...",
    nudgeTitle: "Still with us?",
    nudgeText: "Can I help you find what you're looking for?",
    getInitialMessage: (greeting, isRepeat, visitCount = 1) => {
      const prefix = getVisitPrefix(greeting, isRepeat, visitCount);
      return isRepeat
        ? `${prefix}\n\nGreat to see you again! What sort of profit optimization or AI strategy requirements are you exploring today?`
        : `${prefix} Welcome to ProfitPatterns.\n\nI'm ProfitAI, your AI & profit strategist. What sort of profit optimization or AI strategy requirements are you exploring today?`;
    },
    initialOptions: [
      { label: "Request a Callback →", value: "request_callback", isPrimary: true },
      { label: "Check ICP Fit", value: "icp_fit_check", link: "/icp" },
      { label: "Our Services", value: "services", link: "/services" },
      { label: "Free 14-Day AI Audit", value: "audit_page", link: "/audit-submission" },
    ],
    getAnswer: () => null,
  };
}
