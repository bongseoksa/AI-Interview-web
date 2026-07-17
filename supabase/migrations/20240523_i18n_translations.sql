-- i18n: 노드 및 질문 번역 테이블
-- 원문(ko)은 기존 nodes/questions 테이블에 유지, 번역본은 별도 테이블

-- 1. 노드 번역 테이블
CREATE TABLE IF NOT EXISTS node_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  content_body TEXT,
  key_keywords TEXT[],
  default_tip TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(node_id, locale)
);

-- 2. 질문 번역 테이블
CREATE TABLE IF NOT EXISTS question_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,
  question TEXT NOT NULL,
  answer_guide TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(question_id, locale)
);

-- 3. 인덱스
CREATE INDEX IF NOT EXISTS idx_node_translations_node_locale
  ON node_translations(node_id, locale);
CREATE INDEX IF NOT EXISTS idx_question_translations_question_locale
  ON question_translations(question_id, locale);

-- 4. RLS (공개 읽기)
ALTER TABLE node_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "node_translations_public_read"
  ON node_translations FOR SELECT
  USING (true);

CREATE POLICY "question_translations_public_read"
  ON question_translations FOR SELECT
  USING (true);
