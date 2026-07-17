-- M5: user_progress RLS policies
-- user_progress 테이블에 unique constraint 추가 (upsert onConflict용)
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_node_unique UNIQUE (user_id, node_id);

-- RLS 활성화
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 본인 데이터만 조회 가능
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

-- 본인 데이터만 삽입 가능
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 데이터만 수정 가능
CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- 본인 데이터만 삭제 가능
CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  USING (auth.uid() = user_id);
