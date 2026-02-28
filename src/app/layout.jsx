import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

// 1. Configure the Geometric Heading Font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// 2. Configure the Clean Body Font
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Crafted for Excellence 2026 | Absolute Mastery",
  description: "Join industry leaders and visionaries for an exclusive day of innovation, design, and elite networking. Secure your physical or virtual pass today.",
  // IMPORTANT: Replace this URL with your actual deployed Vercel link!
  metadataBase: new URL("https://crafted-events.vercel.app/"), 
  openGraph: {
    title: "Crafted for Excellence 2026",
    description: "Where craft meets absolute mastery. Claim your exclusive pass today.",
    url: "/",
    siteName: "Crafted Excellence",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crafted for Excellence 2026",
    description: "Where craft meets absolute mastery. Claim your exclusive pass today.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* We inject both font variables here, and set the default text to the body font */}
      <body className={`${outfit.variable} ${jakarta.variable} bg-[#09090B] text-slate-50 antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}