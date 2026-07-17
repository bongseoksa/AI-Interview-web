import { getDiagnosticQuestions } from "@/lib/supabase/queries";
import { DiagnosisClient } from "@/components/diagnosis/diagnosis-client";

export const metadata = {
  title: "메타인지 진단 | AI Interview",
  description: "9개 카테고리 핵심 질문으로 나의 취약 영역을 파악합니다.",
};

export default async function DiagnosisPage() {
  const questions = await getDiagnosticQuestions();

  return <DiagnosisClient questions={questions} />;
}
