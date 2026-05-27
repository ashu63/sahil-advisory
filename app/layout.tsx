import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahil Advisory | Cost Accountants — Tax, Audit & Business Consultancy",
  description:
    "Sahil Advisory delivers smart solutions in Tax, Audit, Accounting and Business Consultancy. Govt Tender & GeM Expertise. MSME & Startup Advisory Support. Based in Chandigarh & Panchkula.",
  keywords: [
    "Cost Accountant",
    "Tax Consultant Chandigarh",
    "GST Filing",
    "Income Tax Return",
    "Business Consultancy",
    "MSME Advisory",
    "Startup Advisory",
    "Audit Services",
    "Company Registration",
    "GeM Registration",
    "Panchkula",
    "Chandigarh",
  ],
  openGraph: {
    title: "Sahil Advisory | Cost Accountants",
    description:
      "Accurate advice. Practical strategies. Trusted support. Expert Tax, Audit & Business Consultancy in Chandigarh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
