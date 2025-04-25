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
import { Eye, RotateCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Loan {
  id: string;
  userId: string;
  user: {
    name: string;
  };
  loanDate: Date;
  returnDate: Date | null;
  status: string;
  _count: {
    loanItems: number;
  };
}

interface LoanTableProps {
  loans: Loan[];
}

export function LoanTable({ loans }: LoanTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredLoans = loans.filter((loan) =>
    loan.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewLoan = (loanId: string) => {
    toast({
      title: "Melihat detail peminjaman",
      description: `Melihat detail peminjaman dengan ID: ${loanId}`,
    });
  };

  const handleReturnLoan = (loanId: string) => {
    toast({
      title: "Pengembalian buku",
      description: `Memproses pengembalian buku untuk peminjaman ID: ${loanId}`,
    });
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
              <TableHead>Anggota</TableHead>
              <TableHead>Tanggal Pinjam</TableHead>
              <TableHead>Tanggal Kembali</TableHead>
              <TableHead>Jumlah Buku</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada data peminjaman.
                </TableCell>
              </TableRow>
            ) : (
              filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">
                    {loan.user.name}
                  </TableCell>
                  <TableCell>
                    {new Date(loan.loanDate).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    {loan.returnDate
                      ? new Date(loan.returnDate).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell>{loan._count.loanItems}</TableCell>
                  <TableCell>
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewLoan(loan.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      {loan.status === "BORROWED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnLoan(loan.id)}
                        >
                          <RotateCw className="h-4 w-4 mr-1" />
                          Kembalikan
                        </Button>
                      )}
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
