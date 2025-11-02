import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfWeek, getWeek, startOfMonth, endOfMonth } from 'date-fns';

export type PeriodWeek = 'M1' | 'M2' | 'M3' | 'M4' | 'M5';

export interface CommissionForm {
  account_id: string;
  period_week: PeriodWeek;
  period_month: number;
  period_year: number;
  commission_date: string; // yyyy-mm-dd
  gross_commission: number;
  net_commission: number;
  disbursed_commission: number;
  disbursement_date?: string; // yyyy-mm-dd
  commission_rate?: number;
  notes?: string;
}

export interface CommissionSummary {
  totalGross: number;
  totalNet: number;
  totalDisbursed: number;
  totalPending: number;
  count: number;
}

// Helper: Calculate period week from date
export const calculatePeriodWeek = (date: Date): PeriodWeek => {
  const monthStart = startOfMonth(date);
  const weekOfMonth = Math.ceil(date.getDate() / 7);
  
  // M1-M5 mapping based on week of month
  if (weekOfMonth <= 1) return 'M1';
  if (weekOfMonth <= 2) return 'M2';
  if (weekOfMonth <= 3) return 'M3';
  if (weekOfMonth <= 4) return 'M4';
  return 'M5';
};

export const useCommissionData = (year: number, month: number, filters?: {
  groupId?: string;
  accountId?: string;
  employeeId?: string;
}) => {
  const { user } = useAuth();
  
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  return useQuery({
    queryKey: ['commissions', year, month, filters, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('commissions')
        .select(`
          *,
          accounts(id, username, platform, email),
          profiles!commissions_employee_id_fkey(full_name, role),
          groups(name)
        `)
        .gte('commission_date', startDate)
        .lte('commission_date', endDate)
        .order('commission_date', { ascending: false })
        .order('period_week', { ascending: true });

      if (filters?.groupId) {
        query = query.eq('group_id', filters.groupId);
      }
      if (filters?.accountId) {
        query = query.eq('account_id', filters.accountId);
      }
      if (filters?.employeeId) {
        query = query.eq('employee_id', filters.employeeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!user && !!year && !!month,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCommissionSummary = (year: number, month: number, filters?: {
  groupId?: string;
  accountId?: string;
  employeeId?: string;
}) => {
  const commissionQuery = useCommissionData(year, month, filters);
  
  const summary: CommissionSummary = {
    totalGross: 0,
    totalNet: 0, 
    totalDisbursed: 0,
    totalPending: 0,
    count: 0
  };

  if (commissionQuery.data) {
    const data = commissionQuery.data;
    summary.count = data.length;
    summary.totalGross = data.reduce((sum, c) => sum + (c.gross_commission || 0), 0);
    summary.totalNet = data.reduce((sum, c) => sum + (c.net_commission || 0), 0);
    summary.totalDisbursed = data.reduce((sum, c) => sum + (c.disbursed_commission || 0), 0);
    summary.totalPending = summary.totalNet - summary.totalDisbursed;
  }

  return {
    ...commissionQuery,
    data: summary
  };
};

export const useCreateCommission = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: CommissionForm) => {
      if (!user) throw new Error('User belum login');

      const { data, error } = await supabase
        .from('commissions')
        .insert({
          account_id: payload.account_id,
          period_week: payload.period_week,
          period_month: payload.period_month,
          period_year: payload.period_year,
          commission_date: payload.commission_date,
          gross_commission: payload.gross_commission,
          net_commission: payload.net_commission,
          disbursed_commission: payload.disbursed_commission,
          disbursement_date: payload.disbursement_date,
          commission_rate: payload.commission_rate,
          notes: payload.notes,
          employee_id: user.id,
          group_id: user.profile?.group_id,
          created_by: user.id,
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commissions'] });
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    }
  });
};

export const useUpdateCommission = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CommissionForm> }) => {
      const { data, error } = await supabase
        .from('commissions')
        .update({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commissions'] });
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    }
  });
};

export const useDeleteCommission = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('commissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commissions'] });
      qc.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    }
  });
};