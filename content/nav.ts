export const primaryNav = [
  { href: "/", label: "Home" },
  {
    href: "/asphalt-services",
    label: "Services",
    children: [
      { href: "/asphalt-services", label: "Asphalt Paving" },
      { href: "/seal-coating-services", label: "Seal Coating" },
      { href: "/speed-bump-installation", label: "Speed Bumps & Bollards" },
    ],
  },
  { href: "/gallery", label: "Gallery" },
  { href: "/service-areas", label: "Areas" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blog", label: "Blog" },
] as const;

export const footerNav = [
  { href: "/asphalt-services", label: "Asphalt Services" },
  { href: "/seal-coating-services", label: "Seal Coating" },
  { href: "/speed-bump-installation", label: "Speed Bumps & Bollards" },
  { href: "/gallery", label: "Gallery" },
  { href: "/referrals", label: "Referrals" },
  { href: "/frequently-asked-questions-faqs", label: "FAQs" },
  { href: "/reviews", label: "Reviews" },
  { href: "/feedback", label: "Feedback" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/sitemap", label: "Sitemap" },
] as const;
