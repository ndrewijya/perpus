"use client";

import type React from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, Trash } from "lucide-react";

type User = {
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

export default function NewLoanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersResponse, booksResponse] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/books"),
        ]);

        if (usersResponse.ok && booksResponse.ok) {
          const usersData = await usersResponse.json();
          const booksData = await booksResponse.json();

          setUsers(usersData);
          setBooks(booksData.filter((book: Book) => book.stock > 0));
          setFilteredBooks(booksData.filter((book: Book) => book.stock > 0));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error!",
          description: "Gagal mengambil data",
          variant: "destructive",
        });
      }
    }

    fetchData();
  }, [toast]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  function toggleBookSelection(bookId: string) {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (!selectedUser) {
      toast({
        title: "Error!",
        description: "Pilih anggota terlebih dahulu",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (selectedBooks.length === 0) {
      toast({
        title: "Error!",
        description: "Pilih minimal satu buku",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const data = {
      userId: selectedUser,
      bookIds: selectedBooks,
    };

    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal membuat peminjaman");
      }

      toast({
        title: "Berhasil!",
        description: "Peminjaman buku telah dicatat",
      });
      router.push("/loans");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message || "Gagal membuat peminjaman",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Peminjaman Buku Baru</CardTitle>
          <CardDescription>
            Catat peminjaman buku oleh anggota perpustakaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId">Anggota</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pilih Buku</Label>
              <Input
                placeholder="Cari judul atau pengarang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="border rounded-md mt-2">
                <div className="max-h-60 overflow-y-auto p-2">
                  {filteredBooks.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      Tidak ada buku tersedia
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {filteredBooks.map((book) => (
                        <div
                          key={book.id}
                          className={`flex items-center justify-between p-2 rounded-md ${
                            selectedBooks.includes(book.id)
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {book.author} (Stok: {book.stock})
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant={
                              selectedBooks.includes(book.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => toggleBookSelection(book.id)}
                          >
                            {selectedBooks.includes(book.id) ? (
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
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedBooks.length > 0 && (
              <div className="space-y-2">
                <Label>Buku yang Dipilih ({selectedBooks.length})</Label>
                <div className="border rounded-md p-2">
                  {selectedBooks.map((bookId) => {
                    const book = books.find((b) => b.id === bookId);
                    return book ? (
                      <div
                        key={book.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookSelection(book.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading || !selectedUser || selectedBooks.length === 0
                }
              >
                {isLoading ? "Menyimpan..." : "Simpan Peminjaman"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
