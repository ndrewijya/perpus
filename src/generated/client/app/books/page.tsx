import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string | null;
  year: number | null;
  isbn: string | null;
  stock: number;
};

const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Judul",
  },
  {
    accessorKey: "author",
    header: "Pengarang",
  },
  {
    accessorKey: "publisher",
    header: "Penerbit",
    cell: ({ row }) => row.original.publisher || "-",
  },
  {
    accessorKey: "year",
    header: "Tahun",
    cell: ({ row }) => row.original.year || "-",
  },
  {
    accessorKey: "stock",
    header: "Stok",
    cell: ({ row }) => (
      <span
        className={
          row.original.stock > 0
            ? "text-green-600 font-medium"
            : "text-red-600 font-medium"
        }
      >
        {row.original.stock}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/books/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            Detail
          </Button>
        </Link>
        <Link href={`/books/${row.original.id}/edit`}>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </Link>
      </div>
    ),
  },
];

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daftar Buku</h1>
        <Link href="/books/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Buku
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={books}
        searchKey="title"
        searchPlaceholder="Cari judul buku..."
      />
    </div>
  );
}
