import type { Metadata } from "next";
import { AuthForm } from "@/components/site/AuthForm";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <section className="bg-navy-deep px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-foreground shadow-2xl md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-flag">Customer access</p>
        <h1 className="mt-2 font-heading text-3xl text-navy">Create an account</h1>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
          Sign up to track paving estimates and job updates across Broward, Palm Beach, and Martin Counties.
        </p>
        <AuthForm mode="signup" />
      </div>
    </section>
  );
}
