import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users } from "lucide-react";
import { PopularBooksReport } from "@/components/popular-books-report";
import { UserLoansReport } from "@/components/user-loans-report";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Laporan
        </h1>
        <p className="text-muted-foreground">
          Lihat laporan dan statistik perpustakaan
        </p>
      </div>

      <Tabs defaultValue="popular" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Buku Populer
          </TabsTrigger>
          <TabsTrigger value="user" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Peminjaman per Anggota
          </TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="space-y-4">
          <PopularBooksReport />
        </TabsContent>
        <TabsContent value="user" className="space-y-4">
          <UserLoansReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
