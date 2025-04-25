"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Eye, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string | null;
  year: number | null;
  isbn: string | null;
  stock: number;
}

interface BookTableProps {
  books: Book[];
}

export function BookTable({ books }: BookTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBook = (bookId: string) => {
    toast({
      title: "Melihat detail buku",
      description: `Melihat detail buku dengan ID: ${bookId}`,
    });
  };

  const handleEditBook = (bookId: string) => {
    toast({
      title: "Edit buku",
      description: `Mengedit buku dengan ID: ${bookId}`,
    });
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari judul atau pengarang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Pengarang</TableHead>
              <TableHead className="hidden md:table-cell">Penerbit</TableHead>
              <TableHead className="hidden md:table-cell">Tahun</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada data buku.
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {book.publisher || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {book.year || "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        book.stock > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {book.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewBook(book.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBook(book.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
