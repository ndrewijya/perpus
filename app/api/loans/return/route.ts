import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loanId, loanItemIds } = body;

    if (!loanId || !loanItemIds || loanItemIds.length === 0) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Proses pengembalian dalam transaksi
    const result = await prisma.$transaction(async (tx) => {
      // Dapatkan item peminjaman
      const loanItems = await tx.loanItem.findMany({
        where: {
          id: {
            in: loanItemIds,
          },
          loanId: loanId,
          returned: false,
        },
        include: {
          book: true,
        },
      });

      if (loanItems.length === 0) {
        throw new Error("Tidak ada buku yang dapat dikembalikan");
      }

      // Update status item peminjaman dan tambahkan stok buku
      for (const item of loanItems) {
        // Update status item peminjaman
        await tx.loanItem.update({
          where: { id: item.id },
          data: { returned: true },
        });

        // Tambahkan stok buku
        await tx.book.update({
          where: { id: item.book.id },
          data: {
            stock: {
              increment: 1,
            },
          },
        });
      }

      // Periksa apakah semua item sudah dikembalikan
      const remainingItems = await tx.loanItem.count({
        where: {
          loanId: loanId,
          returned: false,
        },
      });

      // Jika semua item sudah dikembalikan, update status peminjaman
      if (remainingItems === 0) {
        await tx.loan.update({
          where: { id: loanId },
          data: {
            status: "RETURNED",
            returnDate: new Date(),
          },
        });
      }

      return { success: true, itemsReturned: loanItems.length };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat mengembalikan buku" },
      { status: 500 }
    );
  }
}
