import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getAllNodes, getNodeBySlug } from "@/lib/supabase/queries";
import { getProgressByNodeId } from "@/app/actions/progress";
import { CATEGORY_MAP, DIFFICULTY_LABELS } from "@/constants/categories";
import { CompletionButton } from "@/components/learn/completion-button";
import { routing } from "@/i18n/routing";
import type { CategoryType } from "@/types/database";

export async function generateStaticParams() {
  const nodes = await getAllNodes();
  return routing.locales.flatMap((locale) =>
    nodes.map((node) => ({
      locale,
      category: node.category,
      slug: node.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  try {
    const { locale } = await params;
    const node = await getNodeBySlug(decodedSlug, locale);
    return {
      title: `${node.title} | AI Interview`,
      description: node.content_body?.slice(0, 160) || node.title,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);

  const decodedCategory = decodeURIComponent(category);
  const decodedSlug = decodeURIComponent(slug);
  const meta = CATEGORY_MAP[decodedCategory as CategoryType];
  if (!meta) notFound();

  let node;
  try {
    node = await getNodeBySlug(decodedSlug, locale);
  } catch {
    notFound();
  }

  const diff = DIFFICULTY_LABELS[node.difficulty || "junior"];

  const [t, tc, td] = await Promise.all([
    getTranslations("learn"),
    getTranslations("categories"),
    getTranslations("difficulty"),
  ]);

  const categoryLabel = tc(`${decodedCategory}.label` as Parameters<typeof tc>[0]);
  const diffLabel = td(node.difficulty || "junior");

  // 답변 가이드를 3단 구조로 분리 (개념 정의 / 핵심 원리 / 면접 빈출 키워드)
  const contentBody = node.content_body || "";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* 네비게이션 */}
      <div className="mb-6 space-y-1">
        <Link
          href={`/learn/${decodedCategory}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; {categoryLabel}
        </Link>
      </div>

      {/* 제목 */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={meta.color}>
            {meta.icon} {categoryLabel}
          </Badge>
          <Badge variant="outline" className={diff.color}>
            {diffLabel}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
          {node.title}
        </h1>
      </div>

      {/* 개념 설명 (3단 구조) */}
      <div className="space-y-6">
        {/* 섹션 1: 개념 정의 & 핵심 원리 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("conceptTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
              {contentBody}
            </p>
          </CardContent>
        </Card>

        {/* 섹션 2: 면접 빈출 키워드 */}
        {node.key_keywords && node.key_keywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("keywordsTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {node.key_keywords.map((kw: string) => (
                  <Badge key={kw} variant="secondary" className="text-sm">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 섹션 3: AI 팁 (Default Tip) */}
        {node.default_tip && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">💡 {t("tipTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80">{node.default_tip}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 학습 완료 버튼 */}
      <div className="mt-6">
        <CompletionButtonWrapper nodeId={node.id} />
      </div>

      <Separator className="my-8" />

      {/* 하단 네비게이션 */}
      <div className="flex justify-between text-sm">
        <Link
          href={`/learn/${decodedCategory}`}
          className="text-muted-foreground hover:underline"
        >
          &larr; {t("backToList", { category: categoryLabel })}
        </Link>
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:underline"
        >
          {t("goToDashboard")} &rarr;
        </Link>
      </div>
    </main>
  );
}

async function CompletionButtonWrapper({ nodeId }: { nodeId: string }) {
  const progress = await getProgressByNodeId(nodeId);
  return (
    <CompletionButton
      nodeId={nodeId}
      initialMastery={progress?.mastery_level ?? null}
    />
  );
}
