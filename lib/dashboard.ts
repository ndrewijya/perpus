import { prisma } from "@/lib/prisma";
import { LoanStatus } from "@prisma/client";

export async function getDashboardStats() {
  const now = new Date();

  const totalBooks = await prisma.book.count();
  const newBooks = await prisma.book.count({
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    },
  });

  const totalMembers = await prisma.member.count();
  const newMembers = await prisma.member.count({
    where: {
      createdAt: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    },
  });

  const totalLoans = await prisma.loan.count();
  const activeLoans = await prisma.loan.count({
    where: { status: LoanStatus.BORROWED },
  });

  // Jatuh tempo minggu ini
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const dueThisWeek = await prisma.loan.count({
    where: {
      status: LoanStatus.BORROWED,
    },
  });

  // Peminjaman bulan lalu
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const loansLastMonth = await prisma.loan.count({
    where: {
      createdAt: {
        gte: firstDayLastMonth,
        lte: lastDayLastMonth,
      },
    },
  });

  // ===== Tambahan: Query Buku Populer =====
  const popularBooksRaw = await prisma.loanItem.groupBy({
    by: ["bookId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const booksInfo = await prisma.book.findMany({
    where: { id: { in: popularBooksRaw.map((b) => b.bookId) } },
  });

  const popularBooks = popularBooksRaw.map((item) => {
    const book = booksInfo.find((b) => b.id === item.bookId);
    return {
      id: book?.id,
      title: book?.title,
      author: book?.author,
      loanCount: item._sum.quantity || 0,
    };
  });

  // ===== Tambahan: Query Aktivitas Terbaru =====
  const recentActivities = await prisma.loan.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      member: true,
      loanItems: { include: { book: true } },
    },
  });

  return {
    totalBooks,
    newBooks,
    totalMembers,
    newMembers,
    activeLoans,
    dueThisWeek,
    totalLoans,
    loansLastMonth,
    popularBooks,
    recentActivities,
  };
}
