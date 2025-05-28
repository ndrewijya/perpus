import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users } from "lucide-react";
import PopularBooksReport from "@/components/popular-books-report";
import UserLoansReport from "@/components/user-loans-report";

export default async function ReportsPage() {
  // --- Buku Populer: SUM quantity dari LoanItem ---
  const popularBooksRaw = await prisma.loanItem.groupBy({
    by: ["bookId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const booksInfo = await prisma.book.findMany({
    where: {
      id: { in: popularBooksRaw.map((b) => b.bookId) },
    },
  });

  const popularBooksData = popularBooksRaw.map((item, idx) => {
    const book = booksInfo.find((b) => b.id === item.bookId);
    return {
      no: idx + 1,
      id: book?.id || "",
      title: book?.title || "-",
      author: book?.author || "-",
      loanCount: item._sum.quantity || 0,
    };
  });

  // --- Peminjaman per Anggota: SUM quantity semua loanItems milik user, loanItems harus include book ---
  const users = await prisma.member.findMany({
    include: {
      loans: {
        include: {
          loanItems: {
            include: {
              book: { select: { title: true, author: true } },
            },
          },
        },
        orderBy: { loanDate: "desc" },
      },
    },
  });

  // Hitung total buku dipinjam (bukan sekadar jumlah transaksi)
  const usersWithLoanCount = users.map((user) => {
    // Jumlahkan semua quantity dari seluruh loanItems di seluruh loans user
    const totalLoanedBooks = user.loans.reduce(
      (total, loan) =>
        total + loan.loanItems.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
    return {
      ...user,
      totalLoanedBooks,
    };
  });

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
          <PopularBooksReport books={popularBooksData} />
        </TabsContent>
        <TabsContent value="user" className="space-y-4">
          <UserLoansReport users={usersWithLoanCount} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
