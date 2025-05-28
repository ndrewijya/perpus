import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, books, dueDate } = body;

    if (
      !memberId ||
      !books ||
      !Array.isArray(books) ||
      books.length === 0 ||
      !dueDate
    ) {
      return NextResponse.json(
        {
          error:
            "Data tidak lengkap. Anggota, buku, dan tanggal jatuh tempo wajib diisi.",
        },
        { status: 400 }
      );
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return NextResponse.json(
        { error: "Tanggal jatuh tempo tidak valid." },
        { status: 400 }
      );
    }

    // Ambil data buku dari database
    const bookIds = books.map((b: any) => b.bookId);
    const dbBooks = await prisma.book.findMany({
      where: { id: { in: bookIds } },
    });

    // Validasi stok
    for (const { bookId, quantity } of books) {
      const dbBook = dbBooks.find((b) => b.id === bookId);
      if (!dbBook) {
        return NextResponse.json(
          { error: `Buku dengan ID "${bookId}" tidak ditemukan.` },
          { status: 400 }
        );
      }
      if (dbBook.stock < quantity) {
        return NextResponse.json(
          { error: `Stok buku "${dbBook.title}" tidak cukup.` },
          { status: 400 }
        );
      }
    }

    // Transaksi: buat loan, loanItem, update stok
    const loan = await prisma.$transaction(async (tx: TransactionClient) => {
      const newLoan = await tx.loan.create({
        data: {
          memberId: memberId,
          loanDate: new Date(),
          dueDate: parsedDueDate,
          status: "BORROWED",
        },
      });

      for (const { bookId, quantity } of books) {
        await tx.loanItem.create({
          data: {
            loanId: newLoan.id,
            bookId,
            quantity,
          },
        });

        await tx.book.update({
          where: { id: bookId },
          data: {
            stock: { decrement: quantity },
          },
        });
      }

      return newLoan;
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat peminjaman" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const loans = await prisma.loan.findMany({
      orderBy: { loanDate: "desc" },
      include: {
        member: true,
        loanItems: {
          include: { book: true },
        },
      },
    });

    return NextResponse.json(loans, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data peminjaman" },
      { status: 500 }
    );
  }
}
