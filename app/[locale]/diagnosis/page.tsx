import { getDiagnosticQuestions } from "@/lib/supabase/queries";
import { DiagnosisClient } from "@/components/diagnosis/diagnosis-client";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "diagnosis" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DiagnosisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const questions = await getDiagnosticQuestions(locale);

  return <DiagnosisClient questions={questions} />;
}
