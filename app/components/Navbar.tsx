"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg">
              SA
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-bold text-primary">
                Sahil Advisory
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-text-muted">
                Cost Accountants
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+917888412302"
              className="flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Phone className="h-4 w-4" />
              078884 12302
            </a>
            <a
              href="https://wa.me/917888412302?text=Hi%2C%20I%20need%20help%20with%20my%20business%20compliance."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
            >
              Get Free Consultation
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 text-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-foreground/70 hover:text-primary py-3"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/917888412302?text=Hi%2C%20I%20need%20help%20with%20my%20business%20compliance."
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light transition-colors mt-3"
            >
              Get Free Consultation
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
