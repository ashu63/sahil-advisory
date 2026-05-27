import {
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const highlights = [
  "Tax & GST Filing",
  "Company Registration",
  "Audit & Assurance",
  "MSME & Startup Advisory",
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light pt-28 pb-20 lg:pt-36 lg:pb-28"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm text-white/90 backdrop-blur-sm mb-6">
              <ShieldCheck className="h-4 w-4 text-accent" />
              Trusted Cost Accountants in Chandigarh
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Compliance Today,{" "}
              <span className="text-accent">Secure Tomorrow.</span>
            </h1>

            <p className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed">
              Sahil Advisory delivers smart solutions in Tax, Audit, Accounting
              and Business Consultancy. Accurate advice. Practical strategies.
              Trusted support.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://wa.me/917888412302?text=Hi%2C%20I%20need%20help%20with%20my%20business%20compliance."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-bold text-primary-dark hover:bg-accent-light transition-colors"
              >
                Book Free Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Explore Services
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
                <ShieldCheck className="h-10 w-10 text-accent mb-3" />
                <h3 className="text-lg font-bold text-white">Build Trust</h3>
                <p className="text-sm text-white/70 mt-1">
                  Stay compliant with all regulatory requirements
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
                <Award className="h-10 w-10 text-accent mb-3" />
                <h3 className="text-lg font-bold text-white">
                  Protect Reputation
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Avoid penalties, fines and legal action
                </p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
                <TrendingUp className="h-10 w-10 text-accent mb-3" />
                <h3 className="text-lg font-bold text-white">Reduce Risks</h3>
                <p className="text-sm text-white/70 mt-1">
                  Minimize business risks with expert guidance
                </p>
              </div>
              <div className="rounded-2xl bg-accent/20 backdrop-blur-sm p-6 border border-accent/30">
                <div className="text-3xl font-bold text-white">5.0</div>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-accent fill-accent" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-white/80 mt-1">Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
