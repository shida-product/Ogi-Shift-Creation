-- 希望休の更新内容（期間・区分・備考・スタッフ）を各レコードに保存する。
-- Supabase SQL Editor で本番適用前に実行すること。
ALTER TABLE public.ogi_shift_requests
  ADD COLUMN IF NOT EXISTS change_history JSONB NOT NULL DEFAULT '[]'::jsonb;
