import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface DashboardStatsProps {
  title: string;
  value?: number;
  description?: string;
  icon: LucideIcon;
}

export function DashboardStats({
  title,
  value,
  description,
  icon: Icon,
}: DashboardStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {value !== undefined && value > 0 ? (
          <>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">Belum ada data.</p>
        )}
      </CardContent>
    </Card>
  );
}
