import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCategoryCounts, getAllNodes } from "@/lib/supabase/queries";
import { getUserProgress } from "@/app/actions/progress";
import { CATEGORIES, DIFFICULTY_LABELS } from "@/constants/categories";
import { UserNav } from "@/components/common/user-nav";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

function getMasteryColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-yellow-500";
  if (pct > 0) return "bg-orange-500";
  return "bg-red-500";
}

function getMasteryLabel(pct: number, t: (key: string) => string): string {
  if (pct >= 80) return t("excellent");
  if (pct >= 50) return t("normal");
  if (pct > 0) return t("poor");
  return t("notStarted");
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [counts, nodes, progressList, t, tc, td] = await Promise.all([
    getCategoryCounts(),
    getAllNodes(),
    getUserProgress(),
    getTranslations("map"),
    getTranslations("categories"),
    getTranslations("difficulty"),
  ]);
  const tCommon = await getTranslations("common");
  const totalNodes = Object.values(counts).reduce((a, b) => a + b, 0);

  // 노드별 진행도 맵
  const progressMap = new Map(
    progressList.map((p) => [p.node_id, p.mastery_level])
  );

  // 카테고리별 통계
  const categoryStats = CATEGORIES.map((cat) => {
    const catNodes = nodes.filter((n) => n.category === cat.key);
    const diffCounts = { junior: 0, mid: 0, senior: 0 };
    let completedCount = 0;
    let totalMastery = 0;

    catNodes.forEach((n) => {
      const d = (n.difficulty || "junior") as keyof typeof diffCounts;
      if (d in diffCounts) diffCounts[d]++;
      const mastery = progressMap.get(n.id) ?? 0;
      totalMastery += mastery;
      if (mastery >= 80) completedCount++;
    });

    const avgMastery =
      catNodes.length > 0 ? totalMastery / catNodes.length : 0;

    return {
      ...cat,
      count: catNodes.length,
      diffCounts,
      completedCount,
      avgMastery,
    };
  });

  const totalCompleted = categoryStats.reduce(
    (a, c) => a + c.completedCount,
    0
  );
  const hasProgress = progressList.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:underline"
          >
            &larr; {tCommon("backToDashboard")}
          </Link>
          <UserNav />
        </div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {hasProgress
            ? t("progressDescription", { total: totalNodes, completed: totalCompleted })
            : t("noProgressDescription")}
        </p>
      </div>

      {/* 카테고리별 현황 */}
      <div className="space-y-4">
        {categoryStats.map((cat) => {
          const completionPct =
            cat.count > 0 ? (cat.completedCount / cat.count) * 100 : 0;
          return (
            <Link key={cat.key} href={`/learn/${cat.key}`}>
              <Card className="transition-colors hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span>{cat.icon}</span>
                      {tc(`${cat.key}.label` as any)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {hasProgress && (
                        <Badge
                          variant="outline"
                          className={`text-xs text-white ${getMasteryColor(cat.avgMastery)}`}
                        >
                          {getMasteryLabel(cat.avgMastery, t)}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {cat.completedCount}/{cat.count}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={completionPct} className="h-2" />
                  <div className="flex gap-2">
                    {(
                      Object.entries(cat.diffCounts) as [string, number][]
                    ).map(([level, count]) => {
                      if (count === 0) return null;
                      const d = DIFFICULTY_LABELS[level];
                      return (
                        <Badge
                          key={level}
                          variant="outline"
                          className={`text-xs ${d.color}`}
                        >
                          {td(level as any)} {count}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
