import { AuthForm } from "@/components/site/AuthForm";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata = { title: "Sign In" };

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, locale] = await Promise.all([searchParams, getLocale()]);
  const t = getUi(locale);

  return (
    <section className="bg-navy-deep px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-foreground shadow-2xl md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-flag">{t.pages.signInKicker}</p>
        <h1 className="mt-2 font-heading text-3xl text-navy">{t.pages.signInTitle}</h1>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
          {t.pages.signInBody}
        </p>
        <AuthForm mode="signin" error={error} locale={locale} />
      </div>
    </section>
  );
}
