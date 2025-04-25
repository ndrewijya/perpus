import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nama dan email wajib diisi" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat anggota" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data anggota" },
      { status: 500 }
    );
  }
}
