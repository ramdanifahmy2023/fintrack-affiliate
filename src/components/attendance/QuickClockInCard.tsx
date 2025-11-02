import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAttendance } from '@/hooks/useAttendance';
import { CalendarDays, LogIn } from 'lucide-react';

export const QuickClockInCard = () => {
  const { listToday, clockIn } = useAttendance();

  const isClockedIn = !!listToday.data?.clock_in_time;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Absensi Hari Ini</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm">Status:</p>
            <p className="text-sm font-medium">
              {isClockedIn ? 'Sudah absen masuk' : 'Belum absen masuk'}
            </p>
          </div>
        </div>
        {!isClockedIn && (
          <Button size="sm" onClick={() => clockIn.mutate()}>
            <LogIn className="h-4 w-4 mr-2" />
            Absen Masuk
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
