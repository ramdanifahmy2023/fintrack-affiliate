import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardMetrics, useDashboardCharts } from '@/hooks/useDashboardData';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, TrendingDown, DollarSign, CreditCard, Banknote, 
  Users, Building, AlertCircle, CheckCircle2
} from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');

  // Use current month as default date range
  const queryDateRange = {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  };

  const { 
    data: metrics, 
    isLoading: metricsLoading, 
    error: metricsError 
  } = useDashboardMetrics(queryDateRange);

  const { 
    data: chartData, 
    isLoading: chartsLoading, 
    error: chartsError 
  } = useDashboardCharts(queryDateRange);

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { value: current, percentage: 0 };
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { value: change, percentage };
  };

  const commissionGrossChange = metrics ? 
    calculateChange(metrics.totalCommissionGross, metrics.previousMonthMetrics.totalCommissionGross) : 
    null;

  const commissionNetChange = metrics ? 
    calculateChange(metrics.totalCommissionNet, metrics.previousMonthMetrics.totalCommissionNet) : 
    null;

  const commissionDisbursedChange = metrics ? 
    calculateChange(metrics.totalCommissionDisbursed, metrics.previousMonthMetrics.totalCommissionDisbursed) : 
    null;

  const expensesChange = metrics ? 
    calculateChange(metrics.totalExpenses, metrics.previousMonthMetrics.totalExpenses) : 
    null;

  if (metricsError || chartsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Gagal Memuat Dashboard</h3>
          <p className="text-muted-foreground mb-4">
            Terjadi kesalahan saat memuat data dashboard. Silakan refresh halaman.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Halaman
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali, {user?.profile?.full_name || user?.email?.split('@')[0] || 'User'}!
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Filter Data</CardTitle>
          <CardDescription>
            Filter data berdasarkan group dan karyawan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Group</label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Group</SelectItem>
                  <SelectItem value="group1">Group A</SelectItem>
                  <SelectItem value="group2">Group B</SelectItem>
                  <SelectItem value="group3">Group C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Karyawan</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih karyawan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Karyawan</SelectItem>
                  <SelectItem value="emp1">John Doe</SelectItem>
                  <SelectItem value="emp2">Jane Smith</SelectItem>
                  <SelectItem value="emp3">Michael Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total Komisi Kotor"
          value={metrics?.totalCommissionGross || 0}
          change={commissionGrossChange}
          icon={DollarSign}
          iconColor="text-green-600"
          loading={metricsLoading}
          description="Komisi sebelum pemotongan"
        />
        
        <MetricCard
          title="Total Komisi Bersih"
          value={metrics?.totalCommissionNet || 0}
          change={commissionNetChange}
          icon={CreditCard}
          iconColor="text-blue-600"
          loading={metricsLoading}
          description="Komisi setelah pemotongan"
        />
        
        <MetricCard
          title="Total Komisi Cair"
          value={metrics?.totalCommissionDisbursed || 0}
          change={commissionDisbursedChange}
          icon={Banknote}
          iconColor="text-emerald-600"
          loading={metricsLoading}
          description="Komisi yang sudah dicairkan"
        />
        
        <MetricCard
          title="Total Pengeluaran"
          value={metrics?.totalExpenses || 0}
          change={expensesChange}
          icon={TrendingDown}
          iconColor="text-red-600"
          loading={metricsLoading}
          description="Pengeluaran operasional"
        />
        
        <MetricCard
          title="Total Karyawan"
          value={metrics?.totalEmployees || 0}
          icon={Users}
          iconColor="text-purple-600"
          loading={metricsLoading}
          description="Karyawan aktif"
        />
        
        <MetricCard
          title="Total Group"
          value={metrics?.totalGroups || 0}
          icon={Building}
          iconColor="text-indigo-600"
          loading={metricsLoading}
          description="Group yang terdaftar"
        />
      </div>

      {/* Charts Section - Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Visualisasi Data</CardTitle>
          <CardDescription>
            Grafik dan chart akan segera hadir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chart Sedang Dalam Pengembangan</h3>
            <p>
              Fitur visualisasi data berupa grafik tren omset, breakdown komisi, 
              dan performa group akan segera tersedia.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Only visible to authorized roles */}
      {hasRole(['superadmin', 'leader', 'admin']) && (
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Shortcut ke fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tambah Komisi
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Input Cashflow
              </Button>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Kelola Karyawan
              </Button>
              <Button variant="outline" size="sm">
                <Building className="w-4 h-4 mr-2" />
                Kelola Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Info for Development */}
      <Card className="border-dashed border-2">
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              <strong>Status Development:</strong> Dashboard dasar sudah ready! 
              Silakan setup database Supabase terlebih dahulu untuk melihat data real.
            </p>
            <p className="mt-2">
              Phase selanjutnya: Implementasi chart visualisasi dan fitur-fitur core lainnya.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;