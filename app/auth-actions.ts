"use server";

import { redirect } from "next/navigation";
import type { FormState } from "@/app/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function submitAuth(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Member accounts are not connected yet. Try again in a moment." };
  }

  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) {
    return { ok: true, message: "Thanks — we received your request." };
  }

  const mode = String(formData.get("mode") ?? "signin") === "signup" ? "signup" : "signin";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }
  if (mode === "signup" && !name) {
    return { ok: false, message: "Please add your name so we can set up the account." };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (mode === "signup") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) return { ok: false, message: error.message };
    if (!data.session) {
      return { ok: true, message: "Check your email to confirm your account, then sign in." };
    }
    redirect("/account");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };
  redirect("/account");
}

export async function signOut() {
  if (!isSupabaseConfigured()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateMemberProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!fullName) {
    return { ok: false, message: "Please add your name." };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("members").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        phone,
        updated_at: new Date().toISOString(),
      });
      if (error) return { ok: false, message: error.message };

      await supabase.auth.updateUser({
        data: { full_name: fullName, phone },
      });
    }
  }

  redirect("/crm");
}
