import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookTable } from "@/components/book-table";
import { prisma } from "@/lib/prisma";

// Pastikan ini adalah server component (tidak pakai "use client")
export default async function BooksPage() {
  // Ambil data buku asli dari database
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Daftar Buku
          </h1>
          <p className="text-muted-foreground">
            Kelola koleksi buku perpustakaan
          </p>
        </div>
        <Link href="/books/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Buku
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Koleksi Buku</CardTitle>
          <CardDescription>
            Total {books.length} buku dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookTable books={books} />
        </CardContent>
      </Card>
    </div>
  );
}
