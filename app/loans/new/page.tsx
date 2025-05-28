"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash, Check, BookMarked, Calendar } from "lucide-react";
import MemberSearch from "@/components/member-search";

type Member = {
  id: string;
  name: string;
  email: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
  stock: number;
};

type SelectedBook = {
  bookId: string;
  quantity: number;
};

export default function NewLoanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dueDate, setDueDate] = useState<string>("");

  const { toast } = useToast();
  const router = useRouter();

  // Fetch books only (anggota pakai MemberSearch)
  useEffect(() => {
    async function fetchBooks() {
      try {
        const booksRes = await fetch("/api/books");
        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setBooks(booksData.filter((b: Book) => b.stock > 0));
          setFilteredBooks(booksData.filter((b: Book) => b.stock > 0));
        }
      } catch (err) {
        toast({
          title: "Gagal mengambil data",
          description: "Terjadi kesalahan saat mengambil data buku.",
          variant: "destructive",
        });
      }
    }
    fetchBooks();
  }, [toast]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBooks(
        books.filter(
          (b) =>
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  function addBookToSelection(bookId: string) {
    if (!selectedBooks.find((b) => b.bookId === bookId)) {
      setSelectedBooks([...selectedBooks, { bookId, quantity: 1 }]);
    }
  }

  function removeBookFromSelection(bookId: string) {
    setSelectedBooks(selectedBooks.filter((b) => b.bookId !== bookId));
  }

  function updateBookQuantity(bookId: string, quantity: number) {
    setSelectedBooks(
      selectedBooks.map((b) => (b.bookId === bookId ? { ...b, quantity } : b))
    );
  }

  function handleCancel() {
    setSelectedMember(null);
    setSelectedBooks([]);
    setDueDate("");
    router.push("/loans");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedMember) {
      toast({
        title: "Pilih anggota terlebih dahulu",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if (selectedBooks.length === 0) {
      toast({
        title: "Pilih minimal satu buku",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if (!dueDate) {
      toast({
        title: "Tanggal jatuh tempo wajib diisi",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    // Validasi jumlah
    for (const { bookId, quantity } of selectedBooks) {
      const book = books.find((b) => b.id === bookId);
      if (!book) continue;
      if (quantity < 1 || quantity > book.stock) {
        toast({
          title: `Jumlah pinjam untuk buku "${book.title}" tidak valid.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    const data = {
      memberId: selectedMember.id,
      books: selectedBooks.map((b) => ({
        bookId: b.bookId,
        quantity: b.quantity,
      })),
      dueDate,
    };

    try {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat peminjaman");
      }
      toast({
        title: "Berhasil!",
        description: "Peminjaman buku telah dicatat.",
      });
      router.push("/loans");
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Peminjaman Buku Baru</h1>
      <p className="mb-6 text-muted-foreground">
        Catat peminjaman buku oleh anggota perpustakaan
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookMarked className="mr-2 h-5 w-5 text-primary" />
            Form Peminjaman Buku
          </CardTitle>
          <CardDescription>
            Pilih anggota, buku, jumlah, dan tempo pengembalian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Anggota */}
            <div>
              <Label htmlFor="memberId">
                Anggota <span className="text-destructive">*</span>
              </Label>
              <MemberSearch
                value={selectedMember}
                onSelect={setSelectedMember}
              />
            </div>
            {/* Pilih Buku */}
            <div>
              <Label>Cari Buku</Label>
              <Input
                placeholder="Cari judul atau pengarang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {filteredBooks.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Tidak ada buku tersedia
                  </div>
                ) : (
                  filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className={`flex items-center justify-between p-2 border-b last:border-b-0 ${
                        selectedBooks.find((b) => b.bookId === book.id)
                          ? "bg-primary/10"
                          : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {book.author} (Stok: {book.stock})
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          selectedBooks.find((b) => b.bookId === book.id)
                            ? "default"
                            : "outline"
                        }
                        disabled={book.stock === 0}
                        onClick={() => addBookToSelection(book.id)}
                      >
                        {selectedBooks.find((b) => b.bookId === book.id) ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> Dipilih
                          </>
                        ) : (
                          <>
                            <Plus className="mr-1 h-4 w-4" /> Pilih
                          </>
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Daftar Buku yang Dipilih */}
            {selectedBooks.length > 0 && (
              <div>
                <Label>Buku yang Dipilih</Label>
                <div className="border rounded-md p-2 space-y-2">
                  {selectedBooks.map((sb) => {
                    const book = books.find((b) => b.id === sb.bookId);
                    if (!book) return null;
                    return (
                      <div
                        key={book.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="font-medium">{book.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {book.author} (Stok: {book.stock})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={book.stock}
                            value={sb.quantity}
                            className="w-20"
                            onChange={(e) =>
                              updateBookQuantity(
                                book.id,
                                Math.max(
                                  1,
                                  Math.min(Number(e.target.value), book.stock)
                                )
                              )
                            }
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => removeBookFromSelection(book.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* Tempo Pengembalian */}
            <div>
              <Label htmlFor="dueDate">
                Tanggal Jatuh Tempo <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            {/* Submit */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Menyimpan..." : "Simpan Peminjaman"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
