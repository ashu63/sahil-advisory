import {
  FileText,
  Building2,
  Calculator,
  ClipboardCheck,
  Globe,
  Receipt,
  Scale,
  Landmark,
  Briefcase,
  Rocket,
  ShieldCheck,
  BookOpen,
  FileSearch,
  Users,
  Warehouse,
  BadgeIndianRupee,
} from "lucide-react";

const serviceCategories = [
  {
    title: "Tax Services",
    services: [
      {
        icon: Receipt,
        name: "Income Tax Return Filing",
        desc: "ITR filing for individuals, businesses, HUF & NRI. Tax planning and minimization strategies.",
      },
      {
        icon: BadgeIndianRupee,
        name: "GST Registration & Filing",
        desc: "GST registration, monthly/quarterly return filing, composition scheme, E-Way bills & reconciliation.",
      },
      {
        icon: FileText,
        name: "TDS/TCS Compliance",
        desc: "TDS return filing, TCS compliance, challan payments, and certificate generation under Income Tax Act.",
      },
      {
        icon: Scale,
        name: "Tax Advisory & Planning",
        desc: "Strategic tax planning to minimize liability. Capital gains advisory, advance tax computation & compliance.",
      },
    ],
  },
  {
    title: "Business Registration",
    services: [
      {
        icon: Building2,
        name: "Company Registration",
        desc: "Private Limited, OPC, LLP, and Partnership firm registration. Complete incorporation support.",
      },
      {
        icon: Rocket,
        name: "Startup & MSME Registration",
        desc: "MSME/Udyam registration, Startup India recognition, DPIIT registration & seed fund advisory.",
      },
      {
        icon: Globe,
        name: "Import-Export Code (IEC)",
        desc: "IEC registration, modification, renewal & duplicate certificate for international trade.",
      },
      {
        icon: Briefcase,
        name: "Trade License & Registration",
        desc: "Shop & establishment license, professional tax registration, trade mark filing.",
      },
    ],
  },
  {
    title: "Audit & Assurance",
    services: [
      {
        icon: ClipboardCheck,
        name: "Statutory & Tax Audit",
        desc: "Statutory audit under Companies Act, tax audit under Income Tax Act, and cost audit services.",
      },
      {
        icon: FileSearch,
        name: "Internal Audit",
        desc: "Comprehensive internal audit to ensure operational efficiency and regulatory compliance.",
      },
      {
        icon: ShieldCheck,
        name: "Compliance Audit",
        desc: "Review of regulatory compliance across GST, income tax, labour laws & corporate governance.",
      },
      {
        icon: BookOpen,
        name: "Due Diligence",
        desc: "Financial and legal due diligence for mergers, acquisitions, and business transactions.",
      },
    ],
  },
  {
    title: "Accounting & Compliance",
    services: [
      {
        icon: Calculator,
        name: "Bookkeeping & Accounting",
        desc: "Financial statements, invoice processing, bank reconciliation & e-accounting services.",
      },
      {
        icon: Landmark,
        name: "ROC Compliance",
        desc: "Annual filings, board resolutions, statutory registers & all ROC-related compliance.",
      },
      {
        icon: Warehouse,
        name: "Govt Tender & GeM",
        desc: "GeM portal registration, government tender bidding support & documentation assistance.",
      },
      {
        icon: Users,
        name: "Payroll & Labour Compliance",
        desc: "Payroll processing, PF/ESI registration & filing, professional tax & labour law compliance.",
      },
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-dark">
            Our Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            Comprehensive Financial &{" "}
            <span className="text-primary">Business Solutions</span>
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            From tax filing to company registration, we provide end-to-end
            consultancy services to help your business stay compliant and grow.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {serviceCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <div className="h-1 w-8 rounded-full bg-accent" />
                {category.title}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {category.services.map((service) => (
                  <div
                    key={service.name}
                    className="group rounded-xl border border-border bg-white p-4 sm:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h4 className="mt-4 text-base font-bold text-foreground">
                      {service.name}
                    </h4>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-text-muted mb-4">
            Need a service not listed here? We can help with that too.
          </p>
          <a
            href="https://wa.me/917888412302?text=Hi%2C%20I%20need%20help%20with%20a%20specific%20service."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
          >
            Discuss Your Requirements
          </a>
        </div>
      </div>
    </section>
  );
}
