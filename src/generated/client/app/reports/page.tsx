import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Laporan</h1>

      <Tabs defaultValue="popular" className="space-y-4">
        <TabsList>
          <TabsTrigger value="popular">Buku Populer</TabsTrigger>
          <TabsTrigger value="user">Peminjaman per Anggota</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="space-y-4">
          <PopularBooksReport />
        </TabsContent>
        <TabsContent value="user" className="space-y-4">
          <UserLoansReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function PopularBooksReport() {
  const popularBooks = await prisma.book.findMany({
    orderBy: {
      loanItems: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: {
          loanItems: true,
        },
      },
    },
    take: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buku Paling Sering Dipinjam</CardTitle>
        <CardDescription>
          Daftar 10 buku yang paling sering dipinjam
        </CardDescription>
      </CardHeader>
      <CardContent>
        {popularBooks.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Belum ada data peminjaman buku
          </p>
        ) : (
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">No</th>
                  <th className="p-3 text-left font-medium">Judul Buku</th>
                  <th className="p-3 text-left font-medium">Pengarang</th>
                  <th className="p-3 text-left font-medium">
                    Jumlah Peminjaman
                  </th>
                </tr>
              </thead>
              <tbody>
                {popularBooks.map((book, index) => (
                  <tr key={book.id} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book._count.loanItems}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function UserLoansReport() {
  const users = await prisma.user.findMany({
    include: {
      loans: {
        include: {
          loanItems: {
            include: {
              book: true,
            },
          },
        },
      },
      _count: {
        select: {
          loans: true,
        },
      },
    },
    orderBy: {
      loans: {
        _count: "desc",
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Peminjaman per Anggota</CardTitle>
        <CardDescription>
          Daftar peminjaman buku untuk setiap anggota
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">
            Belum ada data anggota
          </p>
        ) : (
          <div className="space-y-6">
            {users.map((user) => (
              <div key={user.id} className="rounded-md border">
                <div className="bg-muted/50 p-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm">
                    Total Peminjaman:{" "}
                    <span className="font-medium">{user._count.loans}</span>
                  </div>
                </div>

                {user.loans.length === 0 ? (
                  <p className="p-3 text-center text-muted-foreground">
                    Belum ada peminjaman
                  </p>
                ) : (
                  <div className="p-3 divide-y">
                    {user.loans.map((loan) => (
                      <div key={loan.id} className="py-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-sm">
                            <span className="font-medium">Tanggal Pinjam:</span>{" "}
                            {formatDate(loan.loanDate)}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Status:</span>{" "}
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
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Buku:</span>
                          <ul className="list-disc list-inside mt-1 ml-2">
                            {loan.loanItems.map((item) => (
                              <li key={item.id}>
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
