import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Small Business Owner",
    text: "Sahil Advisory has been instrumental in keeping my business compliant. Their GST filing is always on time and they explain everything in simple terms. Highly recommended!",
  },
  {
    name: "Priya Mehta",
    role: "Startup Founder",
    text: "From company registration to MSME certification, they handled everything smoothly. Their knowledge of government schemes saved us a lot of money. Excellent service!",
  },
  {
    name: "Amit Verma",
    role: "Freelance Consultant",
    text: "I was worried about my tax planning but Sahil Advisory made it stress-free. They helped me save significantly on taxes with proper planning. Very professional team.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-dark">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            We take pride in building lasting relationships with our clients
            through trust, transparency, and results.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl bg-white p-7 border border-border"
            >
              <Quote className="h-8 w-8 text-accent/40" />
              <p className="mt-4 text-sm text-text-muted leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-text-muted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
