import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <BookX className="h-24 w-24 text-primary/50 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin
        telah dipindahkan atau dihapus.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Kembali ke Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/books">Lihat Daftar Buku</Link>
        </Button>
      </div>
    </div>
  );
}
