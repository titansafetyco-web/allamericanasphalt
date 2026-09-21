import type { Metadata } from "next";
import { AuthForm } from "@/components/site/AuthForm";
import { getUi } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const locale = await getLocale();
  const t = getUi(locale);

  return (
    <section className="bg-navy-deep px-4 py-16 text-white md:py-20">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-foreground shadow-2xl md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-flag">{t.pages.signInKicker}</p>
        <h1 className="mt-2 font-heading text-3xl text-navy">{t.pages.signUpTitle}</h1>
        <p className="mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
          {t.pages.signUpBody}
        </p>
        <AuthForm mode="signup" locale={locale} />
      </div>
    </section>
  );
}
