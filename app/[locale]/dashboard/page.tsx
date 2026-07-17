import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCategoryCounts, getAllNodes } from "@/lib/supabase/queries";
import { getUserProgress } from "@/app/actions/progress";
import { CATEGORIES } from "@/constants/categories";
import { UserNav } from "@/components/common/user-nav";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [counts, nodes, progressList, t, tc] = await Promise.all([
    getCategoryCounts(),
    getAllNodes(),
    getUserProgress(),
    getTranslations("dashboard"),
    getTranslations("categories"),
  ]);
  const tCommon = await getTranslations("common");
  const totalNodes = Object.values(counts).reduce((a, b) => a + b, 0);

  // 카테고리별 완료 수 집계
  const completedByCategory: Record<string, number> = {};
  for (const p of progressList) {
    if (p.mastery_level >= 80) {
      const node = nodes.find((n) => n.id === p.node_id);
      if (node) {
        completedByCategory[node.category] =
          (completedByCategory[node.category] || 0) + 1;
      }
    }
  }
  const totalCompleted = Object.values(completedByCategory).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            &larr; {tCommon("backToHome")}
          </Link>
          <UserNav />
        </div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("totalProgress", { total: totalNodes, completed: totalCompleted })}
        </p>
        {totalNodes > 0 && (
          <Progress
            value={(totalCompleted / totalNodes) * 100}
            className="h-3"
          />
        )}
        <div className="flex gap-3 pt-2">
          <Button asChild>
            <Link href="/diagnosis">{t("diagnosisButton")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn/map">{t("mapButton")}</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const count = counts[cat.key] || 0;
          const completed = completedByCategory[cat.key] || 0;
          const pct = count > 0 ? (completed / count) * 100 : 0;
          return (
            <Link key={cat.key} href={`/learn/${cat.key}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.icon}</span>
                    <Badge variant="secondary">
                      {completed}/{count}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{tc(`${cat.key}.label` as any)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {tc(`${cat.key}.description` as any)}
                  </p>
                  <Progress value={pct} className="h-2" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
