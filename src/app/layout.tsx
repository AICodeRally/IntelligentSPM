import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntelligentSPM - The Clearing House for Sales Performance Management",
  description: "No vendor agenda. No consultant spin. 30 years of sales compensation expertise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
