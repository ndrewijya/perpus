import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Next.js 14+ dan 15: params diterima sebagai argumen kedua
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Cek apakah buku sedang dipinjam (ada LoanItem dengan returned: false)
    const activeLoanItem = await prisma.loanItem.findFirst({
      where: {
        bookId: id,
        returned: false,
      },
    });

    if (activeLoanItem) {
      return NextResponse.json(
        { error: "Buku tidak dapat dihapus karena sedang dipinjam." },
        { status: 400 }
      );
    }

    // Hapus buku jika tidak sedang dipinjam
    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Buku berhasil dihapus." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus buku." },
      { status: 500 }
    );
  }
}
