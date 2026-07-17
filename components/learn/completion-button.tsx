"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { upsertProgress } from "@/app/actions/progress";
import { useTranslations } from "next-intl";

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
  const ta = useTranslations("auth");
  const tc = useTranslations("common");
  const tl = useTranslations("learn");

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
          {ta("loginAndRecord")}
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
        ? tc("saving")
        : isCompleted
          ? tl("completionUndo")
          : tl("completionDone")}
    </Button>
  );
}
