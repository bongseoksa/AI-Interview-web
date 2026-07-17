"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiagnosisError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("diagnosis");
  const tc = useTranslations("common");

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t("errorTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {tc("errorNetwork")}
          </p>
          <div className="flex gap-3">
            <Button onClick={reset}>{tc("retry")}</Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">{tc("goToDashboard")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
