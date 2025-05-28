import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { MemberTable } from "@/components/member-table";
import { prisma } from "@/lib/prisma";

export default async function MembersPage() {
  let members = [];
  try {
    members = await prisma.member.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    // Jika gagal ambil data, tampilkan pesan error sederhana di UI
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Daftar Anggota</h1>
        <div className="text-red-500 font-semibold">
          Gagal mengambil data anggota. Silakan cek koneksi database/server.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Daftar Anggota
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
      <MemberTable members={members} />
    </div>
  );
}
