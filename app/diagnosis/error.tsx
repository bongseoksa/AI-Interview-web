"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DiagnosisError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>진단 데이터를 불러올 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            네트워크 문제 또는 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
          <div className="flex gap-3">
            <Button onClick={reset}>다시 시도</Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">대시보드로 이동</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
