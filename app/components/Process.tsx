import { MessageSquare, Search, FileCheck, Handshake } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Get in Touch",
    desc: "Reach out via WhatsApp, phone, or email. Tell us about your business and what you need help with.",
  },
  {
    icon: Search,
    step: "02",
    title: "We Analyze",
    desc: "Our experts review your requirements, current compliance status, and identify the best path forward.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "We Execute",
    desc: "We handle all filings, registrations, and documentation with complete accuracy and on time.",
  },
  {
    icon: Handshake,
    step: "04",
    title: "Ongoing Support",
    desc: "Stay worry-free with continuous compliance tracking, deadline reminders, and strategic advisory.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-dark">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            Simple Process,{" "}
            <span className="text-primary">Expert Results</span>
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            We make compliance effortless. Here&apos;s how we work with you
            from the very first conversation to ongoing support.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
              )}
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5">
                <s.icon className="h-8 w-8 text-primary" />
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary-dark">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
