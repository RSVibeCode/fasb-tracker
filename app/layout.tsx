import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FASB Standards Tracker — SerpApi",
  description: "GAAP compliance tracker for SerpApi LLC — private SaaS, first accrual year FY2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
