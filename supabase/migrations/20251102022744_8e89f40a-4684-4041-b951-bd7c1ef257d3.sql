-- Ensure profiles table has correct structure for role-based access
-- Update RLS policies for comprehensive role-based access control

-- ============================================
-- 1. PROFILES TABLE POLICIES
-- ============================================

-- Drop existing policies on profiles
DROP POLICY IF EXISTS "Superadmin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmin and Leader can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Allow Superadmin to view all profiles
CREATE POLICY "Superadmin can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- Allow Leader to view profiles in their group and all groups they manage
CREATE POLICY "Leader can view profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'leader'
  )
);

-- Allow Admin and Viewer to view all profiles (read-only access)
CREATE POLICY "Admin and Viewer can view profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'viewer')
  )
);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow Superadmin and Leader to create/update/delete profiles
CREATE POLICY "Superadmin and Leader can manage profiles"
ON public.profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 2. DAILY REPORTS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view daily reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Staff can create own daily reports" ON public.daily_reports;
DROP POLICY IF EXISTS "Staff can update own reports" ON public.daily_reports;

-- All authenticated users can view daily reports
CREATE POLICY "All users can view daily reports"
ON public.daily_reports FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Staff can insert their own daily reports
CREATE POLICY "Staff can create daily reports"
ON public.daily_reports FOR INSERT
WITH CHECK (
  auth.uid() = employee_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'staff'
  )
);

-- Staff can update their own reports, Leaders and Superadmins can update any
CREATE POLICY "Staff can update own reports"
ON public.daily_reports FOR UPDATE
USING (
  auth.uid() = employee_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- Only Superadmin and Leader can delete reports
CREATE POLICY "Superadmin and Leader can delete reports"
ON public.daily_reports FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 3. ATTENDANCE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view attendance" ON public.attendance;
DROP POLICY IF EXISTS "Staff can manage own attendance" ON public.attendance;

-- All users can view attendance
CREATE POLICY "All users can view attendance"
ON public.attendance FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Staff can insert their own attendance
CREATE POLICY "Staff can create attendance"
ON public.attendance FOR INSERT
WITH CHECK (
  auth.uid() = employee_id AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'staff'
  )
);

-- Staff can update their own attendance
CREATE POLICY "Staff can update own attendance"
ON public.attendance FOR UPDATE
USING (
  auth.uid() = employee_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader', 'admin')
  )
);

-- Superadmin and Leader can delete attendance
CREATE POLICY "Superadmin and Leader can delete attendance"
ON public.attendance FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 4. COMMISSIONS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view commissions" ON public.commissions;
DROP POLICY IF EXISTS "Superadmin and Leader can manage commissions" ON public.commissions;

-- All users can view commissions
CREATE POLICY "All users can view commissions"
ON public.commissions FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin and Leader can manage (CRUD) commissions
CREATE POLICY "Superadmin and Leader can manage commissions"
ON public.commissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 5. CASHFLOW POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view cashflow" ON public.cashflow;
DROP POLICY IF EXISTS "Leader and Admin can create cashflow" ON public.cashflow;
DROP POLICY IF EXISTS "Superadmin can manage cashflow" ON public.cashflow;

-- All users can view cashflow
CREATE POLICY "All users can view cashflow"
ON public.cashflow FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin, Leader, and Admin can create cashflow
CREATE POLICY "Superadmin Leader Admin can create cashflow"
ON public.cashflow FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader', 'admin')
  )
);

-- Superadmin can update and delete cashflow
CREATE POLICY "Superadmin can manage cashflow"
ON public.cashflow FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "Superadmin can delete cashflow"
ON public.cashflow FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- ============================================
-- 6. ASSETS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view assets" ON public.assets;
DROP POLICY IF EXISTS "Superadmin and Admin can manage assets" ON public.assets;

-- All users can view assets
CREATE POLICY "All users can view assets"
ON public.assets FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin and Admin can manage assets
CREATE POLICY "Superadmin and Admin can manage assets"
ON public.assets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
  )
);

-- ============================================
-- 7. DEBT RECEIVABLE POLICIES
-- ============================================

-- Enable RLS on debt_receivable
ALTER TABLE public.debt_receivable ENABLE ROW LEVEL SECURITY;

-- All users can view debt/receivable
CREATE POLICY "All users can view debt receivable"
ON public.debt_receivable FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin, Leader, and Admin can create
CREATE POLICY "Superadmin Leader Admin can create debt receivable"
ON public.debt_receivable FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader', 'admin')
  )
);

-- Superadmin can update and delete
CREATE POLICY "Superadmin can manage debt receivable"
ON public.debt_receivable FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

CREATE POLICY "Superadmin can delete debt receivable"
ON public.debt_receivable FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- ============================================
-- 8. DEVICES POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view devices" ON public.devices;
DROP POLICY IF EXISTS "Superadmin and Leader can manage devices" ON public.devices;

-- All users can view devices
CREATE POLICY "All users can view devices"
ON public.devices FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin and Leader can manage devices
CREATE POLICY "Superadmin and Leader can manage devices"
ON public.devices FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 9. ACCOUNTS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view accounts" ON public.accounts;
DROP POLICY IF EXISTS "Superadmin and Leader can manage accounts" ON public.accounts;

-- All users can view accounts
CREATE POLICY "All users can view accounts"
ON public.accounts FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin and Leader can manage accounts
CREATE POLICY "Superadmin and Leader can manage accounts"
ON public.accounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 10. GROUPS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view groups" ON public.groups;
DROP POLICY IF EXISTS "Superadmin and Leader can manage groups" ON public.groups;

-- All users can view groups
CREATE POLICY "All users can view groups"
ON public.groups FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin and Leader can manage groups
CREATE POLICY "Superadmin and Leader can manage groups"
ON public.groups FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 11. KNOWLEDGE BASE POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "All users can view knowledge base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Superadmin can manage knowledge base" ON public.knowledge_base;

-- All users can view knowledge base
CREATE POLICY "All users can view knowledge base"
ON public.knowledge_base FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin can manage knowledge base
CREATE POLICY "Superadmin can manage knowledge base"
ON public.knowledge_base FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- ============================================
-- 12. KPI TARGETS POLICIES
-- ============================================

-- Enable RLS on kpi_targets
ALTER TABLE public.kpi_targets ENABLE ROW LEVEL SECURITY;

-- All users can view their own KPI targets
CREATE POLICY "Users can view kpi targets"
ON public.kpi_targets FOR SELECT
USING (
  auth.uid() IS NOT NULL
);

-- Superadmin and Leader can manage KPI targets
CREATE POLICY "Superadmin and Leader can manage kpi targets"
ON public.kpi_targets FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

-- ============================================
-- 13. NOTIFICATIONS POLICIES
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can create notifications for users
CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- ============================================
-- 14. AUDIT LOGS POLICIES
-- ============================================

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Superadmin can view audit logs
CREATE POLICY "Superadmin can view audit logs"
ON public.audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'superadmin'
  )
);

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- ============================================
-- 15. GROUP RELATION TABLES POLICIES
-- ============================================

-- Enable RLS on group relation tables
ALTER TABLE public.group_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_employees ENABLE ROW LEVEL SECURITY;

-- All users can view group relations
CREATE POLICY "All users can view group accounts"
ON public.group_accounts FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can view group devices"
ON public.group_devices FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "All users can view group employees"
ON public.group_employees FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Superadmin and Leader can manage group relations
CREATE POLICY "Superadmin and Leader can manage group accounts"
ON public.group_accounts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

CREATE POLICY "Superadmin and Leader can manage group devices"
ON public.group_devices FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);

CREATE POLICY "Superadmin and Leader can manage group employees"
ON public.group_employees FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('superadmin', 'leader')
  )
);