import { create } from "zustand";
import type { DiagnosticQuestionWithNode } from "@/lib/supabase/queries";

export type AnswerLevel = "know" | "vague" | "unknown";

export interface DiagnosisAnswer {
  questionId: string;
  category: string;
  level: AnswerLevel;
}

export type DiagnosisPhase = "intro" | "in-progress" | "result";

interface DiagnosisState {
  phase: DiagnosisPhase;
  questions: DiagnosticQuestionWithNode[];
  currentIndex: number;
  answers: DiagnosisAnswer[];

  setQuestions: (questions: DiagnosticQuestionWithNode[]) => void;
  start: () => void;
  answer: (level: AnswerLevel) => void;
  skip: () => void;
  reset: () => void;

  // Computed
  getWeakCategories: () => string[];
  getCategoryResults: () => Record<string, AnswerLevel>;
}

export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  phase: "intro",
  questions: [],
  currentIndex: 0,
  answers: [],

  setQuestions: (questions) => set({ questions }),

  start: () => set({ phase: "in-progress", currentIndex: 0, answers: [] }),

  answer: (level) => {
    const { questions, currentIndex, answers } = get();
    const q = questions[currentIndex];
    const newAnswers = [
      ...answers,
      { questionId: q.id, category: q.category, level },
    ];
    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      set({ answers: newAnswers, phase: "result" });
    } else {
      set({ answers: newAnswers, currentIndex: nextIndex });
    }
  },

  skip: () => {
    get().answer("unknown");
  },

  reset: () =>
    set({ phase: "intro", currentIndex: 0, answers: [] }),

  getWeakCategories: () => {
    const results = get().getCategoryResults();
    return Object.entries(results)
      .filter(([, level]) => level === "unknown" || level === "vague")
      .map(([cat]) => cat);
  },

  getCategoryResults: () => {
    const { answers } = get();
    const results: Record<string, AnswerLevel> = {};
    for (const a of answers) {
      results[a.category] = a.level;
    }
    return results;
  },
}));
