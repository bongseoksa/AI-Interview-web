"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { upsertProgress } from "@/app/actions/progress";

interface CompletionButtonProps {
  nodeId: string;
  initialMastery: number | null;
}

export function CompletionButton({
  nodeId,
  initialMastery,
}: CompletionButtonProps) {
  const { user } = useAuth();
  const [mastery, setMastery] = useState(initialMastery);
  const [isPending, startTransition] = useTransition();

  const isCompleted = mastery !== null && mastery >= 80;

  const handleComplete = () => {
    const newLevel = isCompleted ? 0 : 100;
    setMastery(newLevel);

    startTransition(async () => {
      const result = await upsertProgress(nodeId, newLevel);
      if (result.error) {
        setMastery(initialMastery);
      }
    });
  };

  if (!user) {
    return (
      <AuthModal>
        <Button variant="outline" className="w-full">
          로그인하고 학습 완료 기록하기
        </Button>
      </AuthModal>
    );
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={isPending}
      variant={isCompleted ? "outline" : "default"}
      className="w-full"
    >
      {isPending
        ? "저장 중..."
        : isCompleted
          ? "학습 완료 취소"
          : "학습 완료"}
    </Button>
  );
}
