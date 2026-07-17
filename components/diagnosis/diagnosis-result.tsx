"use client";

import { useEffect, useMemo, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  useDiagnosisStore,
  getCategoryResults,
  getWeakCategories,
  type AnswerLevel,
} from "@/store/diagnosis";
import { useAuth } from "@/providers/auth-provider";
import { upsertProgress } from "@/app/actions/progress";
import { CATEGORIES, CATEGORY_MAP } from "@/constants/categories";
import type { CategoryType } from "@/types/database";

const LEVEL_STYLE: Record<
  AnswerLevel,
  { labelKey: string; color: string; badgeVariant: string; score: number }
> = {
  know: {
    labelKey: "know",
    color: "text-green-600",
    badgeVariant: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    score: 100,
  },
  vague: {
    labelKey: "vague",
    color: "text-yellow-600",
    badgeVariant: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    score: 50,
  },
  unknown: {
    labelKey: "unknown",
    color: "text-red-600",
    badgeVariant: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    score: 0,
  },
};

export function DiagnosisResult() {
  const t = useTranslations("diagnosis");
  const tc = useTranslations("categories");
  const tCommon = useTranslations("common");
  const answers = useDiagnosisStore((s) => s.answers);
  const questions = useDiagnosisStore((s) => s.questions);
  const reset = useDiagnosisStore((s) => s.reset);

  const categoryResults = useMemo(() => getCategoryResults(answers), [answers]);
  const weakCategories = useMemo(() => getWeakCategories(answers), [answers]);
  const { user } = useAuth();
  const savedRef = useRef(false);

  // Save diagnosis results to user_progress
  useEffect(() => {
    if (!user || savedRef.current || answers.length === 0) return;
    savedRef.current = true;

    for (const answer of answers) {
      const q = questions.find((q) => q.id === answer.questionId);
      if (!q) continue;
      const mastery = LEVEL_STYLE[answer.level].score;
      upsertProgress(q.node_id, mastery);
    }
  }, [user, answers, questions]);

  // Overall score
  const totalScore =
    answers.reduce((sum, a) => sum + LEVEL_STYLE[a.level].score, 0) /
    answers.length;

  // Sort categories: weak first
  const sortedCategories = CATEGORIES.filter(
    (cat) => categoryResults[cat.key] !== undefined
  ).sort((a, b) => {
    const scoreA = LEVEL_STYLE[categoryResults[a.key]].score;
    const scoreB = LEVEL_STYLE[categoryResults[b.key]].score;
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
          &larr; {tCommon("backToDashboard")}
        </Link>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{t("resultTitle")}</h1>
          <p className="text-muted-foreground">
            {t("resultDescription", { count: questions.length })}
          </p>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("overallScore")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{Math.round(totalScore)}%</div>
              <Progress value={totalScore} className="flex-1 h-3" />
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600">
                {t("know")} {t("countUnit", { count: knowCount })}
              </span>
              <span className="text-yellow-600">
                {t("vague")} {t("countUnit", { count: vagueCount })}
              </span>
              <span className="text-red-600">
                {t("unknown")} {t("countUnit", { count: unknownCount })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Weak Categories Alert */}
        {weakCategories.length > 0 && (
          <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-700 dark:text-red-400">
                {t("weakCategories", { count: weakCategories.length })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                {t("weakCategoryGuide")}
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
                        {meta.icon} {tc(`${cat}.label`)}
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
          <h2 className="text-lg font-semibold">{t("categoryResults")}</h2>
          {sortedCategories.map((cat) => {
            const level = categoryResults[cat.key];
            const config = LEVEL_STYLE[level];
            const question = questions.find((q) => q.category === cat.key);

            return (
              <Card key={cat.key}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <div>
                      <div className="font-medium">{tc(`${cat.key}.label`)}</div>
                      {question && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {question.question}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={config.badgeVariant}>
                      {t(config.labelKey)}
                    </Badge>
                    {level !== "know" && question && (
                      <Link
                        href={`/learn/${cat.key}/${question.node_slug}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {t("studyLink")}
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
                {t("studyWeakButton")}
              </Link>
            </Button>
          )}
          <Button onClick={reset} variant="outline" size="lg" className="flex-1">
            {t("retryDiagnosis")}
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/dashboard">{tCommon("backToDashboard")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
