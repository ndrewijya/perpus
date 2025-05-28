export const dynamic = "force-dynamic";
import { getDashboardStats } from "@/lib/dashboard";
import {
  BookOpen,
  Users,
  BookMarked,
  BarChart3,
  Clock,
  TrendingUp,
} from "lucide-react";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentActivities } from "@/components/recent-activities";
import { PopularBooks } from "@/components/popular-books";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function Dashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Selamat datang di Sistem Manajemen Perpustakaan
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title="Total Buku"
          value={stats.totalBooks}
          description={
            stats.newBooks > 0
              ? `+${stats.newBooks} buku baru bulan ini`
              : undefined
          }
          icon={BookOpen}
        />
        <DashboardStats
          title="Total Anggota"
          value={stats.totalMembers}
          description={
            stats.newMembers > 0
              ? `+${stats.newMembers} anggota baru bulan ini`
              : undefined
          }
          icon={Users}
        />
        <DashboardStats
          title="Peminjaman Aktif"
          value={stats.activeLoans}
          description={
            stats.dueThisWeek > 0
              ? `${stats.dueThisWeek} jatuh tempo minggu ini`
              : undefined
          }
          icon={BookMarked}
        />
        <DashboardStats
          title="Total Peminjaman"
          value={stats.totalLoans}
          description={
            stats.loansLastMonth > 0
              ? `+${stats.loansLastMonth} dari bulan lalu`
              : undefined
          }
          icon={BarChart3}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription>
              Aktivitas peminjaman dan pengembalian buku
            </CardDescription>
          </CardHeader>
          <CardContent>
          <RecentActivities activities={stats.recentActivities} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Buku Populer
            </CardTitle>
            <CardDescription>Buku yang paling sering dipinjam</CardDescription>
          </CardHeader>
          <CardContent>
          <PopularBooks books={stats.popularBooks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
