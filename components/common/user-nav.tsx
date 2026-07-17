"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { useTranslations } from "next-intl";

export function UserNav() {
  const { user, loading, signOut } = useAuth();
  const t = useTranslations("auth");

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />;
  }

  if (!user) {
    return (
      <AuthModal>
        <Button variant="outline" size="sm">
          {t("login")}
        </Button>
      </AuthModal>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {user.email?.split("@")[0]}
      </span>
      <Button variant="ghost" size="sm" onClick={signOut}>
        {t("logout")}
      </Button>
    </div>
  );
}
