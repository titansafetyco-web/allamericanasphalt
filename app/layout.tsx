import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { company } from "@/content/company";
import "./globals.css";

const heading = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `Paving Contractor in West Palm Beach, FL | ${company.shortName}`,
    template: `%s | ${company.shortName}`,
  },
  description:
    "Licensed, bonded, and insured asphalt paving, seal coating, striping, speed bumps, and bollards across Broward, Palm Beach, and Martin Counties. From start to finish.",
  metadataBase: new URL("https://allamericanasphaltpaving.com"),
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
