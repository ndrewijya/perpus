import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const book = await prisma.book.findUnique({
    where: {
      id: params.id,
    },
    include: {
      _count: {
        select: {
          loanItems: true,
        },
      },
    },
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Detail Buku</CardTitle>
              <CardDescription>Informasi lengkap tentang buku</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/books">
                <Button variant="outline">Kembali</Button>
              </Link>
              <Link href={`/books/${book.id}/edit`}>
                <Button>Edit Buku</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Judul
              </h3>
              <p className="text-lg font-medium">{book.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Pengarang
              </h3>
              <p className="text-lg">{book.author}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Penerbit
              </h3>
              <p>{book.publisher || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tahun Terbit
              </h3>
              <p>{book.year || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                ISBN
              </h3>
              <p>{book.isbn || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Stok
              </h3>
              <p
                className={
                  book.stock > 0
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {book.stock}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Peminjaman
              </h3>
              <p>{book._count.loanItems}</p>
            </div>
          </div>

          {book.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Deskripsi
              </h3>
              <p className="text-sm">{book.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
