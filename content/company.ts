export const company = {
  name: "All American Asphalt, LLC",
  shortName: "All American Asphalt",
  tagline: "From Start to Finish",
  owner: "George Stevens",
  established: "2004",
  experienceYears: 30,
  email: "allamericanasph@aol.com",
  address: {
    line1: "1645 Palm Beach Lakes Blvd",
    line2: "Suite 1200",
    city: "West Palm Beach",
    state: "FL",
    zip: "33401",
  },
  phones: {
    westPalmBeach: { label: "West Palm Beach", display: "(561) 684-9183", href: "tel:+15616849183" },
    stuart: { label: "Stuart", display: "(561) 684-9183", href: "tel:+15616849183" },
    fortLauderdale: { label: "Fort Lauderdale", display: "(954) 601-5730", href: "tel:+19546015730" },
    fax: { label: "Fax", display: "(561) 684-9536", href: "tel:+15616849536" },
  },
  licenses: [
    { county: "Broward", number: "083B1502r" },
    { county: "Palm Beach", number: "U20333" },
    { county: "Martin", number: "CP5232" },
  ],
  hours: [
    { day: "Monday", time: "9 AM – 6 PM" },
    { day: "Tuesday", time: "9 AM – 6 PM" },
    { day: "Wednesday", time: "9 AM – 6 PM" },
    { day: "Thursday", time: "9 AM – 6 PM" },
    { day: "Friday", time: "9 AM – 6 PM" },
    { day: "Saturday", time: "9 AM – 6 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  serviceCounties: ["Broward", "Palm Beach", "Martin", "Dade"],
  sameDayCities: ["West Palm Beach", "Fort Lauderdale", "Plantation", "Davie"],
  payments: ["Visa", "Mastercard", "Discover", "American Express"],
} as const;

export const addressLine = `${company.address.line1} ${company.address.line2}, ${company.address.city}, ${company.address.state} ${company.address.zip}`;

export const trustPoints = [
  "Licensed, bonded, and insured",
  "A+ BBB rating",
  "Chamber of Commerce member",
  "Same-day service on qualifying jobs",
  "No job too big or too small",
  "Satisfaction guaranteed",
] as const;
