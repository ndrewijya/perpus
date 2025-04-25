import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, bookIds } = body;

    if (!userId || !bookIds || bookIds.length === 0) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Verifikasi stok buku
    const books = await prisma.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
    });

    // Periksa apakah semua buku tersedia
    for (const book of books) {
      if (book.stock <= 0) {
        return NextResponse.json(
          { error: `Buku "${book.title}" tidak tersedia (stok habis)` },
          { status: 400 }
        );
      }
    }

    // Buat peminjaman dalam transaksi
    const loan = await prisma.$transaction(async (tx) => {
      // Buat peminjaman
      const newLoan = await tx.loan.create({
        data: {
          userId,
          status: "BORROWED",
        },
      });

      // Tambahkan item peminjaman dan kurangi stok buku
      for (const bookId of bookIds) {
        await tx.loanItem.create({
          data: {
            loanId: newLoan.id,
            bookId,
          },
        });

        // Kurangi stok buku
        await tx.book.update({
          where: { id: bookId },
          data: {
            stock: {
              decrement: 1,
            },
          },
        });
      }

      return newLoan;
    });

    return NextResponse.json(loan);
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
      orderBy: {
        loanDate: "desc",
      },
      include: {
        user: true,
        loanItems: {
          include: {
            book: true,
          },
        },
      },
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data peminjaman" },
      { status: 500 }
    );
  }
}
