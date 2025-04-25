import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserTable } from "@/components/user-table";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Anggota Perpustakaan
          </h1>
          <p className="text-muted-foreground">
            Kelola data anggota perpustakaan
          </p>
        </div>
        <Link href="/users/new">
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
            Total {users.length} anggota terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
