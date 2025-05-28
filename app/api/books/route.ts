import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data buku" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { title, author, publisher, year, isbn, stock, description } = body;

    if (!title || !author) {
      return NextResponse.json(
        { error: "Judul dan pengarang wajib diisi" },
        { status: 400 }
      );
    }

    if (isbn) {
      const existingBook = await prisma.book.findUnique({ where: { isbn } });
      if (existingBook) {
        return NextResponse.json(
          { error: "ISBN sudah terdaftar" },
          { status: 400 }
        );
      }
    }

    year = year ? Number(year) : null;
    stock = typeof stock === "number" ? stock : Number(stock);
    if (isNaN(stock) || stock < 0) stock = 1;

    const book = await prisma.book.create({
      data: { title, author, publisher, year, isbn, stock, description },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan buku" },
      { status: 500 }
    );
  }
}
