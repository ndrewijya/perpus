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

export default function BooksPage() {
  // Contoh data buku
  const books = [
    {
      id: "1",
      title: "Pemrograman Web",
      author: "John Doe",
      publisher: "Tech Publishing",
      year: 2022,
      isbn: "978-1234567890",
      stock: 5,
    },
    {
      id: "2",
      title: "Database Design",
      author: "Jane Smith",
      publisher: "Data Books",
      year: 2021,
      isbn: "978-0987654321",
      stock: 3,
    },
    {
      id: "3",
      title: "Artificial Intelligence",
      author: "Robert Johnson",
      publisher: "AI Press",
      year: 2023,
      isbn: "978-5678901234",
      stock: 2,
    },
    {
      id: "4",
      title: "Data Structures",
      author: "Emily Davis",
      publisher: "Code Books",
      year: 2020,
      isbn: "978-4321098765",
      stock: 0,
    },
    {
      id: "5",
      title: "Machine Learning",
      author: "Michael Brown",
      publisher: "Tech Publishing",
      year: 2022,
      isbn: "978-9876543210",
      stock: 4,
    },
  ];

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
