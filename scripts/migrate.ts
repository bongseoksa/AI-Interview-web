/**
 * Supabase 스키마 마이그레이션 스크립트
 * 사용법: npx tsx scripts/migrate.ts
 */
import { Client } from "pg";

const SCHEMA_SQL = `
-- 1. Extensions & Types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE category_type AS ENUM (
    'html', 'css', 'javascript', 'react',
    'nextjs', 'infra_security_network', 'version_control', 'performance_seo'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Reference Data Tables
CREATE TABLE IF NOT EXISTS public.nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category category_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content_body TEXT,
    difficulty VARCHAR(20),
    key_keywords TEXT[],
    default_tip TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nodes_category ON public.nodes(category);
CREATE INDEX IF NOT EXISTS idx_nodes_slug ON public.nodes(slug);

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.nodes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer_guide TEXT,
    is_diagnostic BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_node_id ON public.questions(node_id);

-- 3. User Data Tables
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    node_id UUID REFERENCES public.nodes(id) ON DELETE CASCADE,
    mastery_level INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, node_id)
);

-- 4. RLS
GRANT SELECT ON public.nodes TO anon;
GRANT SELECT ON public.nodes TO authenticated;
GRANT SELECT ON public.questions TO anon;
GRANT SELECT ON public.questions TO authenticated;

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
`;

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL 환경변수가 필요합니다.");
    console.error(
      "예: DATABASE_URL='<your-supabase-connection-string>' npx tsx scripts/migrate.ts"
    );
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    console.log("Supabase DB 연결 중...");
    await client.connect();
    console.log("연결 성공. 스키마 마이그레이션 실행...");

    await client.query(SCHEMA_SQL);
    console.log("스키마 마이그레이션 완료!");

    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log("\n생성된 테이블:");
    rows.forEach((r) => console.log(`  - ${r.table_name}`));
  } catch (err) {
    console.error("마이그레이션 실패:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
