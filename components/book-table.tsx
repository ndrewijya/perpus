"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { Search, Eye, Edit, X, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string | null;
  year: number | null;
  isbn: string | null;
  stock: number;
  description?: string | null;
}

interface BookTableProps {
  books: Book[];
}

export function BookTable({ books }: BookTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleEditBook = (book: Book) => {
    router.push(`/books/${book.id}/edit`);
  };

  const handleDeleteBook = async (book: Book) => {
    if (!confirm(`Yakin ingin menghapus buku "${book.title}"?`)) return;
    setDeletingId(book.id);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: "Buku dihapus",
          description: `"${book.title}" berhasil dihapus.`,
        });
        startTransition(() => {
          router.refresh();
        });
      } else {
        throw new Error(data.error || "Gagal menghapus buku");
      }
    } catch (err: any) {
      toast({
        title: "Gagal menghapus buku",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseDetail = () => setSelectedBook(null);

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
              <TableHead className="text-center w-28">Aksi</TableHead>
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
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewBook(book)}
                        aria-label="Detail"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditBook(book)}
                        aria-label="Edit"
                        className="text-yellow-600 hover:bg-yellow-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === book.id || isPending}
                        onClick={() => handleDeleteBook(book)}
                        aria-label="Hapus"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Detail Buku */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleCloseDetail}
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Detail Buku</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Judul:</span>{" "}
                {selectedBook.title}
              </div>
              <div>
                <span className="font-semibold">Deskripsi:</span>{" "}
                {selectedBook.description || "Tidak ada deskripsi."}
              </div>
              <div>
                <span className="font-semibold">Pengarang:</span>{" "}
                {selectedBook.author}
              </div>
              <div>
                <span className="font-semibold">Penerbit:</span>{" "}
                {selectedBook.publisher || "-"}
              </div>
              <div>
                <span className="font-semibold">Tahun:</span>{" "}
                {selectedBook.year || "-"}
              </div>
              <div>
                <span className="font-semibold">ISBN:</span>{" "}
                {selectedBook.isbn || "-"}
              </div>
              <div>
                <span className="font-semibold">Stok:</span>{" "}
                {selectedBook.stock}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
