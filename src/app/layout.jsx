import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
  title: "Crafted for Excellence",
  description: "The premier gathering of innovators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* We inject both font variables here, and set the default text to the body font */}
      <body className={`${outfit.variable} ${jakarta.variable} bg-[#09090B] text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}