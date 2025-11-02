import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    percentage: number;
  };
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  loading?: boolean;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = "text-primary",
  description,
  loading = false
}: MetricCardProps) => {
  const isPositive = change ? change.value > 0 : null;
  
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format currency for Indonesian Rupiah
      if (title.toLowerCase().includes('komisi') || title.toLowerCase().includes('pengeluaran')) {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      }
      
      // Format regular numbers
      return new Intl.NumberFormat('id-ID').format(val);
    }
    return val;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-24"></div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-foreground">
              {formatValue(value)}
            </div>
          )}
          
          {change && !loading && (
            <div className="flex items-center gap-1 text-xs">
              <span 
                className={cn(
                  "font-medium",
                  isPositive 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                )}
              >
                {isPositive ? '+' : ''}{change.percentage.toFixed(1)}%
              </span>
              <span className="text-muted-foreground">
                vs bulan lalu
              </span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};