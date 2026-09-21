import { AuthForm } from "@/components/site/AuthForm";

export const metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <section className="bg-navy-deep px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-foreground shadow-2xl md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-flag">Customer access</p>
        <h1 className="mt-2 font-heading text-3xl text-navy">Sign in</h1>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
          Sign in with email, Google, or Apple to view estimates and project updates.
        </p>
        <AuthForm mode="signin" error={error} />
      </div>
    </section>
  );
}
