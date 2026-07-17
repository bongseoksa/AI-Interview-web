"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface AuthModalProps {
  children: React.ReactNode;
}

export function AuthModal({ children }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? t("errorInvalidCredentials")
            : error.message === "Email not confirmed"
              ? t("errorEmailNotConfirmed")
              : error.message
        );
        setLoading(false);
        return;
      }
      setLoading(false);
      setOpen(false);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(
          error.message === "User already registered"
            ? t("errorAlreadyRegistered")
            : error.message
        );
        setLoading(false);
        return;
      }
      setLoading(false);
      if (!data.session) {
        setSuccess(t("successEmailSent"));
        return;
      }
      setOpen(false);
      router.refresh();
    }
  };

  const modeLabel = mode === "login" ? t("login") : t("signup");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {modeLabel}
          </DialogTitle>
          <DialogDescription>
            {t("description", { mode: modeLabel })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("emailPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? tc("loading")
              : modeLabel}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              {t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-primary underline"
              >
                {t("signup")}
              </button>
            </>
          ) : (
            <>
              {t("hasAccount")}{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-primary underline"
              >
                {t("login")}
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
