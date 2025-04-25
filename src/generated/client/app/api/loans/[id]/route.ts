import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const loan = await prisma.loan.findUnique({
      where: {
        id: params.id,
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

    if (!loan) {
      return NextResponse.json(
        { error: "Peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(loan);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data peminjaman" },
      { status: 500 }
    );
  }
}
