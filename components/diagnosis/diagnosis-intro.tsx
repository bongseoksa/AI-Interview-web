"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiagnosisStore } from "@/store/diagnosis";

export function DiagnosisIntro() {
  const t = useTranslations("diagnosis");
  const tc = useTranslations("common");
  const start = useDiagnosisStore((s) => s.start);
  const questions = useDiagnosisStore((s) => s.questions);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; {tc("backToDashboard")}
        </Link>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("guideTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">1.</span>
                <span>
                  {t.rich("guide1", {
                    count: questions.length,
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">2.</span>
                <span>
                  {t.rich("guide2_text", {
                    know: () => <strong className="text-green-600">{t("guide2_know")}</strong>,
                    vague: () => <strong className="text-yellow-600">{t("guide2_vague")}</strong>,
                    unknown: () => <strong className="text-red-600">{t("guide2_unknown")}</strong>,
                  })}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">3.</span>
                <span>
                  {t("guide3")}
                </span>
              </li>
            </ul>

            <p className="text-xs text-muted-foreground">
              {t("note")}
            </p>
          </CardContent>
        </Card>

        <Button onClick={start} size="lg" className="w-full">
          {t("startButton")}
        </Button>
      </div>
    </main>
  );
}
