import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useAttendance } from '@/hooks/useAttendance';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { LogIn, LogOut, Clock, CalendarDays } from 'lucide-react';

const Attendance = () => {
  const { listToday, listRange, clockIn, manualClockOut } = useAttendance();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const rangeQuery = listRange(
    range?.from ? format(range.from, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-01'),
    range?.to ? format(range.to, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );

  const isClockedIn = !!listToday.data?.clock_in_time;
  const isClockedOut = !!listToday.data?.clock_out_time;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm">Tanggal</p>
                <p className="text-sm font-medium">{format(new Date(), 'dd MMMM yyyy', { locale: localeId })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Jam Masuk</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                <LogIn className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm">Clock-in</p>
                <p className="text-sm font-medium">
                  {listToday.data?.clock_in_time ? format(new Date(listToday.data.clock_in_time), 'HH:mm') : '-'}
                </p>
              </div>
            </div>
            {!isClockedIn && (
              <Button size="sm" onClick={() => clockIn.mutate()} disabled={clockIn.isPending}>
                {clockIn.isPending ? 'Memproses...' : 'Absen Masuk'}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Jam Pulang</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-rose-100 text-rose-600">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm">Clock-out</p>
                <p className="text-sm font-medium">
                  {listToday.data?.clock_out_time ? format(new Date(listToday.data.clock_out_time), 'HH:mm') : '-'}
                </p>
              </div>
            </div>
            {isClockedIn && !isClockedOut && (
              <Button size="sm" variant="outline" onClick={() => manualClockOut.mutate()} disabled={manualClockOut.isPending}>
                {manualClockOut.isPending ? 'Memproses...' : 'Absen Pulang'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <DatePickerWithRange date={range} onDateChange={setRange} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-2 pr-4">Tanggal</th>
                  <th className="py-2 pr-4">Masuk</th>
                  <th className="py-2 pr-4">Pulang</th>
                  <th className="py-2 pr-4">Durasi</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {(rangeQuery.data || []).map((row: any) => {
                  const dur = row.work_duration_minutes ? `${Math.floor(row.work_duration_minutes/60)}j ${row.work_duration_minutes%60}m` : '-';
                  return (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{format(new Date(row.attendance_date), 'dd MMM yyyy', { locale: localeId })}</td>
                      <td className="py-2 pr-4">{row.clock_in_time ? format(new Date(row.clock_in_time), 'HH:mm') : '-'}</td>
                      <td className="py-2 pr-4">{row.clock_out_time ? format(new Date(row.clock_out_time), 'HH:mm') : '-'}</td>
                      <td className="py-2 pr-4">{dur}</td>
                      <td className="py-2 pr-4 capitalize">{row.status || '-'}</td>
                    </tr>
                  );
                })}
                {(!rangeQuery.data || rangeQuery.data.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">Belum ada data absensi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
