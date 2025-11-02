import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CommissionForm as FormData, PeriodWeek, calculatePeriodWeek, useCreateCommission, useUpdateCommission } from '@/hooks/useCommission';
import { toast } from 'sonner';
import { format } from 'date-fns';

const schema = z.object({
  account_id: z.string().uuid('Akun wajib dipilih'),
  commission_date: z.string().min(10, 'Tanggal komisi wajib diisi'),
  period_week: z.enum(['M1', 'M2', 'M3', 'M4', 'M5']),
  gross_commission: z.coerce.number().min(0, 'Komisi kotor harus >= 0'),
  net_commission: z.coerce.number().min(0, 'Komisi bersih harus >= 0'),
  disbursed_commission: z.coerce.number().min(0, 'Komisi cair harus >= 0'),
  disbursement_date: z.string().optional(),
  commission_rate: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional(),
}).refine((data) => data.net_commission <= data.gross_commission, {
  message: 'Komisi bersih harus <= komisi kotor',
  path: ['net_commission']
}).refine((data) => data.disbursed_commission <= data.net_commission, {
  message: 'Komisi cair harus <= komisi bersih',
  path: ['disbursed_commission']
});

interface CommissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: any;
  currentMonth: number;
  currentYear: number;
}

export const CommissionForm = ({ open, onOpenChange, editData, currentMonth, currentYear }: CommissionFormProps) => {
  const createCommission = useCreateCommission();
  const updateCommission = useUpdateCommission();
  const [manualPeriod, setManualPeriod] = useState(false);

  // Load accounts for dropdown
  const { data: accounts } = useQuery({
    queryKey: ['accounts-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, username, platform, email')
        .eq('account_status', 'active')
        .order('platform')
        .order('username');
      if (error) throw error;
      return data || [];
    }
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      commission_date: format(new Date(), 'yyyy-MM-dd'),
      period_week: 'M1',
      gross_commission: 0,
      net_commission: 0,
      disbursed_commission: 0,
    }
  });

  // Auto-calculate period when date changes
  const commissionDate = form.watch('commission_date');
  useEffect(() => {
    if (commissionDate && !manualPeriod) {
      const date = new Date(commissionDate);
      const autoPeriod = calculatePeriodWeek(date);
      form.setValue('period_week', autoPeriod);
    }
  }, [commissionDate, manualPeriod, form]);

  // Load edit data
  useEffect(() => {
    if (editData) {
      form.reset({
        account_id: editData.account_id,
        commission_date: editData.commission_date,
        period_week: editData.period_week,
        gross_commission: editData.gross_commission || 0,
        net_commission: editData.net_commission || 0,
        disbursed_commission: editData.disbursed_commission || 0,
        disbursement_date: editData.disbursement_date || '',
        commission_rate: editData.commission_rate || 0,
        notes: editData.notes || '',
      });
      setManualPeriod(true); // Keep existing period when editing
    } else {
      form.reset({
        commission_date: format(new Date(), 'yyyy-MM-dd'),
        period_week: 'M1',
        gross_commission: 0,
        net_commission: 0,
        disbursed_commission: 0,
      });
      setManualPeriod(false);
    }
  }, [editData, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const date = new Date(values.commission_date);
      const payload: FormData = {
        ...values,
        period_month: date.getMonth() + 1,
        period_year: date.getFullYear(),
      };

      if (editData) {
        await updateCommission.mutateAsync({ id: editData.id, payload });
        toast.success('Data komisi berhasil diperbarui');
      } else {
        await createCommission.mutateAsync(payload);
        toast.success('Data komisi berhasil ditambahkan');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan data komisi');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Komisi' : 'Tambah Data Komisi'}</DialogTitle>
          <DialogDescription>
            {editData ? 'Perbarui data komisi affiliate' : 'Input data komisi affiliate baru'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Selection */}
          <div className="md:col-span-2">
            <Label>Akun Affiliate *</Label>
            <Select onValueChange={(v) => form.setValue('account_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih akun affiliate" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.username} ({account.platform}) - {account.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.account_id && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.account_id.message}</p>
            )}
          </div>

          {/* Date & Period */}
          <div>
            <Label>Tanggal Komisi *</Label>
            <Input type="date" {...form.register('commission_date')} />
            {form.formState.errors.commission_date && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.commission_date.message}</p>
            )}
          </div>
          
          <div>
            <Label className="flex items-center gap-2">
              Periode Minggu *
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setManualPeriod(!manualPeriod)}
                className="h-6 text-xs px-2"
              >
                {manualPeriod ? 'Auto' : 'Manual'}
              </Button>
            </Label>
            <Select 
              onValueChange={(v) => form.setValue('period_week', v as PeriodWeek)}
              value={form.watch('period_week')}
              disabled={!manualPeriod}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M1">M1 (Minggu 1)</SelectItem>
                <SelectItem value="M2">M2 (Minggu 2)</SelectItem>
                <SelectItem value="M3">M3 (Minggu 3)</SelectItem>
                <SelectItem value="M4">M4 (Minggu 4)</SelectItem>
                <SelectItem value="M5">M5 (Minggu 5)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Commission Amounts */}
          <div>
            <Label>Komisi Kotor (Rp) *</Label>
            <Input type="number" min={0} step="0.01" {...form.register('gross_commission')} />
            {form.formState.errors.gross_commission && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.gross_commission.message}</p>
            )}
          </div>
          
          <div>
            <Label>Komisi Bersih (Rp) *</Label>
            <Input type="number" min={0} step="0.01" {...form.register('net_commission')} />
            {form.formState.errors.net_commission && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.net_commission.message}</p>
            )}
          </div>
          
          <div>
            <Label>Komisi Cair (Rp) *</Label>
            <Input type="number" min={0} step="0.01" {...form.register('disbursed_commission')} />
            {form.formState.errors.disbursed_commission && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.disbursed_commission.message}</p>
            )}
          </div>
          
          <div>
            <Label>Tanggal Pencairan</Label>
            <Input type="date" {...form.register('disbursement_date')} />
          </div>

          {/* Commission Rate & Notes */}
          <div>
            <Label>Rate Komisi (%)</Label>
            <Input type="number" min={0} max={100} step="0.1" {...form.register('commission_rate')} placeholder="5.5" />
          </div>

          <div className="md:col-span-2">
            <Label>Catatan</Label>
            <Textarea {...form.register('notes')} placeholder="Catatan tambahan..." rows={3} />
          </div>

          {/* Actions */}
          <div className="md:col-span-2 flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={createCommission.isPending || updateCommission.isPending}
              className="flex-1"
            >
              {createCommission.isPending || updateCommission.isPending ? 'Menyimpan...' : (editData ? 'Update Komisi' : 'Tambah Komisi')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
