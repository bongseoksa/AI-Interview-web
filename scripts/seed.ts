/**
 * Supabase 시드 스크립트 — Notion Q&A JSON → Supabase nodes + questions
 * 사용법: npx tsx scripts/seed.ts
 *
 * 의존성: @supabase/supabase-js (이미 설치됨)
 * 환경변수: .env.local에서 NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 읽음
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// .env.local 수동 파싱 (dotenv 의존성 없이)
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const envVars: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  envVars[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// 카테고리 한글 → category_type ENUM 매핑
const CATEGORY_MAP: Record<string, string> = {
  HTML: "html",
  CSS: "css",
  JavaScript: "javascript",
  React: "react",
  "Next.js": "nextjs",
  "인프라/보안/네트워크": "infra_security_network",
  "형상관리(Git/CI-CD)": "version_control",
  "형상관리": "version_control",
  "성능/SEO": "performance_seo",
  "AI/LLM 통합": "ai_llm",
};

// 난이도 매핑
const DIFFICULTY_MAP: Record<string, string> = {
  주니어: "junior",
  미드: "mid",
  시니어: "senior",
};

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

interface SeedItem {
  title: string;
  category: string;
  difficulty: string;
  answer_guide: string;
  keywords: string;
}

async function main() {
  const dataPath = resolve(__dirname, "seed-data.json");
  const items: SeedItem[] = JSON.parse(readFileSync(dataPath, "utf-8"));
  console.log(`시드 데이터 ${items.length}개 로드 완료`);

  let nodeCount = 0;
  let questionCount = 0;
  let errorCount = 0;

  for (const item of items) {
    const category = CATEGORY_MAP[item.category];
    if (!category) {
      console.error(`알 수 없는 카테고리: ${item.category}`);
      errorCount++;
      continue;
    }

    const difficulty = DIFFICULTY_MAP[item.difficulty] || item.difficulty;
    const slug = toSlug(item.title);
    const keywords = item.keywords
      ? item.keywords.split(/[,，]/).map((k) => k.trim()).filter(Boolean)
      : [];

    // 1. nodes 테이블 upsert (slug 기준)
    const { data: node, error: nodeError } = await supabase
      .from("nodes")
      .upsert(
        {
          category,
          title: item.title,
          slug,
          content_body: item.answer_guide,
          difficulty,
          key_keywords: keywords,
          default_tip: keywords.length > 0
            ? `핵심 키워드: ${keywords.slice(0, 3).join(", ")}`
            : null,
          is_active: true,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (nodeError) {
      console.error(`[nodes] ${item.title}: ${nodeError.message}`);
      errorCount++;
      continue;
    }

    nodeCount++;

    // 2. questions 테이블 insert (node_id 연결)
    const { error: qError } = await supabase.from("questions").upsert(
      {
        node_id: node.id,
        question: item.title,
        answer_guide: item.answer_guide,
        is_diagnostic: true,
      },
      { onConflict: "node_id" }
    );

    if (qError) {
      // questions에 unique constraint가 없으면 insert로 폴백
      const { error: insertError } = await supabase.from("questions").insert({
        node_id: node.id,
        question: item.title,
        answer_guide: item.answer_guide,
        is_diagnostic: true,
      });

      if (insertError) {
        console.error(`[questions] ${item.title}: ${insertError.message}`);
        errorCount++;
        continue;
      }
    }

    questionCount++;
  }

  console.log(`\n시드 완료:`);
  console.log(`  nodes: ${nodeCount}개 upsert`);
  console.log(`  questions: ${questionCount}개 insert`);
  if (errorCount > 0) console.log(`  errors: ${errorCount}개`);

  // 검증
  const { count: nodesTotal } = await supabase
    .from("nodes")
    .select("*", { count: "exact", head: true });
  const { count: questionsTotal } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true });
  console.log(`\nDB 검증: nodes=${nodesTotal}, questions=${questionsTotal}`);
}

main().catch(console.error);
