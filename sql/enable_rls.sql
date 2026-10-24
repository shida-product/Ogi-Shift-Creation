-- ==============================================
-- RLS (Row Level Security) と権限の定義（本番の現状に合わせた正本）
-- ==============================================
-- 2026-10-24 に本番（shida.product）で旧定義の全許可ポリシー
-- "Allow all access to <table>" を削除し、以下へ置き換えた。
-- - アクセスできるのは Supabase Auth でログインした ogi@shift.com のみ
-- - anon（未ログイン）からはテーブル権限ごと revoke（permission denied になる）
-- - 新規サインアップは Supabase 側で無効
-- 旧定義（anon を含む全員への全件読み書き許可）は git 履歴にのみ残す。再適用しないこと。

-- 1. RLSの有効化
ALTER TABLE public.ogi_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogi_shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogi_shift_generated_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogi_monthly_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ogi_shift_requests ENABLE ROW LEVEL SECURITY;

-- 2. ogi@shift.com だけに全操作を許可
CREATE POLICY "ogi account only" ON public.ogi_staff FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ogi@shift.com') WITH CHECK ((auth.jwt() ->> 'email') = 'ogi@shift.com');
CREATE POLICY "ogi account only" ON public.ogi_shift_assignments FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ogi@shift.com') WITH CHECK ((auth.jwt() ->> 'email') = 'ogi@shift.com');
CREATE POLICY "ogi account only" ON public.ogi_shift_generated_assignments FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ogi@shift.com') WITH CHECK ((auth.jwt() ->> 'email') = 'ogi@shift.com');
CREATE POLICY "ogi account only" ON public.ogi_monthly_settings FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ogi@shift.com') WITH CHECK ((auth.jwt() ->> 'email') = 'ogi@shift.com');
CREATE POLICY "ogi account only" ON public.ogi_shift_requests FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'ogi@shift.com') WITH CHECK ((auth.jwt() ->> 'email') = 'ogi@shift.com');

-- 3. anon の権限を取り消す
REVOKE ALL ON public.ogi_staff FROM anon;
REVOKE ALL ON public.ogi_shift_assignments FROM anon;
REVOKE ALL ON public.ogi_shift_generated_assignments FROM anon;
REVOKE ALL ON public.ogi_monthly_settings FROM anon;
REVOKE ALL ON public.ogi_shift_requests FROM anon;
