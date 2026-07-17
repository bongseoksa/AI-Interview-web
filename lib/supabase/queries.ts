import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { CategoryType } from "@/types/database";

// SSG 빌드 타임용 클라이언트 (서버 전용, anon key로 공개 데이터만 읽기)
function createBuildClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getAllNodes() {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("difficulty");

  if (error) throw error;
  return data!;
}

export async function getNodesByCategory(category: CategoryType) {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("difficulty");

  if (error) throw error;
  return data!;
}

export async function getNodeBySlug(slug: string) {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  return data!;
}

export async function getQuestionsByNodeId(nodeId: string) {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("node_id", nodeId);

  if (error) throw error;
  return data;
}

export async function getCategoryCounts() {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("category")
    .eq("is_active", true);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data!) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  return counts;
}
