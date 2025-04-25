import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

type Loan = {
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
};

const columns: ColumnDef<Loan>[] = [
  {
    accessorKey: "user.name",
    header: "Anggota",
    cell: ({ row }) => row.original.user.name,
  },
  {
    accessorKey: "loanDate",
    header: "Tanggal Pinjam",
    cell: ({ row }) => formatDate(row.original.loanDate),
  },
  {
    accessorKey: "returnDate",
    header: "Tanggal Kembali",
    cell: ({ row }) =>
      row.original.returnDate ? formatDate(row.original.returnDate) : "-",
  },
  {
    accessorKey: "_count.loanItems",
    header: "Jumlah Buku",
    cell: ({ row }) => row.original._count.loanItems,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.status === "BORROWED"
            ? "bg-blue-100 text-blue-800"
            : row.original.status === "RETURNED"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status === "BORROWED"
          ? "Dipinjam"
          : row.original.status === "RETURNED"
          ? "Dikembalikan"
          : "Terlambat"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/loans/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            Detail
          </Button>
        </Link>
        {row.original.status === "BORROWED" && (
          <Link href={`/loans/${row.original.id}/return`}>
            <Button variant="outline" size="sm">
              Kembalikan
            </Button>
          </Link>
        )}
      </div>
    ),
  },
];

export default async function LoansPage() {
  const loans = await prisma.loan.findMany({
    orderBy: {
      loanDate: "desc",
    },
    include: {
      user: true,
      _count: {
        select: {
          loanItems: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Peminjaman Buku</h1>
        <Link href="/loans/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Peminjaman Baru
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={loans}
        searchKey="user.name"
        searchPlaceholder="Cari anggota..."
      />
    </div>
  );
}
