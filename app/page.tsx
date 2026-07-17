import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          AI Interview
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
          프론트엔드 엔지니어를 위한 AI 기반 기술 학습 및 모의 인터뷰 연습 서비스.
          <br />
          내가 무엇을 알고 무엇을 모르는지 파악하는 것부터 시작하세요.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/diagnosis">취약 영역 진단하기</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">학습 시작하기</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
          <div className="space-y-2 text-center">
            <div className="text-3xl">🧠</div>
            <h3 className="text-lg font-semibold">메타인지 학습</h3>
            <p className="text-sm text-muted-foreground">
              아는 것과 모르는 것을 구분하고, 취약 영역을 시각적으로 파악하세요.
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl">📚</div>
            <h3 className="text-lg font-semibold">체계적 커리큘럼</h3>
            <p className="text-sm text-muted-foreground">
              8개 카테고리, 138개 핵심 개념을 단계별로 학습하세요.
            </p>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-3xl">🎯</div>
            <h3 className="text-lg font-semibold">프론트엔드 특화</h3>
            <p className="text-sm text-muted-foreground">
              HTML, CSS, JS, React, Next.js 등 프론트엔드 핵심 주제만 다룹니다.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        AI Interview — 프론트엔드 면접 준비의 새로운 방법
      </footer>
    </main>
  );
}
