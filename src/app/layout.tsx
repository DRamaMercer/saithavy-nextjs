import type { Metadata } from "next";
import { Poppins, Roboto, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Viewport } from "next";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins-var",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto-var",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-var",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  metadataBase: new URL("https://saithavy.com"),
  title: {
    default: "Saithavy | Authentic Remote Work & AI Operations",
    template: "%s | Saithavy",
  },
  description:
    "Discover Saithavy's journey of resilience, growth, and empowering others to live authentically through remote work and AI automation.",
  keywords: [
    "Saithavy",
    "growth",
    "transformation",
    "remote work",
    "AI automation",
    "authentic leadership",
    "coaching",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Saithavy",
    title: "Saithavy — Inspiring Growth & Transformation",
    description:
      "Discover Saithavy's journey of resilience, growth, and empowering others to live authentically.",
    images: [{ url: "/images/hero-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saithavy — Inspiring Growth & Transformation",
    description:
      "Discover Saithavy's journey of resilience, growth, and empowering others to live authentically.",
    images: ["/images/hero-image.jpg"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${roboto.variable} ${playfairDisplay.variable} antialiased`}
      >
        {/* Skip link for keyboard navigation - WCAG 2.1 Level A */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-stone-900 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-[#E07A5F]"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Navigation />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
