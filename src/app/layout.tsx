import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IntelligentSPM - The Clearing House for Sales Performance Management",
    template: "%s | IntelligentSPM",
  },
  description: "No vendor agenda. No consultant spin. 30 years of sales compensation expertise from The Toddfather.",
  keywords: [
    "SPM",
    "Sales Performance Management",
    "sales compensation",
    "incentive compensation",
    "ICM",
    "quota management",
    "territory planning",
    "commission",
    "clawback",
    "governance",
  ],
  authors: [{ name: "The Toddfather", url: "https://www.linkedin.com/in/thetoddfather" }],
  creator: "IntelligentSPM",
  publisher: "IntelligentSPM",
  metadataBase: new URL("https://intelligentspm.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intelligentspm.com",
    siteName: "IntelligentSPM",
    title: "IntelligentSPM - The Clearing House for Sales Performance Management",
    description: "No vendor agenda. No consultant spin. 30 years of sales compensation expertise from The Toddfather.",
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelligentSPM",
    description: "No vendor agenda. No consultant spin. 30 years of sales compensation expertise.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
