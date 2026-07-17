"use client";

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

const ANSWER_OPTIONS: { value: AnswerLevel; label: string; description: string; color: string }[] = [
  {
    value: "know",
    label: "안다",
    description: "이 질문에 논리적으로 답변할 수 있다",
    color: "border-green-500 bg-green-50 dark:bg-green-950",
  },
  {
    value: "vague",
    label: "애매하다",
    description: "들어봤지만 명확하게 설명하기 어렵다",
    color: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950",
  },
  {
    value: "unknown",
    label: "모른다",
    description: "처음 듣거나 전혀 답할 수 없다",
    color: "border-red-500 bg-red-50 dark:bg-red-950",
  },
];

export function DiagnosisQuestion() {
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
            질문 {currentIndex + 1} / {questions.length}
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
            이 질문에 면접에서 답변할 수 있는지 스스로 판단해주세요.
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
              <span className="font-medium">{opt.label}</span>
              <p className="text-sm text-muted-foreground">{opt.description}</p>
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
          {currentIndex + 1 === questions.length ? "결과 확인" : "다음 질문"}
        </Button>
        <Button
          onClick={() => {
            skip();
            setSelected("");
          }}
          variant="ghost"
          size="lg"
        >
          건너뛰기
        </Button>
      </div>
    </main>
  );
}
