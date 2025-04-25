import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MemberTable } from "@/components/member-table";

export default function MembersPage() {
  // Contoh data anggota
  const members = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "081234567890",
      address: "Jl. Contoh No. 1",
      createdAt: new Date("2023-01-15"),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "082345678901",
      address: "Jl. Contoh No. 2",
      createdAt: new Date("2023-02-20"),
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "083456789012",
      address: "Jl. Contoh No. 3",
      createdAt: new Date("2023-03-25"),
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "084567890123",
      address: "Jl. Contoh No. 4",
      createdAt: new Date("2023-04-10"),
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "085678901234",
      address: "Jl. Contoh No. 5",
      createdAt: new Date("2023-05-05"),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Anggota Perpustakaan
          </h1>
          <p className="text-muted-foreground">
            Kelola data anggota perpustakaan
          </p>
        </div>
        <Link href="/members/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Anggota
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Anggota</CardTitle>
          <CardDescription>
            Total {members.length} anggota terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MemberTable members={members} />
        </CardContent>
      </Card>
    </div>
  );
}
