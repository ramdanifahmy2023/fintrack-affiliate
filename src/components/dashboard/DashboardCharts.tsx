import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export const DashboardCharts = () => {
  // Fetch daily sales data
  const { data: dailySales } = useQuery({
    queryKey: ["daily-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_reports")
        .select("report_date, total_sales")
        .order("report_date", { ascending: true })
        .limit(30);

      if (error) throw error;

      // Group by date and sum
      const grouped = data.reduce((acc: any, curr) => {
        const date = new Date(curr.report_date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        });
        if (!acc[date]) {
          acc[date] = { date, total: 0 };
        }
        acc[date].total += curr.total_sales || 0;
        return acc;
      }, {});

      return Object.values(grouped);
    },
  });

  // Fetch commission data
  const { data: commissionData } = useQuery({
    queryKey: ["commission-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commissions")
        .select("gross_commission, net_commission, disbursed_commission");

      if (error) throw error;

      const totalGross = data.reduce((sum, c) => sum + (c.gross_commission || 0), 0);
      const totalNet = data.reduce((sum, c) => sum + (c.net_commission || 0), 0);
      const totalDisbursed = data.reduce((sum, c) => sum + (c.disbursed_commission || 0), 0);

      return [
        { name: "Komisi Kotor", value: totalGross },
        { name: "Komisi Bersih", value: totalNet },
        { name: "Komisi Cair", value: totalDisbursed },
      ];
    },
  });

  // Fetch account performance
  const { data: accountPerf } = useQuery({
    queryKey: ["account-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("platform, account_status");

      if (error) throw error;

      const grouped = data.reduce((acc: any, curr) => {
        const key = `${curr.platform} - ${curr.account_status}`;
        if (!acc[key]) {
          acc[key] = { name: key, value: 0 };
        }
        acc[key].value += 1;
        return acc;
      }, {});

      return Object.values(grouped);
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Daily Sales Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Diagram Omset Harian</CardTitle>
        </CardHeader>
        <CardContent>
          {dailySales && dailySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) =>
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Belum ada data omset harian
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Diagram Komisi</CardTitle>
        </CardHeader>
        <CardContent>
          {commissionData && commissionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={commissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) =>
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Belum ada data komisi
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Performance Pie Chart */}
      <Card className="shadow-card md:col-span-2">
        <CardHeader>
          <CardTitle>Performa Akun Affiliate</CardTitle>
        </CardHeader>
        <CardContent>
          {accountPerf && accountPerf.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accountPerf}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountPerf.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Belum ada data akun affiliate
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
