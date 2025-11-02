import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
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
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard - All authenticated users */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Performance Tim & Individu - Superadmin, Leader, Admin, Viewer */}
              <Route
                path="/performance"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader', 'admin', 'viewer']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Performa Tim & Individu</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Jurnal Laporan Harian - Staff only */}
              <Route
                path="/daily-report"
                element={
                  <ProtectedRoute requiredRoles={['staff']}>
                    <AppLayout>
                      <DailyReport />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Absensi - Staff only */}
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute requiredRoles={['staff']}>
                    <AppLayout>
                      <Attendance />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Data Komisi Affiliate - Superadmin, Leader, Admin */}
              <Route
                path="/commission"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader', 'admin']}>
                    <AppLayout>
                      <Commission />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Cashflow / Arus Kas - Superadmin, Leader, Admin */}
              <Route
                path="/cashflow"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader', 'admin']}>
                    <AppLayout>
                      <Cashflow />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Laba Rugi Bisnis - Superadmin, Leader, Admin, Viewer */}
              <Route
                path="/profit-loss"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader', 'admin', 'viewer']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Laba Rugi Bisnis</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Saldo Hutang Piutang - Superadmin, Leader, Admin, Viewer */}
              <Route
                path="/debt-receivable"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader', 'admin', 'viewer']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Saldo Hutang Piutang</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Management Karyawan - Superadmin, Leader */}
              <Route
                path="/employees"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader']}>
                    <AppLayout>
                      <Employees />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Inventaris Device Tim - Superadmin, Leader */}
              <Route
                path="/devices"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Inventaris Device Tim</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Daftar Akun Affiliate - Superadmin, Leader */}
              <Route
                path="/accounts"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Daftar Akun Affiliate</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Manage Group - Superadmin, Leader */}
              <Route
                path="/groups"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Manage Group</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Management Asset - Superadmin, Leader, Admin, Viewer */}
              <Route
                path="/assets"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader', 'admin', 'viewer']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Management Asset</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* SOP & Knowledge Center - All authenticated users */}
              <Route
                path="/knowledge"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">SOP & Knowledge Center</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Goal & Target KPI - Superadmin, Leader */}
              <Route
                path="/kpi"
                element={
                  <ProtectedRoute requiredRoles={['superadmin', 'leader']}>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Goal & Target KPI</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Pengaturan Akun Pribadi - All authenticated users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <div className="p-6">
                        <h1 className="text-3xl font-bold">Pengaturan Akun Pribadi</h1>
                        <p className="text-muted-foreground mt-2">Halaman ini sedang dalam pengembangan</p>
                      </div>
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;