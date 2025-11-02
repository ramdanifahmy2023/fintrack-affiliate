import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommissionData, useCommissionSummary, useDeleteCommission } from '@/hooks/useCommission';
import { CommissionForm } from '@/components/commission/CommissionForm';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DollarSign, CreditCard, Banknote, Clock, Plus, Edit, Trash2, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

const Commission = () => {
  const { user, hasRole } = useAuth();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');

  const deleteCommission = useDeleteCommission();

  // Data queries
  const commissionQuery = useCommissionData(currentYear, currentMonth, {
    accountId: accountFilter !== 'all' ? accountFilter : undefined
  });
  const summaryQuery = useCommissionSummary(currentYear, currentMonth, {
    accountId: accountFilter !== 'all' ? accountFilter : undefined
  });

  // Filter data by search term
  const filteredData = (commissionQuery.data || []).filter(commission => 
    !searchTerm || 
    commission.accounts?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.accounts?.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique accounts for filter
  const uniqueAccounts = Array.from(
    new Map((commissionQuery.data || []).map(c => [
      c.account_id, 
      { id: c.account_id, username: c.accounts?.username, platform: c.accounts?.platform }
    ])).values()
  );

  const handleEdit = (commission: any) => {
    setEditData(commission);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCommission.mutateAsync(id);
      toast.success('Data komisi berhasil dihapus');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus data komisi');
    }
  };

  const exportToCSV = () => {
    if (!filteredData.length) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = ['Tanggal', 'Periode', 'Akun', 'Platform', 'Komisi Kotor', 'Komisi Bersih', 'Komisi Cair', 'Tanggal Cair', 'Rate (%)', 'Catatan'];
    const csvData = filteredData.map(c => [
      c.commission_date,
      c.period_week,
      c.accounts?.username || '',
      c.accounts?.platform || '',
      c.gross_commission || 0,
      c.net_commission || 0,
      c.disbursed_commission || 0,
      c.disbursement_date || '',
      c.commission_rate || '',
      c.notes || ''
    ]);

    const csv = [headers, ...csvData].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `komisi-${currentYear}-${currentMonth.toString().padStart(2, '0')}.csv`;
    link.click();
    toast.success('Data berhasil diekspor ke CSV');
  };

  const canWrite = hasRole(['superadmin', 'leader']);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Data Komisi Affiliate</h1>
          <p className="text-muted-foreground">Kelola dan pantau komisi affiliate per akun dan periode</p>
        </div>
        
        {canWrite && (
          <Button onClick={() => { setEditData(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Komisi
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter & Periode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Bulan</label>
              <Select value={currentMonth.toString()} onValueChange={(v) => setCurrentMonth(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {format(new Date(2024, i, 1), 'MMMM', { locale: localeId })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tahun</label>
              <Select value={currentYear.toString()} onValueChange={(v) => setCurrentYear(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2024, 2025, 2026].map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Akun</label>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Akun</SelectItem>
                  {uniqueAccounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.username} ({account.platform})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Cari Username</label>
              <Input 
                placeholder="Cari username..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Komisi Kotor"
          value={summaryQuery.data?.totalGross || 0}
          icon={DollarSign}
          iconColor="text-green-600"
          loading={summaryQuery.isLoading}
          description={`${summaryQuery.data?.count || 0} transaksi`}
        />
        
        <MetricCard
          title="Total Komisi Bersih"
          value={summaryQuery.data?.totalNet || 0}
          icon={CreditCard}
          iconColor="text-blue-600"
          loading={summaryQuery.isLoading}
          description="Setelah potongan"
        />
        
        <MetricCard
          title="Total Komisi Cair"
          value={summaryQuery.data?.totalDisbursed || 0}
          icon={Banknote}
          iconColor="text-emerald-600"
          loading={summaryQuery.isLoading}
          description="Sudah dicairkan"
        />
        
        <MetricCard
          title="Menunggu Pencairan"
          value={summaryQuery.data?.totalPending || 0}
          icon={Clock}
          iconColor="text-orange-600"
          loading={summaryQuery.isLoading}
          description="Belum cair"
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rincian Komisi</CardTitle>
              <CardDescription>
                Data komisi periode {format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy', { locale: localeId })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={!filteredData.length}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-3 pr-4">Tanggal</th>
                  <th className="py-3 pr-4">Periode</th>
                  <th className="py-3 pr-4">Akun</th>
                  <th className="py-3 pr-4">Platform</th>
                  <th className="py-3 pr-4">Kotor</th>
                  <th className="py-3 pr-4">Bersih</th>
                  <th className="py-3 pr-4">Cair</th>
                  <th className="py-3 pr-4">Status</th>
                  {canWrite && <th className="py-3">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((commission) => {
                  const isPending = (commission.net_commission || 0) > (commission.disbursed_commission || 0);
                  return (
                    <tr key={commission.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 pr-4">
                        {format(new Date(commission.commission_date), 'dd MMM yyyy', { locale: localeId })}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline">{commission.period_week}</Badge>
                      </td>
                      <td className="py-3 pr-4 font-medium">
                        {commission.accounts?.username || 'N/A'}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary">{commission.accounts?.platform || 'N/A'}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                          .format(commission.gross_commission || 0)}
                      </td>
                      <td className="py-3 pr-4">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                          .format(commission.net_commission || 0)}
                      </td>
                      <td className="py-3 pr-4">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
                          .format(commission.disbursed_commission || 0)}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={isPending ? 'destructive' : 'default'}>
                          {isPending ? 'Pending' : 'Cair'}
                        </Badge>
                      </td>
                      {canWrite && (
                        <td className="py-3">
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(commission)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Data Komisi?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Data komisi untuk akun {commission.accounts?.username} periode {commission.period_week} 
                                    akan dihapus permanen. Aksi ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(commission.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
                
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={canWrite ? 9 : 8} className="py-8 text-center text-muted-foreground">
                      {commissionQuery.isLoading ? 'Memuat data...' : 'Belum ada data komisi untuk periode ini'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Form Modal */}
      <CommissionForm 
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditData(null);
        }}
        editData={editData}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
};

const handleEdit = (commission: any) => {
  // This will be defined in the component scope
};

export default Commission;
