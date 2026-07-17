"use client";

import { useEffect } from "react";
import { useDiagnosisStore } from "@/store/diagnosis";
import type { DiagnosticQuestionWithNode } from "@/lib/supabase/queries";
import { DiagnosisIntro } from "@/components/diagnosis/diagnosis-intro";
import { DiagnosisQuestion as QuestionView } from "@/components/diagnosis/diagnosis-question";
import { DiagnosisResult } from "@/components/diagnosis/diagnosis-result";

interface DiagnosisClientProps {
  questions: DiagnosticQuestionWithNode[];
}

export function DiagnosisClient({ questions }: DiagnosisClientProps) {
  const phase = useDiagnosisStore((s) => s.phase);
  const setQuestions = useDiagnosisStore((s) => s.setQuestions);

  useEffect(() => {
    setQuestions(questions);
  }, [questions, setQuestions]);

  switch (phase) {
    case "intro":
      return <DiagnosisIntro />;
    case "in-progress":
      return <QuestionView />;
    case "result":
      return <DiagnosisResult />;
  }
}
