import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";

interface UserLoansReportProps {
  users: {
    id: string;
    name: string;
    email: string;
    loans: {
      id: string;
      loanDate: Date;
      returnDate: Date | null;
      status: string;
      loanItems: {
        id: string;
        book: { title: string; author: string };
        returned: boolean;
      }[];
    }[];
  }[];
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("id-ID");
}

export default function UserLoansReport({ users }: UserLoansReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-primary" />
          Peminjaman per Anggota
        </CardTitle>
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
                    <span className="font-medium">{user.loans.length}</span>
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
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : loan.status === "RETURNED"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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
