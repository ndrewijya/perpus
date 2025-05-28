import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Cek apakah anggota punya loan aktif (status: BORROWED) dengan loanItems yang belum dikembalikan
    const activeLoan = await prisma.loan.findFirst({
      where: {
        memberId: id,
        status: "BORROWED",
        loanItems: {
          some: { returned: false },
        },
      },
    });

    if (activeLoan) {
      return NextResponse.json({ status: "Sedang Meminjam" });
    }
    return NextResponse.json({ status: "Tidak Meminjam" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "Tidak diketahui", error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
