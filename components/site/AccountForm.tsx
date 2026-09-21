"use client";

import { useActionState, useState } from "react";
import { updateMemberProfile } from "@/app/auth-actions";
import type { FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const initial: FormState = { ok: false, message: "" };

export function AccountForm({
  email,
  fullName,
  phone,
  avatarUrl,
}: {
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
}) {
  const [state, action, pending] = useActionState(updateMemberProfile, initial);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(avatarUrl);

  async function onFile(kind: "avatar" | "file", file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadMessage("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setUploadMessage("Please sign in again.");
      setUploading(false);
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = kind === "avatar" ? `${user.id}/avatar.${ext}` : `${user.id}/files/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("members").upload(path, file, { upsert: true });
    if (error) {
      setUploadMessage(error.message);
      setUploading(false);
      return;
    }

    if (kind === "avatar") {
      await supabase.from("members").upsert({
        id: user.id,
        email: user.email,
        avatar_path: path,
        updated_at: new Date().toISOString(),
      });
      const signed = await supabase.storage.from("members").createSignedUrl(path, 60 * 60 * 24);
      setPreview(signed.data?.signedUrl ?? preview);
    }

    setUploadMessage(kind === "avatar" ? "Photo saved." : "File uploaded to your member folder.");
    setUploading(false);
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <div className="size-16 overflow-hidden rounded-full bg-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-lg font-bold text-navy">
              {(fullName || email).slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium">Profile photo</label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-1 h-10 bg-white"
            disabled={uploading}
            onChange={(e) => onFile("avatar", e.target.files?.[0])}
          />
        </div>
      </div>

      <form action={action} className="grid gap-3">
        <div className="grid gap-1.5">
          <label htmlFor="member-email" className="text-sm font-medium">
            Email
          </label>
          <Input id="member-email" value={email} readOnly className="h-11 bg-muted" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="member-name" className="text-sm font-medium">
            Name
          </label>
          <Input id="member-name" name="full_name" defaultValue={fullName} required className="h-11 bg-white" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="member-phone" className="text-sm font-medium">
            Phone
          </label>
          <Input id="member-phone" name="phone" type="tel" defaultValue={phone} className="h-11 bg-white" />
        </div>
        <Button type="submit" disabled={pending} className="h-11 bg-red-flag font-bold text-white hover:bg-red-flag/90">
          {pending ? "Saving…" : "Save profile"}
        </Button>
        {state.message ? (
          <p className={cn("text-sm", state.ok ? "text-emerald-700" : "text-destructive")} role="status">
            {state.message}
          </p>
        ) : null}
      </form>

      <div className="grid gap-1.5">
        <label className="text-sm font-medium">Job photos or documents</label>
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="h-10 bg-white"
          disabled={uploading}
          onChange={(e) => onFile("file", e.target.files?.[0])}
        />
        {uploadMessage ? <p className="text-sm text-emerald-700">{uploadMessage}</p> : null}
      </div>
    </div>
  );
}
