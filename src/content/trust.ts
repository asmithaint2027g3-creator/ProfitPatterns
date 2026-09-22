/**
 * Trust content. Everything here is editable and intentionally empty where
 * verified evidence does not yet exist. Never populate these arrays with
 * invented testimonials, client names, logos or credentials.
 */

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ClientLogo {
  name: string;
  /** Path to an approved logo asset. */
  src: string;
}

export interface Credential {
  label: string;
  issuer: string;
  year?: string;
}

export interface TechnologyPartner {
  name: string;
  note: string;
}

/** Add only testimonials the client has approved in writing. */
export const testimonials: Testimonial[] = [];

/** Add only logos you have permission to display. */
export const clientLogos: ClientLogo[] = [];

/** Add only credentials that can be verified. */
export const certifications: Credential[] = [];

/** Add only partnerships that formally exist. */
export const technologyPartners: TechnologyPartner[] = [];

/** Why ProfitPatterns — five core pillars */
export const workingPrinciples = [
  {
    title: "Business First",
    body: "We begin with business objectives and challenges before recommending any technology.",
  },
  {
    title: "AI With Purpose",
    body: "AI initiatives should have a clear reason, defined use case and measurable objective.",
  },
  {
    title: "Data Driven",
    body: "Better decisions begin with reliable information and meaningful analysis.",
  },
  {
    title: "Practical Execution",
    body: "Strategies are valuable when they can be translated into practical action.",
  },
  {
    title: "Continuous Improvement",
    body: "Business improvement is an ongoing process of measuring, learning and optimizing.",
  },
];

/** Who we help — six business types */
export const whoWeHelp = [
  {
    title: "Startups",
    body: "Building smarter foundations for growth without creating unnecessary operational complexity.",
  },
  {
    title: "Small & Medium Businesses",
    body: "Practical technology strategies aligned with available resources and real business priorities.",
  },
  {
    title: "Professional Services",
    body: "Making knowledge-driven work more efficient through workflow automation and better data.",
  },
  {
    title: "Retail & E-Commerce",
    body: "Turning operations and customer data into better decisions and more efficient workflows.",
  },
  {
    title: "Operations-Driven Businesses",
    body: "Finding the bottlenecks holding operations back and building processes that scale.",
  },
  {
    title: "Growing Organizations",
    body: "Building the systems, digital strategy and automation that can grow with the business.",
  },
];
