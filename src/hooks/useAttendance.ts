import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAttendance = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const listToday = useQuery({
    queryKey: ['attendance', 'today', user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', user?.id)
        .eq('attendance_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const clockIn = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User belum login');
      const today = new Date().toISOString().split('T')[0];

      // Check existing record
      const { data: exist } = await supabase
        .from('attendance')
        .select('id')
        .eq('employee_id', user.id)
        .eq('attendance_date', today)
        .maybeSingle();

      if (exist) return exist; // Prevent duplicate clock-in

      const { data, error } = await supabase
        .from('attendance')
        .insert({
          employee_id: user.id,
          attendance_date: today,
          clock_in_time: new Date().toISOString(),
          status: 'present',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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

  return { listToday, clockIn };
};
