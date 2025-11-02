import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import DailyReport from "./pages/DailyReport";
import Attendance from "./pages/Attendance";
import Commission from "./pages/Commission";
import Cashflow from "./pages/Cashflow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            {/* Performance Tim & Individu */}
            <Route
              path="/performance"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Performa Tim & Individu</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Jurnal Laporan Harian - COMPLETED */}
            <Route
              path="/daily-report"
              element={
                <AppLayout>
                  <DailyReport />
                </AppLayout>
              }
            />
            {/* Absensi - COMPLETED */}
            <Route
              path="/attendance"
              element={
                <AppLayout>
                  <Attendance />
                </AppLayout>
              }
            />
            {/* Data Komisi Affiliate - COMPLETED */}
            <Route
              path="/commission"
              element={
                <AppLayout>
                  <Commission />
                </AppLayout>
              }
            />
            {/* Cashflow / Arus Kas - COMPLETED */}
            <Route
              path="/cashflow"
              element={
                <AppLayout>
                  <Cashflow />
                </AppLayout>
              }
            />
            {/* Laba Rugi Bisnis */}
            <Route
              path="/profit-loss"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Laba Rugi Bisnis</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Saldo Hutang Piutang */}
            <Route
              path="/debt-receivable"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Saldo Hutang Piutang</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Management Karyawan - Already exists */}
            <Route
              path="/employees"
              element={
                <AppLayout>
                  <Employees />
                </AppLayout>
              }
            />
            {/* Inventaris Device Tim */}
            <Route
              path="/devices"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Inventaris Device Tim</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Daftar Akun Affiliate */}
            <Route
              path="/accounts"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Daftar Akun Affiliate</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Manage Group */}
            <Route
              path="/groups"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Manage Group</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Management Asset */}
            <Route
              path="/assets"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Management Asset</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* SOP & Knowledge Center */}
            <Route
              path="/knowledge"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">SOP & Knowledge Center</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Goal & Target KPI */}
            <Route
              path="/kpi"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Goal & Target KPI</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            {/* Pengaturan Akun Pribadi */}
            <Route
              path="/profile"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Pengaturan Akun Pribadi</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
