"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDiagnosisStore } from "@/store/diagnosis";

export function DiagnosisIntro() {
  const start = useDiagnosisStore((s) => s.start);
  const questions = useDiagnosisStore((s) => s.questions);

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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">메타인지 진단</h1>
          <p className="text-muted-foreground">
            9개 카테고리의 핵심 질문에 답변하여 나의 취약 영역을 파악하세요.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">진단 안내</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">1.</span>
                <span>
                  총 <strong className="text-foreground">{questions.length}개</strong> 핵심 질문이
                  카테고리별로 하나씩 출제됩니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">2.</span>
                <span>
                  각 질문에 대해{" "}
                  <strong className="text-green-600">안다</strong> /{" "}
                  <strong className="text-yellow-600">애매하다</strong> /{" "}
                  <strong className="text-red-600">모른다</strong>로
                  자기 점검합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">3.</span>
                <span>
                  결과 리포트에서 취약 카테고리를 확인하고 학습을 시작하세요.
                </span>
              </li>
            </ul>

            <p className="text-xs text-muted-foreground">
              * 정답을 작성하는 시험이 아닙니다. &quot;이 질문에 답할 수 있는가?&quot;를
              스스로 판단하는 메타인지 진단입니다.
            </p>
          </CardContent>
        </Card>

        <Button onClick={start} size="lg" className="w-full">
          진단 시작하기
        </Button>
      </div>
    </main>
  );
}
