import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Users, FolderKanban, Wallet } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { EmployeeRanking } from "@/components/dashboard/EmployeeRanking";

const Dashboard = () => {
  // Fetch dashboard metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const [commissions, cashflow, employees, groups] = await Promise.all([
        supabase
          .from("commissions")
          .select("gross_commission, net_commission, disbursed_commission")
          .not("disbursed_commission", "is", null),
        supabase.from("cashflow").select("type, amount"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("groups").select("id", { count: "exact", head: true }),
      ]);

      const totalGross = commissions.data?.reduce(
        (sum, c) => sum + (c.gross_commission || 0),
        0
      ) || 0;
      const totalNet = commissions.data?.reduce(
        (sum, c) => sum + (c.net_commission || 0),
        0
      ) || 0;
      const totalDisbursed = commissions.data?.reduce(
        (sum, c) => sum + (c.disbursed_commission || 0),
        0
      ) || 0;
      
      const totalExpense = cashflow.data
        ?.filter((c) => c.type === "expense")
        .reduce((sum, c) => sum + c.amount, 0) || 0;

      return {
        totalGross,
        totalNet,
        totalDisbursed,
        totalExpense,
        totalEmployees: employees.count || 0,
        totalGroups: groups.count || 0,
      };
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const metricsData = [
    {
      title: "Total Komisi Kotor",
      value: formatCurrency(metrics?.totalGross || 0),
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Komisi Bersih",
      value: formatCurrency(metrics?.totalNet || 0),
      change: "+10.2%",
      trend: "up",
      icon: Wallet,
    },
    {
      title: "Total Komisi Cair",
      value: formatCurrency(metrics?.totalDisbursed || 0),
      change: "+8.7%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Total Pengeluaran",
      value: formatCurrency(metrics?.totalExpense || 0),
      change: "+5.3%",
      trend: "down",
      icon: TrendingDown,
    },
    {
      title: "Total Karyawan",
      value: metrics?.totalEmployees || 0,
      change: "",
      trend: null,
      icon: Users,
    },
    {
      title: "Total Group",
      value: metrics?.totalGroups || 0,
      change: "",
      trend: null,
      icon: FolderKanban,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview performa affiliate marketing PT FAHMYID DIGITAL GROUP
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview performa affiliate marketing PT FAHMYID DIGITAL GROUP
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          const isNegative = metric.trend === "down";

          return (
            <Card
              key={index}
              className="shadow-card hover:shadow-elegant transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-lg ${
                    isNegative ? "bg-destructive/10" : "bg-primary/10"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isNegative ? "text-destructive" : "text-primary"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <p
                    className={`text-xs flex items-center gap-1 mt-1 ${
                      isNegative ? "text-destructive" : "text-success"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {metric.change} vs bulan lalu
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Ranking Table */}
      <EmployeeRanking />
    </div>
  );
};

export default Dashboard;
