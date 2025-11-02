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
            {/* Placeholder routes for other pages */}
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
            <Route
              path="/daily-report"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Jurnal Laporan Harian</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            <Route
              path="/attendance"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Absensi</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            <Route
              path="/commission"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Data Komisi Affiliate</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
            <Route
              path="/cashflow"
              element={
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Cashflow / Arus Kas</h1>
                    <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                  </div>
                </AppLayout>
              }
            />
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
            <Route
              path="/employees"
              element={
                <AppLayout>
                  <Employees />
                </AppLayout>
              }
            />
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
