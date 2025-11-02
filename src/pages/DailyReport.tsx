import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { usePreviousShiftClosing, useSubmitDailyReport, DailyReportForm } from '@/hooks/useDailyReport';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const schema = z.object({
  report_date: z.string().min(10, 'Tanggal wajib diisi'),
  shift: z.enum(['1','2','3']).transform(v => Number(v) as 1|2|3),
  group_id: z.string().uuid('Group wajib dipilih'),
  device_id: z.string().uuid('Device wajib dipilih'),
  account_id: z.string().uuid('Akun wajib dipilih'),
  product_category: z.string().min(1, 'Kategori produk wajib diisi'),
  live_status: z.enum(['lancar','mati','relive']),
  starting_sales: z.coerce.number().min(0),
  ending_sales: z.coerce.number().min(0),
  opening_balance: z.coerce.number().min(0),
  closing_balance: z.coerce.number().min(0),
  total_revenue: z.coerce.number().min(0),
  gross_commission: z.coerce.number().min(0),
  notes: z.string().optional(),
}).refine((data) => data.ending_sales >= data.starting_sales, {
  message: 'Ending sales harus lebih besar atau sama dengan starting sales',
  path: ['ending_sales']
});

const DailyReport = () => {
  const { user } = useAuth();
  const submitReport = useSubmitDailyReport();

  // Load dropdown options
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => (await supabase.from('groups').select('id,name')).data || []
  });
  const { data: devices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => (await supabase.from('devices').select('id,device_id,model')).data || []
  });
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => (await supabase.from('accounts').select('id,username,platform')).data || []
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      report_date: new Date().toISOString().split('T')[0],
      shift: 1 as any,
      live_status: 'lancar',
      starting_sales: 0,
      ending_sales: 0,
      opening_balance: 0,
      closing_balance: 0,
      total_revenue: 0,
      gross_commission: 0,
    }
  });

  const report_date = form.watch('report_date');
  const shift = form.watch('shift') as unknown as 1|2|3;
  const group_id = form.watch('group_id');
  const live_status = form.watch('live_status');
  const starting_sales = form.watch('starting_sales');
  const ending_sales = form.watch('ending_sales');

  // previous shift closing
  const { data: prevClosing = 0 } = usePreviousShiftClosing(report_date, shift, group_id);

  // Auto-compute fields
  useEffect(() => {
    // Opening balance automation
    if (live_status === 'lancar') {
      form.setValue('opening_balance', Number(prevClosing) || 0, { shouldValidate: true });
    } else {
      form.setValue('opening_balance', 0, { shouldValidate: true });
    }
  }, [live_status, prevClosing, form]);

  useEffect(() => {
    const totalSales = Number(ending_sales || 0) - Number(starting_sales || 0);
    const closingBalance = (form.getValues('opening_balance') || 0) + totalSales;
    form.setValue('closing_balance', Math.max(0, closingBalance), { shouldValidate: true });
  }, [starting_sales, ending_sales, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      const payload: DailyReportForm = {
        ...(values as any),
        total_sales: Number(values.ending_sales) - Number(values.starting_sales)
      };

      await submitReport.mutateAsync(payload);
      toast.success('Laporan harian berhasil disimpan dan absensi di-clock out otomatis.');
      form.reset({
        report_date: new Date().toISOString().split('T')[0],
        shift: values.shift,
        group_id: values.group_id,
        device_id: '',
        account_id: '',
        product_category: '',
        live_status: 'lancar',
        starting_sales: 0,
        ending_sales: 0,
        opening_balance: 0,
        closing_balance: 0,
        total_revenue: 0,
        gross_commission: 0,
        notes: ''
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Gagal menyimpan laporan harian');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Jurnal Laporan Harian</h1>
        <p className="text-muted-foreground">Input laporan harian shift dan otomatis clock-out absensi.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tanggal & Shift */}
            <div>
              <Label>Tanggal</Label>
              <Input type="date" {...form.register('report_date')} />
            </div>
            <div>
              <Label>Shift</Label>
              <Select onValueChange={(v) => form.setValue('shift', v as any)} defaultValue={String(form.getValues('shift'))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Shift 1</SelectItem>
                  <SelectItem value="2">Shift 2</SelectItem>
                  <SelectItem value="3">Shift 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Group & Device */}
            <div>
              <Label>Group</Label>
              <Select onValueChange={(v) => form.setValue('group_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih group" />
                </SelectTrigger>
                <SelectContent>
                  {groups?.map((g: any) => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Device</Label>
              <Select onValueChange={(v) => form.setValue('device_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih device" />
                </SelectTrigger>
                <SelectContent>
                  {devices?.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.device_id} {d.model ? `- ${d.model}` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account & Kategori Produk */}
            <div>
              <Label>Akun Affiliate</Label>
              <Select onValueChange={(v) => form.setValue('account_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih akun" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.username} - {a.platform}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Kategori Produk</Label>
              <Input placeholder="Contoh: Fashion / Elektronik" {...form.register('product_category')} />
            </div>

            {/* Status Live */}
            <div>
              <Label>Status Live</Label>
              <Select onValueChange={(v) => form.setValue('live_status', v as any)} defaultValue={form.getValues('live_status')}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lancar">Lancar</SelectItem>
                  <SelectItem value="mati">Mati</SelectItem>
                  <SelectItem value="relive">Relive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sales */}
            <div>
              <Label>Starting Sales</Label>
              <Input type="number" min={0} {...form.register('starting_sales', { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Ending Sales</Label>
              <Input type="number" min={0} {...form.register('ending_sales', { valueAsNumber: true })} />
            </div>

            {/* Balance & Revenue */}
            <div>
              <Label>Opening Balance</Label>
              <Input type="number" min={0} {...form.register('opening_balance', { valueAsNumber: true })} />
              {live_status === 'lancar' && (
                <p className="text-xs text-muted-foreground mt-1">Diisi otomatis dari closing balance shift sebelumnya: {new Intl.NumberFormat('id-ID').format(Number(prevClosing || 0))}</p>
              )}
            </div>
            <div>
              <Label>Closing Balance</Label>
              <Input type="number" min={0} {...form.register('closing_balance', { valueAsNumber: true })} />
            </div>

            <div>
              <Label>Total Revenue (Rp)</Label>
              <Input type="number" min={0} {...form.register('total_revenue', { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Komisi Kotor (Rp)</Label>
              <Input type="number" min={0} {...form.register('gross_commission', { valueAsNumber: true })} />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <Label>Catatan</Label>
              <Input placeholder="Tambahkan catatan opsional..." {...form.register('notes')} />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={submitReport.isPending}>
                {submitReport.isPending ? 'Menyimpan...' : 'Simpan Laporan'}
              </Button>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyReport;
