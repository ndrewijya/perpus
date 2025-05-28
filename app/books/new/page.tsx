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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookPlus } from "lucide-react";

export default function NewBookPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      year: Number.parseInt(formData.get("year") as string) || null,
      isbn: formData.get("isbn") as string,
      stock: Number.parseInt(formData.get("stock") as string) || 1,
      description: formData.get("description") as string,
    };

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan buku");
      }

      toast({
        title: "Berhasil!",
        description: "Buku baru telah ditambahkan",
      });
      router.push("/books");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error!",
        description: "Gagal menambahkan buku",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Tambah Buku Baru</h1>
        <p className="page-subtitle">Tambahkan buku baru ke perpustakaan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookPlus className="mr-2 h-5 w-5 text-primary" />
            Detail Buku
          </CardTitle>
          <CardDescription>
            Masukkan informasi lengkap tentang buku
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul Buku <span className="text-destructive">*</span>
              </Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">
                Pengarang <span className="text-destructive">*</span>
              </Label>
              <Input id="author" name="author" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publisher">Penerbit</Label>
              <Input id="publisher" name="publisher" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Tahun Terbit</Label>
                <Input id="year" name="year" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">
                  Stok <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue="1"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">
                ISBN <span className="text-destructive">*</span>
              </Label>
              <Input id="isbn" name="isbn" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
