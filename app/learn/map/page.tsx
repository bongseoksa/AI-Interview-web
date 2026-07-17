import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getCategoryCounts } from "@/lib/supabase/queries";
import { CATEGORIES, DIFFICULTY_LABELS } from "@/constants/categories";
import { getAllNodes } from "@/lib/supabase/queries";

export const metadata = {
  title: "취약 맵 | AI Interview",
  description: "전체 개념 이해도 현황 시각화",
};

export default async function MapPage() {
  const [counts, nodes] = await Promise.all([getCategoryCounts(), getAllNodes()]);
  const totalNodes = Object.values(counts).reduce((a, b) => a + b, 0);

  // 카테고리별 난이도 분포
  const categoryStats = CATEGORIES.map((cat) => {
    const catNodes = nodes.filter((n) => n.category === cat.key);
    const diffCounts = { junior: 0, mid: 0, senior: 0 };
    catNodes.forEach((n) => {
      const d = (n.difficulty || "junior") as keyof typeof diffCounts;
      if (d in diffCounts) diffCounts[d]++;
    });
    return { ...cat, count: catNodes.length, diffCounts };
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← 대시보드
        </Link>
        <h1 className="text-3xl font-bold">취약 맵</h1>
        <p className="text-muted-foreground">
          전체 {totalNodes}개 개념의 카테고리별 분포와 난이도 현황입니다.
          <br />
          로그인 후 학습을 진행하면 이해도 상태가 반영됩니다.
        </p>
      </div>

      {/* 카테고리별 현황 */}
      <div className="space-y-4">
        {categoryStats.map((cat) => {
          const pct = totalNodes > 0 ? (cat.count / totalNodes) * 100 : 0;
          return (
            <Link key={cat.key} href={`/learn/${cat.key}`}>
              <Card className="transition-colors hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span>{cat.icon}</span>
                      {cat.label}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {cat.count}개
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={pct} className="h-2" />
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
