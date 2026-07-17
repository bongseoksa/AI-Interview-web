import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNodesByCategory } from "@/lib/supabase/queries";
import { CATEGORIES, CATEGORY_MAP, DIFFICULTY_LABELS } from "@/constants/categories";
import type { CategoryType } from "@/types/database";

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_MAP[category as CategoryType];
  if (!meta) return { title: "Not Found" };
  return {
    title: `${meta.label} | AI Interview`,
    description: meta.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_MAP[category as CategoryType];
  if (!meta) notFound();

  const nodes = await getNodesByCategory(category as CategoryType);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← 대시보드
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{meta.label}</h1>
            <p className="text-muted-foreground">{meta.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {nodes.map((node) => {
          const diff = DIFFICULTY_LABELS[node.difficulty || "junior"];
          return (
            <Link key={node.id} href={`/learn/${category}/${node.slug}`}>
              <Card className="transition-colors hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {node.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`shrink-0 ${diff.color}`}
                    >
                      {diff.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {node.key_keywords && node.key_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {node.key_keywords.slice(0, 5).map((kw) => (
                        <Badge key={kw} variant="secondary" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {nodes.length === 0 && (
        <p className="text-center text-muted-foreground">
          아직 등록된 개념이 없습니다.
        </p>
      )}
    </main>
  );
}
