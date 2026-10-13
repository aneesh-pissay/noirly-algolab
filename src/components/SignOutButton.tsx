"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@noirly-dev/ui";

/** Ends the session; Auth.js's signOut event revokes its `sid` server-side. */
export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSignOut() {
    setBusy(true);
    setError(null);
    try {
      await signOut({ redirectTo: "/login" });
    } catch {
      setBusy(false);
      setError("Could not sign out. Please try again.");
    }
  }

  return (
    <>
      {error ? <p role="alert" className="text-sm text-[var(--foreground)]">{error}</p> : null}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        onClick={() => void onSignOut()}
        disabled={busy}
      >
        <LogOut size={14} aria-hidden />
        {busy ? "Signing out…" : "Sign out"}
      </Button>
    </>
  );
}
