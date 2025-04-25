import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telepon",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "address",
    header: "Alamat",
    cell: ({ row }) => row.original.address || "-",
  },
  {
    accessorKey: "createdAt",
    header: "Terdaftar",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/users/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            Detail
          </Button>
        </Link>
        <Link href={`/users/${row.original.id}/edit`}>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </Link>
      </div>
    ),
  },
];

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Anggota Perpustakaan</h1>
        <Link href="/users/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Cari anggota..."
      />
    </div>
  );
}
