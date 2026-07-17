"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function upsertProgress(nodeId: string, masteryLevel: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "인증이 필요합니다." };
  }

  const { error } = await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      node_id: nodeId,
      mastery_level: masteryLevel,
      last_accessed: new Date().toISOString(),
    },
    { onConflict: "user_id,node_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/learn/map");
  return { success: true };
}

export async function getUserProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return [];
  }

  return data;
}

export async function getProgressByNodeId(nodeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("node_id", nodeId)
    .single();

  return data;
}
