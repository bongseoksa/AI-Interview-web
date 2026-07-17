import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryCounts } from "@/lib/supabase/queries";
import { CATEGORIES } from "@/constants/categories";

export const metadata = {
  title: "커리큘럼 대시보드 | AI Interview",
  description: "8개 카테고리별 프론트엔드 핵심 개념 학습 현황",
};

export default async function DashboardPage() {
  const counts = await getCategoryCounts();
  const totalNodes = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← 홈으로
        </Link>
        <h1 className="text-3xl font-bold">커리큘럼 대시보드</h1>
        <p className="text-muted-foreground">
          총 {totalNodes}개 핵심 개념을 8개 카테고리로 학습하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const count = counts[cat.key] || 0;
          return (
            <Link key={cat.key} href={`/learn/${cat.key}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.icon}</span>
                    <Badge variant="secondary">{count}개</Badge>
                  </div>
                  <CardTitle className="text-lg">{cat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
