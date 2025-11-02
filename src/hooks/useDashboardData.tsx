import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

interface DashboardMetrics {
  totalCommissionGross: number;
  totalCommissionNet: number;
  totalCommissionDisbursed: number;
  totalExpenses: number;
  totalEmployees: number;
  totalGroups: number;
  previousMonthMetrics: {
    totalCommissionGross: number;
    totalCommissionNet: number;
    totalCommissionDisbursed: number;
    totalExpenses: number;
  };
}

interface ChartData {
  salesTrend: Array<{
    date: string;
    sales: number;
    target: number;
  }>;
  commissionBreakdown: Array<{
    name: string;
    kotor: number;
    bersih: number;
    cair: number;
  }>;
  groupPerformance: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  accountPerformance: Array<{
    platform: string;
    active: number;
    total: number;
  }>;
}

export const useDashboardMetrics = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  const currentMonth = dateRange?.start || startOfMonth(new Date());
  const currentMonthEnd = dateRange?.end || endOfMonth(new Date());
  const previousMonthStart = startOfMonth(subMonths(currentMonth, 1));
  const previousMonthEnd = endOfMonth(subMonths(currentMonth, 1));

  return useQuery({
    queryKey: ['dashboard-metrics', currentMonth.toISOString(), user?.id],
    queryFn: async (): Promise<DashboardMetrics> => {
      if (!user) throw new Error('User not authenticated');

      // Get current month commissions
      const { data: currentCommissions } = await supabase
        .from('commissions')
        .select('gross_commission, net_commission, disbursed_commission')
        .gte('commission_date', currentMonth.toISOString().split('T')[0])
        .lte('commission_date', currentMonthEnd.toISOString().split('T')[0]);

      // Get previous month commissions for comparison
      const { data: previousCommissions } = await supabase
        .from('commissions')
        .select('gross_commission, net_commission, disbursed_commission')
        .gte('commission_date', previousMonthStart.toISOString().split('T')[0])
        .lte('commission_date', previousMonthEnd.toISOString().split('T')[0]);

      // Get current month expenses
      const { data: currentExpenses } = await supabase
        .from('cashflow')
        .select('amount')
        .eq('type', 'expense')
        .gte('transaction_date', currentMonth.toISOString().split('T')[0])
        .lte('transaction_date', currentMonthEnd.toISOString().split('T')[0]);

      // Get previous month expenses
      const { data: previousExpenses } = await supabase
        .from('cashflow')
        .select('amount')
        .eq('type', 'expense')
        .gte('transaction_date', previousMonthStart.toISOString().split('T')[0])
        .lte('transaction_date', previousMonthEnd.toISOString().split('T')[0]);

      // Get total employees
      const { count: totalEmployees } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total groups
      const { count: totalGroups } = await supabase
        .from('groups')
        .select('*', { count: 'exact', head: true });

      // Calculate current month totals
      const totalCommissionGross = currentCommissions?.reduce(
        (sum, comm) => sum + (comm.gross_commission || 0), 0
      ) || 0;

      const totalCommissionNet = currentCommissions?.reduce(
        (sum, comm) => sum + (comm.net_commission || 0), 0
      ) || 0;

      const totalCommissionDisbursed = currentCommissions?.reduce(
        (sum, comm) => sum + (comm.disbursed_commission || 0), 0
      ) || 0;

      const totalExpenses = currentExpenses?.reduce(
        (sum, exp) => sum + (exp.amount || 0), 0
      ) || 0;

      // Calculate previous month totals
      const previousCommissionGross = previousCommissions?.reduce(
        (sum, comm) => sum + (comm.gross_commission || 0), 0
      ) || 0;

      const previousCommissionNet = previousCommissions?.reduce(
        (sum, comm) => sum + (comm.net_commission || 0), 0
      ) || 0;

      const previousCommissionDisbursed = previousCommissions?.reduce(
        (sum, comm) => sum + (comm.disbursed_commission || 0), 0
      ) || 0;

      const previousExpensesTotal = previousExpenses?.reduce(
        (sum, exp) => sum + (exp.amount || 0), 0
      ) || 0;

      return {
        totalCommissionGross,
        totalCommissionNet,
        totalCommissionDisbursed,
        totalExpenses,
        totalEmployees: totalEmployees || 0,
        totalGroups: totalGroups || 0,
        previousMonthMetrics: {
          totalCommissionGross: previousCommissionGross,
          totalCommissionNet: previousCommissionNet,
          totalCommissionDisbursed: previousCommissionDisbursed,
          totalExpenses: previousExpensesTotal,
        }
      };
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardCharts = (dateRange?: { start: Date; end: Date }) => {
  const { user } = useAuth();
  
  const currentMonth = dateRange?.start || startOfMonth(new Date());
  const currentMonthEnd = dateRange?.end || endOfMonth(new Date());

  return useQuery({
    queryKey: ['dashboard-charts', currentMonth.toISOString(), user?.id],
    queryFn: async (): Promise<ChartData> => {
      if (!user) throw new Error('User not authenticated');

      // Sales trend from daily reports
      const { data: dailyReports } = await supabase
        .from('daily_reports')
        .select('report_date, total_sales')
        .gte('report_date', currentMonth.toISOString().split('T')[0])
        .lte('report_date', currentMonthEnd.toISOString().split('T')[0])
        .order('report_date');

      // Commission breakdown by period
      const { data: commissionData } = await supabase
        .from('commissions')
        .select('period_week, gross_commission, net_commission, disbursed_commission')
        .gte('commission_date', currentMonth.toISOString().split('T')[0])
        .lte('commission_date', currentMonthEnd.toISOString().split('T')[0]);

      // Group performance
      const { data: groupData } = await supabase
        .from('groups')
        .select(`
          name,
          daily_reports!inner(
            total_sales
          )
        `)
        .gte('daily_reports.report_date', currentMonth.toISOString().split('T')[0])
        .lte('daily_reports.report_date', currentMonthEnd.toISOString().split('T')[0]);

      // Account performance by platform
      const { data: accountData } = await supabase
        .from('accounts')
        .select('platform, account_status');

      // Transform data for charts
      const salesTrend = dailyReports?.map(report => ({
        date: report.report_date,
        sales: report.total_sales || 0,
        target: 1000000 // Default target, should come from KPI settings
      })) || [];

      const commissionBreakdown = commissionData?.reduce((acc, comm) => {
        const existing = acc.find(item => item.name === comm.period_week);
        if (existing) {
          existing.kotor += comm.gross_commission || 0;
          existing.bersih += comm.net_commission || 0;
          existing.cair += comm.disbursed_commission || 0;
        } else {
          acc.push({
            name: comm.period_week || 'Unknown',
            kotor: comm.gross_commission || 0,
            bersih: comm.net_commission || 0,
            cair: comm.disbursed_commission || 0
          });
        }
        return acc;
      }, [] as any[]) || [];

      // Group performance calculation
      const groupPerformance = groupData?.map(group => {
        const totalSales = (group as any).daily_reports?.reduce(
          (sum: number, report: any) => sum + (report.total_sales || 0), 0
        ) || 0;
        return {
          name: group.name,
          value: totalSales,
          percentage: 0 // Will be calculated in component
        };
      }) || [];

      // Account performance by platform
      const platformCounts = accountData?.reduce((acc, account) => {
        if (!acc[account.platform]) {
          acc[account.platform] = { active: 0, total: 0 };
        }
        acc[account.platform].total++;
        if (account.account_status === 'active') {
          acc[account.platform].active++;
        }
        return acc;
      }, {} as Record<string, { active: number; total: number }>) || {};

      const accountPerformance = Object.entries(platformCounts).map(([platform, counts]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        active: counts.active,
        total: counts.total
      }));

      return {
        salesTrend,
        commissionBreakdown,
        groupPerformance,
        accountPerformance
      };
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};