import {
  Target,
  Users,
  Clock,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react";

const stats = [
  { value: "5.0", label: "Google Rating", icon: Award },
  { value: "100+", label: "Clients Served", icon: Users },
  { value: "500+", label: "Returns Filed", icon: TrendingUp },
  { value: "24hrs", label: "Response Time", icon: Clock },
];

const reasons = [
  {
    icon: Shield,
    title: "CMA Expertise",
    desc: "Led by qualified Cost & Management Accountants with deep knowledge of Indian tax and compliance landscape.",
  },
  {
    icon: Target,
    title: "Personalized Approach",
    desc: "Every business is different. We tailor our solutions to your specific needs, size, and industry requirements.",
  },
  {
    icon: Clock,
    title: "Timely Compliance",
    desc: "Never miss a deadline. We proactively track due dates and ensure all filings happen well before time.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Focused Advisory",
    desc: "Beyond compliance, we help you structure your business for tax efficiency, funding readiness, and scalable growth.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-accent-dark">
              Why Choose Us
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Advise. Analyze.{" "}
              <span className="text-primary">Achieve.</span>
            </h2>
            <p className="mt-6 text-text-muted leading-relaxed">
              Sahil Advisory is a trusted business consultancy firm based in
              Chandigarh and Panchkula. We specialize in helping small
              businesses, startups, and MSMEs navigate the complex world of
              taxation, regulatory compliance, and business growth.
            </p>
            <p className="mt-4 text-text-muted leading-relaxed">
              Our mission is simple — to make compliance easy and affordable,
              so you can focus on what matters most: growing your business.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-white border border-border">
                  <stat.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {reasons.map((reason, i) => (
              <div
                key={reason.title}
                className="flex gap-4 rounded-xl bg-white p-5 border border-border"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <reason.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted leading-relaxed">
                    {reason.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
