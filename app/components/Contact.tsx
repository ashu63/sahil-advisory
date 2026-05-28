import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent-dark">
            Get In Touch
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
            Let&apos;s Simplify Your{" "}
            <span className="text-primary">Compliance</span>
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            Have a question or need help with a filing? Reach out to us through
            any of these channels and we&apos;ll get back to you promptly.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            href="https://wa.me/917888412302?text=Hi%2C%20I%20need%20help%20with%20my%20business%20compliance."
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center text-center rounded-xl bg-green-50 p-7 border border-green-100 hover:border-green-300 transition-colors"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-500 text-white group-hover:scale-110 transition-transform">
              <MessageCircle className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">
              WhatsApp
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Quick response on WhatsApp
            </p>
            <span className="mt-3 text-sm font-semibold text-green-600">
              Chat Now
            </span>
          </a>

          <a
            href="tel:+917888412302"
            className="group flex flex-col items-center text-center rounded-xl bg-surface p-7 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white group-hover:scale-110 transition-transform">
              <Phone className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Call Us
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Speak directly with an expert
            </p>
            <span className="mt-3 text-sm font-semibold text-primary">
              078884 12302
            </span>
          </a>

          <a
            href="mailto:sahiladvisory1@gmail.com"
            className="group flex flex-col items-center text-center rounded-xl bg-surface p-7 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white group-hover:scale-110 transition-transform">
              <Mail className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Email Us
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Detailed queries via email
            </p>
            <span className="mt-3 text-sm font-semibold text-primary">
              sahiladvisory1@gmail.com
            </span>
          </a>

          <div className="flex flex-col items-center text-center rounded-xl bg-surface p-7 border border-border">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Visit Us
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Sector 12, Panchkula & Sector 63, Chandigarh
            </p>
            <span className="mt-3 text-sm font-semibold text-primary flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Mon–Sat, 10 AM – 7 PM
            </span>
          </div>
        </div>

        <div className="mt-14 rounded-2xl bg-gradient-to-r from-primary-dark via-primary to-primary-light p-6 sm:p-8 md:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to get your business compliance sorted?
          </h3>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Book a free consultation today. No obligations, no hidden charges —
            just honest expert advice to help your business thrive.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/917888412302?text=Hi%2C%20I%20would%20like%20to%20book%20a%20free%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-sm font-bold text-primary-dark hover:bg-accent-light transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
            <a
              href="tel:+917888412302"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
