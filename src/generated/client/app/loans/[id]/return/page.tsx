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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type LoanWithItems = {
  id: string;
  user: {
    name: string;
  };
  loanDate: string;
  loanItems: {
    id: string;
    bookId: string;
    returned: boolean;
    book: {
      title: string;
      author: string;
    };
  }[];
};

export default function ReturnLoanPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loan, setLoan] = useState<LoanWithItems | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchLoan() {
      try {
        const response = await fetch(`/api/loans/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setLoan(data);

          // Pre-select all non-returned items
          const nonReturnedItems = data.loanItems
            .filter((item: any) => !item.returned)
            .map((item: any) => item.id);

          setSelectedItems(nonReturnedItems);
        } else {
          toast({
            title: "Error!",
            description: "Gagal mengambil data peminjaman",
            variant: "destructive",
          });
          router.push("/loans");
        }
      } catch (error) {
        console.error("Error fetching loan:", error);
        toast({
          title: "Error!",
          description: "Gagal mengambil data peminjaman",
          variant: "destructive",
        });
        router.push("/loans");
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchLoan();
  }, [params.id, toast, router]);

  function toggleItemSelection(itemId: string) {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (selectedItems.length === 0) {
      toast({
        title: "Error!",
        description: "Pilih minimal satu buku untuk dikembalikan",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const data = {
      loanId: params.id,
      loanItemIds: selectedItems,
    };

    try {
      const response = await fetch("/api/loans/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengembalikan buku");
      }

      toast({
        title: "Berhasil!",
        description: "Pengembalian buku telah dicatat",
      });
      router.push("/loans");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error!",
        description: error.message || "Gagal mengembalikan buku",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>Peminjaman tidak ditemukan</p>
      </div>
    );
  }

  const nonReturnedItems = loan.loanItems.filter((item) => !item.returned);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Pengembalian Buku</CardTitle>
          <CardDescription>
            Catat pengembalian buku oleh {loan.user.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Tanggal Peminjaman: {formatDate(loan.loanDate)}
            </p>
          </div>

          {nonReturnedItems.length === 0 ? (
            <div className="text-center py-6">
              <p>Semua buku sudah dikembalikan</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => router.push("/loans")}
              >
                Kembali ke Daftar Peminjaman
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Buku yang Belum Dikembalikan</h3>
                <div className="border rounded-md p-2">
                  {nonReturnedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-2 py-2"
                    >
                      <Checkbox
                        id={item.id}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                      <label
                        htmlFor={item.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        <div>{item.book.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.book.author}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

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
                  disabled={isLoading || selectedItems.length === 0}
                >
                  {isLoading ? "Menyimpan..." : "Kembalikan Buku"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
