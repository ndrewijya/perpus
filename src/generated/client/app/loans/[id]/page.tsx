import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function LoanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const loan = await prisma.loan.findUnique({
    where: {
      id: params.id,
    },
    include: {
      user: true,
      loanItems: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!loan) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Detail Peminjaman</CardTitle>
              <CardDescription>Informasi peminjaman buku</CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/loans">
                <Button variant="outline">Kembali</Button>
              </Link>
              {loan.status === "BORROWED" && (
                <Link href={`/loans/${loan.id}/return`}>
                  <Button>Kembalikan Buku</Button>
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Anggota
              </h3>
              <p className="text-lg font-medium">{loan.user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <p>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
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
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tanggal Pinjam
              </h3>
              <p>{formatDate(loan.loanDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Tanggal Kembali
              </h3>
              <p>{loan.returnDate ? formatDate(loan.returnDate) : "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Daftar Buku</h3>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Judul Buku</th>
                    <th className="p-3 text-left font-medium">Pengarang</th>
                    <th className="p-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.loanItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-3 font-medium">{item.book.title}</td>
                      <td className="p-3">{item.book.author}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.returned
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.returned ? "Dikembalikan" : "Dipinjam"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
