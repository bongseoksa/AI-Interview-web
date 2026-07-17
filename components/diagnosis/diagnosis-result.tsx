"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useDiagnosisStore, type AnswerLevel } from "@/store/diagnosis";
import { CATEGORIES, CATEGORY_MAP } from "@/constants/categories";
import type { CategoryType } from "@/types/database";

const LEVEL_CONFIG: Record<
  AnswerLevel,
  { label: string; color: string; badgeVariant: string; score: number }
> = {
  know: {
    label: "안다",
    color: "text-green-600",
    badgeVariant: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    score: 100,
  },
  vague: {
    label: "애매하다",
    color: "text-yellow-600",
    badgeVariant: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    score: 50,
  },
  unknown: {
    label: "모른다",
    color: "text-red-600",
    badgeVariant: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    score: 0,
  },
};

export function DiagnosisResult() {
  const answers = useDiagnosisStore((s) => s.answers);
  const questions = useDiagnosisStore((s) => s.questions);
  const categoryResults = useDiagnosisStore((s) => s.getCategoryResults());
  const weakCategories = useDiagnosisStore((s) => s.getWeakCategories());
  const reset = useDiagnosisStore((s) => s.reset);

  // Overall score
  const totalScore =
    answers.reduce((sum, a) => sum + LEVEL_CONFIG[a.level].score, 0) /
    answers.length;

  // Sort categories: weak first
  const sortedCategories = CATEGORIES.filter(
    (cat) => categoryResults[cat.key] !== undefined
  ).sort((a, b) => {
    const scoreA = LEVEL_CONFIG[categoryResults[a.key]].score;
    const scoreB = LEVEL_CONFIG[categoryResults[b.key]].score;
    return scoreA - scoreB;
  });

  const knowCount = answers.filter((a) => a.level === "know").length;
  const vagueCount = answers.filter((a) => a.level === "vague").length;
  const unknownCount = answers.filter((a) => a.level === "unknown").length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; 대시보드
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">진단 결과</h1>
          <p className="text-muted-foreground">
            {questions.length}개 질문에 대한 자기 점검 결과입니다.
          </p>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">종합 이해도</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{Math.round(totalScore)}%</div>
              <Progress value={totalScore} className="flex-1 h-3" />
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                안다 {knowCount}개
              </span>
              <span className="text-yellow-600">
                애매 {vagueCount}개
              </span>
              <span className="text-red-600">
                모름 {unknownCount}개
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Weak Categories Alert */}
        {weakCategories.length > 0 && (
          <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-700 dark:text-red-400">
                취약 카테고리 ({weakCategories.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                아래 카테고리를 우선적으로 학습하면 효율적입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                {weakCategories.map((cat) => {
                  const meta = CATEGORY_MAP[cat as CategoryType];
                  if (!meta) return null;
                  return (
                    <Link key={cat} href={`/learn/${cat}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        {meta.icon} {meta.label}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Category Detail */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">카테고리별 결과</h2>
          {sortedCategories.map((cat) => {
            const level = categoryResults[cat.key];
            const config = LEVEL_CONFIG[level];
            const question = questions.find((q) => q.category === cat.key);

            return (
              <Card key={cat.key}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      {question && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {question.question}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={config.badgeVariant}>
                      {config.label}
                    </Badge>
                    {level !== "know" && question && (
                      <Link
                        href={`/learn/${cat.key}/${question.node_slug}`}
                        className="text-xs text-primary hover:underline"
                      >
                        학습하기
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          {weakCategories.length > 0 && (
            <Button asChild className="flex-1" size="lg">
              <Link href={`/learn/${weakCategories[0]}`}>
                취약 개념 학습하기
              </Link>
            </Button>
          )}
          <Button onClick={reset} variant="outline" size="lg" className="flex-1">
            다시 진단하기
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/dashboard">대시보드</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
