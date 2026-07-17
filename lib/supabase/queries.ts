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

export async function getNodesByCategory(category: CategoryType, locale?: string) {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("difficulty");

  if (error) throw error;
  const nodes = data!;

  if (!locale || locale === "ko") return nodes;

  // 번역본 일괄 조회
  const nodeIds = nodes.map((n) => n.id);
  const { data: translations } = await supabase
    .from("node_translations")
    .select("node_id, title, key_keywords")
    .eq("locale", locale)
    .in("node_id", nodeIds);

  if (!translations || translations.length === 0) return nodes;

  const transMap = new Map(translations.map((t) => [t.node_id, t]));
  return nodes.map((node) => {
    const tr = transMap.get(node.id);
    if (!tr) return node;
    return {
      ...node,
      title: tr.title || node.title,
      key_keywords: tr.key_keywords || node.key_keywords,
    };
  });
}

export async function getNodeBySlug(slug: string, locale?: string) {
  const supabase = createBuildClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) throw error;
  const node = data!;

  // ko(기본 언어)이거나 locale 미지정이면 원문 반환
  if (!locale || locale === "ko") return node;

  // 번역본 조회 시도
  const { data: translation } = await supabase
    .from("node_translations")
    .select("title, content_body, key_keywords, default_tip")
    .eq("node_id", node.id)
    .eq("locale", locale)
    .single();

  if (translation) {
    return {
      ...node,
      title: translation.title || node.title,
      content_body: translation.content_body || node.content_body,
      key_keywords: translation.key_keywords || node.key_keywords,
      default_tip: translation.default_tip || node.default_tip,
    };
  }

  return node;
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

export interface DiagnosticQuestionWithNode {
  id: string;
  question: string;
  node_id: string;
  category: CategoryType;
  difficulty: string;
  node_title: string;
  node_slug: string;
}

export async function getDiagnosticQuestions(locale?: string): Promise<DiagnosticQuestionWithNode[]> {
  const supabase = createBuildClient();

  // 1) 모든 노드를 가져온다
  const { data: nodes, error: nError } = await supabase
    .from("nodes")
    .select("id, category, difficulty, title, slug")
    .eq("is_active", true);

  if (nError) throw nError;

  // 카테고리당 주니어 노드 1개 선택
  const nodeByCategory: Record<string, (typeof nodes)[number]> = {};
  for (const node of nodes!) {
    const cat = node.category;
    if (!nodeByCategory[cat] || node.difficulty === "junior") {
      nodeByCategory[cat] = node;
    }
  }

  const selectedNodeIds = Object.values(nodeByCategory).map((n) => n.id);

  // 2) 선택된 노드들의 진단 질문을 가져온다
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("id, question, node_id")
    .eq("is_diagnostic", true)
    .in("node_id", selectedNodeIds);

  if (qError) throw qError;

  // 노드별 첫 번째 질문만 사용
  const questionByNodeId: Record<string, (typeof questions)[number]> = {};
  for (const q of questions!) {
    if (!questionByNodeId[q.node_id]) {
      questionByNodeId[q.node_id] = q;
    }
  }

  // 3) 번역 적용
  const result = Object.entries(nodeByCategory)
    .map(([, node]) => {
      const q = questionByNodeId[node.id];
      if (!q) return null;
      return {
        id: q.id,
        question: q.question,
        node_id: q.node_id,
        category: node.category as CategoryType,
        difficulty: node.difficulty || "junior",
        node_title: node.title,
        node_slug: node.slug,
      };
    })
    .filter((x): x is DiagnosticQuestionWithNode => x !== null);

  if (!locale || locale === "ko") return result;

  // 질문 번역 조회
  const questionIds = result.map((r) => r.id);
  const { data: qTranslations } = await supabase
    .from("question_translations")
    .select("question_id, question")
    .eq("locale", locale)
    .in("question_id", questionIds);

  // 노드 제목 번역 조회
  const nodeIds = result.map((r) => r.node_id);
  const { data: nTranslations } = await supabase
    .from("node_translations")
    .select("node_id, title")
    .eq("locale", locale)
    .in("node_id", nodeIds);

  const qtMap = new Map(qTranslations?.map((t) => [t.question_id, t.question]) ?? []);
  const ntMap = new Map(nTranslations?.map((t) => [t.node_id, t.title]) ?? []);

  return result.map((r) => ({
    ...r,
    question: qtMap.get(r.id) || r.question,
    node_title: ntMap.get(r.node_id) || r.node_title,
  }));
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
