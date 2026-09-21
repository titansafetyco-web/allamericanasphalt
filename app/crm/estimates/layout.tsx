import type { Metadata } from "next";

export const metadata: Metadata = { title: "Estimates" };

export default function EstimatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
