import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNodesByCategory } from "@/lib/supabase/queries";
import { getUserProgress } from "@/app/actions/progress";
import { CATEGORIES, CATEGORY_MAP, DIFFICULTY_LABELS } from "@/constants/categories";
import { routing } from "@/i18n/routing";
import type { CategoryType } from "@/types/database";

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CATEGORIES.map((cat) => ({ locale, category: cat.key }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const tc = await getTranslations({ locale, namespace: "categories" });
  const meta = CATEGORY_MAP[decodedCategory as CategoryType];
  if (!meta) return { title: "Not Found" };
  const label = tc(`${decodedCategory}.label` as Parameters<typeof tc>[0]);
  return {
    title: `${label} | AI Interview`,
    description: meta.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const decodedCategory = decodeURIComponent(category);
  const meta = CATEGORY_MAP[decodedCategory as CategoryType];
  if (!meta) notFound();

  const [nodes, progressList, tc, td, tl] = await Promise.all([
    getNodesByCategory(decodedCategory as CategoryType, locale),
    getUserProgress(),
    getTranslations("categories"),
    getTranslations("difficulty"),
    getTranslations("learn"),
  ]);
  const progressMap = new Map(
    progressList.map((p) => [p.node_id, p.mastery_level])
  );

  const categoryLabel = tc(`${decodedCategory}.label` as Parameters<typeof tc>[0]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:underline"
        >
          {tl("backToDashboardArrow")}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{categoryLabel}</h1>
            <p className="text-muted-foreground">{meta.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {nodes.map((node) => {
          const diff = DIFFICULTY_LABELS[node.difficulty || "junior"];
          const diffLabel = td(node.difficulty || "junior");
          const mastery = progressMap.get(node.id);
          const isCompleted = mastery !== undefined && mastery >= 80;
          return (
            <Link key={node.id} href={`/learn/${decodedCategory}/${node.slug}`}>
              <Card className={`transition-colors hover:border-primary ${isCompleted ? "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                      {isCompleted && <span className="text-green-600">&#10003;</span>}
                      {node.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`shrink-0 ${diff.color}`}
                    >
                      {diffLabel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {node.key_keywords && node.key_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {node.key_keywords.slice(0, 5).map((kw: string) => (
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
          {tl("noConcepts")}
        </p>
      )}
    </main>
  );
}
