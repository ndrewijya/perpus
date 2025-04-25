import Link from "next/link";
import { BookOpen, Users, BookMarked, BarChart3, Home } from "lucide-react";

export function MainNav() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Perpustakaan
        </Link>
      </div>
      <nav className="flex items-center space-x-6 mt-2">
        <Link href="/" className="flex items-center text-sm font-medium">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
        <Link href="/books" className="flex items-center text-sm font-medium">
          <BookOpen className="mr-2 h-4 w-4" />
          Buku
        </Link>
        <Link href="/users" className="flex items-center text-sm font-medium">
          <Users className="mr-2 h-4 w-4" />
          Anggota
        </Link>
        <Link href="/loans" className="flex items-center text-sm font-medium">
          <BookMarked className="mr-2 h-4 w-4" />
          Peminjaman
        </Link>
        <Link href="/reports" className="flex items-center text-sm font-medium">
          <BarChart3 className="mr-2 h-4 w-4" />
          Laporan
        </Link>
      </nav>
    </div>
  );
}
