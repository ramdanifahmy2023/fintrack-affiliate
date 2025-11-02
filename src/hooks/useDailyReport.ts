import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { addMinutes, formatISO, startOfDay } from 'date-fns';

export interface DailyReportForm {
  report_date: string; // yyyy-mm-dd
  shift: 1 | 2 | 3;
  group_id: string;
  device_id: string;
  account_id: string;
  product_category: string;
  live_status: 'lancar' | 'mati' | 'relive';
  starting_sales: number;
  ending_sales: number;
  total_sales?: number;
  opening_balance: number;
  closing_balance: number;
  total_revenue: number;
  gross_commission: number;
  notes?: string;
}

export const usePreviousShiftClosing = (reportDate: string, shift: 1 | 2 | 3, groupId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['prev-shift', reportDate, shift, groupId, user?.id],
    queryFn: async () => {
      // Determine previous shift and date
      let prevShift: 1 | 2 | 3 = (shift === 1 ? 3 : (shift - 1)) as 1 | 2 | 3;
      let prevDate = reportDate;
      if (shift === 1) {
        const d = new Date(reportDate);
        d.setDate(d.getDate() - 1);
        prevDate = d.toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('daily_reports')
        .select('closing_balance')
        .eq('group_id', groupId)
        .eq('report_date', prevDate)
        .eq('shift', prevShift)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data?.closing_balance ?? 0;
    },
    enabled: !!reportDate && !!shift && !!groupId && !!user,
  });
};

export const useSubmitDailyReport = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (payload: DailyReportForm) => {
      if (!user) throw new Error('User belum login');

      const total_sales = payload.ending_sales - payload.starting_sales;

      // Insert daily report
      const { data: report, error: repErr } = await supabase
        .from('daily_reports')
        .insert({
          report_date: payload.report_date,
          shift: payload.shift,
          group_id: payload.group_id,
          device_id: payload.device_id,
          account_id: payload.account_id,
          product_category: payload.product_category,
          live_status: payload.live_status,
          starting_sales: payload.starting_sales,
          ending_sales: payload.ending_sales,
          total_sales,
          opening_balance: payload.opening_balance,
          closing_balance: payload.closing_balance,
          total_revenue: payload.total_revenue,
          gross_commission: payload.gross_commission,
          notes: payload.notes,
          employee_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (repErr) throw repErr;

      // Auto clock-out attendance for the same day if not set yet
      const today = payload.report_date;
      const { data: attend, error: attErr } = await supabase
        .from('attendance')
        .select('id, clock_in_time, clock_out_time')
        .eq('employee_id', user.id)
        .eq('attendance_date', today)
        .maybeSingle();

      if (attErr) throw attErr;

      if (attend && !attend.clock_out_time) {
        // Set clock_out_time to now and compute duration
        const clockOut = new Date();
        const clockIn = attend.clock_in_time ? new Date(attend.clock_in_time) : startOfDay(new Date(today));
        const duration = Math.max(0, Math.round((clockOut.getTime() - clockIn.getTime()) / 60000));

        const { error: updErr } = await supabase
          .from('attendance')
          .update({
            clock_out_time: formatISO(clockOut),
            work_duration_minutes: duration,
            updated_at: new Date().toISOString(),
          })
          .eq('id', attend.id);

        if (updErr) throw updErr;
      }

      return report;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-reports'] });
      qc.invalidateQueries({ queryKey: ['attendance'] });
    }
  });
};
