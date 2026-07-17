import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getCategoryCounts, getAllNodes } from "@/lib/supabase/queries";
import { getUserProgress } from "@/app/actions/progress";
import { CATEGORIES } from "@/constants/categories";
import { UserNav } from "@/components/common/user-nav";

export const metadata = {
  title: "커리큘럼 대시보드 | AI Interview",
  description: "9개 카테고리별 프론트엔드 핵심 개념 학습 현황",
};

export default async function DashboardPage() {
  const [counts, nodes, progressList] = await Promise.all([
    getCategoryCounts(),
    getAllNodes(),
    getUserProgress(),
  ]);
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
            &larr; 홈으로
          </Link>
          <UserNav />
        </div>
        <h1 className="text-3xl font-bold">커리큘럼 대시보드</h1>
        <p className="text-muted-foreground">
          총 {totalNodes}개 핵심 개념 중 {totalCompleted}개 완료
        </p>
        {totalNodes > 0 && (
          <Progress
            value={(totalCompleted / totalNodes) * 100}
            className="h-3"
          />
        )}
        <div className="flex gap-3 pt-2">
          <Button asChild>
            <Link href="/diagnosis">메타인지 진단</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/learn/map">취약 맵</Link>
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
                  <CardTitle className="text-lg">{cat.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
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
