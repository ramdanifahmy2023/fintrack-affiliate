import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AttendanceStatus = 'present' | 'permission' | 'sick' | 'absent';

export const useAttendance = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const todayStr = () => new Date().toISOString().split('T')[0];

  const listToday = useQuery({
    queryKey: ['attendance', 'today', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', user?.id)
        .eq('attendance_date', todayStr())
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const listRange = (start: string, end: string, employeeId?: string) => useQuery({
    queryKey: ['attendance', 'range', start, end, employeeId || user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .gte('attendance_date', start)
        .lte('attendance_date', end)
        .order('attendance_date', { ascending: false })
        .order('clock_in_time', { ascending: true })
        .filter('employee_id', 'eq', employeeId || user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id && !!start && !!end,
  });

  const clockIn = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User belum login');
      const today = todayStr();

      const { data: exist } = await supabase
        .from('attendance')
        .select('id')
        .eq('employee_id', user.id)
        .eq('attendance_date', today)
        .maybeSingle();

      if (exist) return exist; // Prevent duplicate

      const { data, error } = await supabase
        .from('attendance')
        .insert({
          employee_id: user.id,
          attendance_date: today,
          clock_in_time: new Date().toISOString(),
          status: 'present',
        })
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const manualClockOut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User belum login');
      const today = todayStr();

      const { data: attend, error } = await supabase
        .from('attendance')
        .select('id, clock_in_time, clock_out_time')
        .eq('employee_id', user.id)
        .eq('attendance_date', today)
        .maybeSingle();
      if (error) throw error;
      if (!attend) throw new Error('Belum ada data absensi hari ini');
      if (attend.clock_out_time) return attend; // already clocked out

      const clockOut = new Date();
      const clockInTime = attend.clock_in_time ? new Date(attend.clock_in_time) : new Date();
      const duration = Math.max(0, Math.round((clockOut.getTime() - clockInTime.getTime()) / 60000));

      const { data: updated, error: updErr } = await supabase
        .from('attendance')
        .update({
          clock_out_time: clockOut.toISOString(),
          work_duration_minutes: duration,
        })
        .eq('id', attend.id)
        .select('*')
        .single();

      if (updErr) throw updErr;
      return updated;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: AttendanceStatus; notes?: string }) => {
      const { data, error } = await supabase
        .from('attendance')
        .update({ status, notes })
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
    }
  });

  return { listToday, listRange, clockIn, manualClockOut, updateStatus };
};
