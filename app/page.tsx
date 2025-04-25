import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export default function Dashboard() {
  // Contoh data statistik
  const stats = {
    totalBooks: 245,
    newBooks: 4,
    totalMembers: 120,
    newMembers: 8,
    activeLoans: 32,
    dueThisWeek: 12,
    totalLoans: 621,
    loansLastMonth: 42,
  };

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
          description={`+${stats.newBooks} buku baru bulan ini`}
          icon={BookOpen}
        />
        <DashboardStats
          title="Total Anggota"
          value={stats.totalMembers}
          description={`+${stats.newMembers} anggota baru bulan ini`}
          icon={Users}
        />
        <DashboardStats
          title="Peminjaman Aktif"
          value={stats.activeLoans}
          description={`${stats.dueThisWeek} jatuh tempo minggu ini`}
          icon={BookMarked}
        />
        <DashboardStats
          title="Total Peminjaman"
          value={stats.totalLoans}
          description={`+${stats.loansLastMonth} dari bulan lalu`}
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
            <RecentActivities />
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
            <PopularBooks />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
