import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/common/user-nav";
import { LanguageSwitcher } from "@/components/common/language-switcher";

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("landing");

  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold">{t("heroTitle")}</span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserNav />
        </div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl whitespace-pre-line">
          {t("heroDescription")}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/diagnosis">{t("diagnosisButton")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">{t("startLearning")}</Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-muted/50 px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          <div className="space-y-2 text-center">
            <div className="text-3xl">🧠</div>
            <h3 className="text-lg font-semibold">{t("featureMetacognition")}</h3>
            <p className="text-sm text-muted-foreground">{t("featureMetacognitionDesc")}</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl">📚</div>
            <h3 className="text-lg font-semibold">{t("featureCurriculum")}</h3>
            <p className="text-sm text-muted-foreground">{t("featureCurriculumDesc")}</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl">🎯</div>
            <h3 className="text-lg font-semibold">{t("featureFrontend")}</h3>
            <p className="text-sm text-muted-foreground">{t("featureFrontendDesc")}</p>
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        {t("footer")}
      </footer>
    </main>
  );
}
