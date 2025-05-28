import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Ambil data anggota dari tabel Member, urutkan berdasarkan nama
    const members = await prisma.member.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    // Log error di server dan kirim pesan error ke client
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data anggota" },
      { status: 500 }
    );
  }
}
