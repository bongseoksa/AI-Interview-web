"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORY_MAP } from "@/constants/categories";
import {
  useDiagnosisStore,
  type AnswerLevel,
} from "@/store/diagnosis";
import type { CategoryType } from "@/types/database";
import { useState } from "react";

const ANSWER_OPTIONS: { value: AnswerLevel; labelKey: string; descKey: string; color: string }[] = [
  {
    value: "know",
    labelKey: "answerKnow",
    descKey: "answerKnowDesc",
    color: "border-green-500 bg-green-50 dark:bg-green-950",
  },
  {
    value: "vague",
    labelKey: "answerVague",
    descKey: "answerVagueDesc",
    color: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
  },
  {
    value: "unknown",
    labelKey: "answerUnknown",
    descKey: "answerUnknownDesc",
    color: "border-red-500 bg-red-50 dark:bg-red-950",
  },
];

export function DiagnosisQuestion() {
  const t = useTranslations("diagnosis");
  const questions = useDiagnosisStore((s) => s.questions);
  const currentIndex = useDiagnosisStore((s) => s.currentIndex);
  const answer = useDiagnosisStore((s) => s.answer);
  const skip = useDiagnosisStore((s) => s.skip);

  const [selected, setSelected] = useState<AnswerLevel | "">("");

  const question = questions[currentIndex];
  if (!question) return null;

  const progress = ((currentIndex) / questions.length) * 100;
  const category = CATEGORY_MAP[question.category as CategoryType];

  const handleSubmit = () => {
    if (!selected) return;
    answer(selected);
    setSelected("");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 min-h-[600px]">
      {/* Progress */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("questionProgress", { current: currentIndex + 1, total: questions.length })}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6" aria-live="polite">
        <CardHeader className="pb-3">
          {category && (
            <Badge variant="outline" className={category.color}>
              {category.icon} {category.label}
            </Badge>
          )}
          <CardTitle className="text-xl leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("selfCheck")}
          </p>
        </CardContent>
      </Card>

      {/* Answer Options */}
      <RadioGroup
        value={selected}
        onValueChange={(v) => setSelected(v as AnswerLevel)}
        className="mb-6 space-y-3"
      >
        {ANSWER_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            htmlFor={`answer-${opt.value}`}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
              selected === opt.value ? opt.color : "border-transparent bg-muted/50"
            }`}
          >
            <RadioGroupItem value={opt.value} id={`answer-${opt.value}`} />
            <div>
              <span className="font-medium">{t(opt.labelKey)}</span>
              <p className="text-sm text-muted-foreground">{t(opt.descKey)}</p>
            </div>
          </label>
        ))}
      </RadioGroup>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="flex-1"
          size="lg"
        >
          {currentIndex + 1 === questions.length ? t("viewResult") : t("nextQuestion")}
        </Button>
        <Button
          onClick={() => {
            skip();
            setSelected("");
          }}
          variant="ghost"
          size="lg"
        >
          {t("skipQuestion")}
        </Button>
      </div>
    </main>
  );
}
