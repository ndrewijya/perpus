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
import { UserPlus } from "lucide-react";

export default function NewUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan anggota");
      }

      toast({
        title: "Berhasil!",
        description: "Anggota baru telah ditambahkan",
      });
      router.push("/users");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error!",
        description: "Gagal menambahkan anggota",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Tambah Anggota Baru</h1>
        <p className="page-subtitle">Tambahkan anggota baru ke perpustakaan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-primary" />
            Detail Anggota
          </CardTitle>
          <CardDescription>
            Masukkan informasi lengkap tentang anggota
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama <span className="text-destructive">*</span>
              </Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" name="address" />
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
