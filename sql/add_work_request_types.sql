-- ============================================================
-- ogi_shift_requests に「勤務（恵比寿）」「勤務（渋谷）」を追加
-- 実行対象: Supabase SQL Editor（本番DB）
-- 内容: request_type の CHECK 制約に work_ebisu / work_shibuya を追加
-- ============================================================

-- 既存の request_type の CHECK 制約を、制約名に依存せず確実に削除する
DO $$
DECLARE c record;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.ogi_shift_requests'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%request_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.ogi_shift_requests DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE public.ogi_shift_requests
  ADD CONSTRAINT ogi_shift_requests_request_type_check
  CHECK (request_type IN ('off', 'am', 'pm', 'other', 'dispense', 'ringo', 'work_ebisu', 'work_shibuya'));
