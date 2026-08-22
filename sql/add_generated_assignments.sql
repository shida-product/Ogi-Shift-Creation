-- ============================================================
-- 生成直後スナップショット（手動修正との差分用）
-- 実行対象: Supabase SQL Editor（本番DB）
-- 現行シフト ogi_shift_assignments は手直し後の最終形のまま。
-- このテーブルは「最後にシフト生成した時点」だけを持つ。
-- 再生成するとその月のスナップショットは上書きされる。
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ogi_shift_generated_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year_month TEXT NOT NULL,
  staff_id UUID NOT NULL REFERENCES public.ogi_staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  attendance_type TEXT NOT NULL DEFAULT '平日',
  work_pattern TEXT DEFAULT '',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(staff_id, date)
);

CREATE INDEX IF NOT EXISTS idx_ogi_shift_generated_assignments_yearmonth
  ON public.ogi_shift_generated_assignments(year_month);

ALTER TABLE public.ogi_shift_generated_assignments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ogi_shift_generated_assignments'
      AND policyname = 'Allow all access to ogi_shift_generated_assignments'
  ) THEN
    CREATE POLICY "Allow all access to ogi_shift_generated_assignments"
      ON public.ogi_shift_generated_assignments
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
