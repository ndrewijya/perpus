import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { loanId, loanItemIds } = body;

    // Validasi input
    if (!loanId || !Array.isArray(loanItemIds) || loanItemIds.length === 0) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Jalankan proses dalam transaksi
    const result = await prisma.$transaction(async (tx) => {
      // Ambil semua loanItem yang akan dikembalikan dan belum dikembalikan
      const loanItems = await tx.loanItem.findMany({
        where: {
          id: { in: loanItemIds },
          loanId,
          returned: false,
        },
        include: { book: true },
      });

      if (loanItems.length === 0) {
        throw new Error("Tidak ada buku yang dapat dikembalikan");
      }

      // Update setiap loanItem menjadi returned dan tambahkan stok buku
      for (const item of loanItems) {
        await tx.loanItem.update({
          where: { id: item.id },
          data: { returned: true },
        });

        await tx.book.update({
          where: { id: item.book.id },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }

      // Cek apakah semua item sudah dikembalikan
      const remainingItems = await tx.loanItem.count({
        where: { loanId, returned: false },
      });

      // Jika semua sudah dikembalikan, update status loan
      let loanUpdated = null;
      if (remainingItems === 0) {
        loanUpdated = await tx.loan.update({
          where: { id: loanId },
          data: {
            status: "RETURNED",
            returnDate: new Date(),
          },
        });
      }

      return {
        success: true,
        itemsReturned: loanItems.length,
        loanCompleted: remainingItems === 0,
        loan: loanUpdated,
      };
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
