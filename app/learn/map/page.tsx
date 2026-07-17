import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCategoryCounts, getAllNodes } from "@/lib/supabase/queries";
import { getUserProgress } from "@/app/actions/progress";
import { CATEGORIES, DIFFICULTY_LABELS } from "@/constants/categories";
import { UserNav } from "@/components/common/user-nav";

export const metadata = {
  title: "취약 맵 | AI Interview",
  description: "전체 개념 이해도 현황 시각화",
};

function getMasteryColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-yellow-500";
  if (pct > 0) return "bg-orange-500";
  return "bg-red-500";
}

function getMasteryLabel(pct: number): string {
  if (pct >= 80) return "우수";
  if (pct >= 50) return "보통";
  if (pct > 0) return "미흡";
  return "미학습";
}

export default async function MapPage() {
  const [counts, nodes, progressList] = await Promise.all([
    getCategoryCounts(),
    getAllNodes(),
    getUserProgress(),
  ]);
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
            &larr; 대시보드
          </Link>
          <UserNav />
        </div>
        <h1 className="text-3xl font-bold">취약 맵</h1>
        <p className="text-muted-foreground">
          {hasProgress
            ? `전체 ${totalNodes}개 중 ${totalCompleted}개 완료. 취약 영역을 집중 학습하세요.`
            : "로그인 후 학습을 진행하면 이해도 상태가 반영됩니다."}
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
                      {cat.label}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {hasProgress && (
                        <Badge
                          variant="outline"
                          className={`text-xs text-white ${getMasteryColor(cat.avgMastery)}`}
                        >
                          {getMasteryLabel(cat.avgMastery)}
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
                          {d.label} {count}
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
