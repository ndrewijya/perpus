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
import { RotateCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Komponen tanggal agar aman dari hydration error
function LocalizedDate({ dateStr }: { dateStr: string }) {
  const [localDate, setLocalDate] = useState<string>("");

  useEffect(() => {
    if (!dateStr) {
      setLocalDate("-");
      return;
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      setLocalDate("-");
      return;
    }
    setLocalDate(
      date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );
  }, [dateStr]);

  return <span>{localDate}</span>;
}

interface LoanItem {
  id: string;
  book: { title: string };
  quantity: number;
  returned: boolean;
}

interface Loan {
  id: string;
  member: { name: string };
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  loanItems: LoanItem[];
}

interface LoanTableProps {
  loans: Loan[];
}

export default function LoanTable({ loans }: LoanTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Filter berdasarkan nama anggota
  const filteredLoans = loans.filter((loan) =>
    loan.member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tampilkan toast saat klik pengembalian
  const handleReturnLoan = async (loanId: string, loanItems: LoanItem[]) => {
    try {
      // Ambil semua loanItemId yang belum dikembalikan
      const loanItemIds = loanItems
        .filter((item) => !item.returned)
        .map((item) => item.id);

      if (loanItemIds.length === 0) {
        toast({
          title: "Info",
          description: "Semua buku pada peminjaman ini sudah dikembalikan.",
        });
        return;
      }

      const res = await fetch(`/api/loans/${loanId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanId, loanItemIds }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengembalikan buku");
      }

      toast({
        title: "Sukses",
        description: "Buku berhasil dikembalikan!",
      });

      // Refresh halaman agar tabel terupdate
      window.location.reload();
      // Jika pakai Next.js App Router, bisa juga pakai: router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama anggota..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Anggota</TableHead>
              <TableHead className="text-center">Nama Buku</TableHead>
              <TableHead className="text-center">Tanggal Pinjam</TableHead>
              <TableHead className="text-center">Jatuh Tempo</TableHead>
              <TableHead className="text-center">Jumlah Buku</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Tidak ada data peminjaman.
                </TableCell>
              </TableRow>
            ) : (
              filteredLoans.map((loan) => {
                // Gabungkan semua judul buku
                const namaBuku =
                  loan.loanItems.length > 0
                    ? loan.loanItems.map((item) => item.book?.title).join(", ")
                    : "-";
                // Jumlahkan quantity semua buku
                const jumlahBuku =
                  loan.loanItems.length > 0
                    ? loan.loanItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )
                    : "-";
                return (
                  <TableRow key={loan.id}>
                    <TableCell className="text-center font-medium">
                      {loan.member.name}
                    </TableCell>
                    <TableCell className="text-center">{namaBuku}</TableCell>
                    <TableCell className="text-center">
                      <LocalizedDate dateStr={loan.loanDate} />
                    </TableCell>
                    <TableCell className="text-center">
                      <LocalizedDate dateStr={loan.dueDate} />
                    </TableCell>
                    <TableCell className="text-center">{jumlahBuku}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          loan.status === "BORROWED"
                            ? "bg-blue-100 text-blue-800"
                            : loan.status === "RETURNED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {loan.status === "BORROWED"
                          ? "Dipinjam"
                          : loan.status === "RETURNED"
                          ? "Dikembalikan"
                          : "Terlambat"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {loan.status === "BORROWED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleReturnLoan(loan.id, loan.loanItems)
                            }
                            title="Kembalikan"
                          >
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
