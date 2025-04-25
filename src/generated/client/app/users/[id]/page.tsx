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

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      loans: {
        include: {
          loanItems: {
            include: {
              book: true,
            },
          },
        },
        orderBy: {
          loanDate: "desc",
        },
      },
      _count: {
        select: {
          loans: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Detail Anggota</CardTitle>
              <CardDescription>
                Informasi anggota dan riwayat peminjaman
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Link href="/users">
                <Button variant="outline">Kembali</Button>
              </Link>
              <Link href={`/users/${user.id}/edit`}>
                <Button>Edit Anggota</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Nama
              </h3>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Telepon
              </h3>
              <p>{user.phone || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Terdaftar Sejak
              </h3>
              <p>{formatDate(user.createdAt)}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Alamat
              </h3>
              <p>{user.address || "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">
              Riwayat Peminjaman ({user._count.loans})
            </h3>
            {user.loans.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                Belum ada riwayat peminjaman
              </p>
            ) : (
              <div className="space-y-4">
                {user.loans.map((loan) => (
                  <div key={loan.id} className="border rounded-md">
                    <div className="bg-muted/50 p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">
                          Peminjaman {formatDate(loan.loanDate)}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
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
                        <Link href={`/loans/${loan.id}`}>
                          <Button variant="ghost" size="sm">
                            Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="p-3">
                      <h5 className="text-sm font-medium mb-2">
                        Buku yang Dipinjam:
                      </h5>
                      <ul className="list-disc list-inside space-y-1">
                        {loan.loanItems.map((item) => (
                          <li key={item.id} className="text-sm">
                            {item.book.title} ({item.book.author})
                            {item.returned
                              ? " - Dikembalikan"
                              : " - Belum dikembalikan"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
