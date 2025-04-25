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
import { LoanTable } from "@/components/loan-table";

export default function LoansPage() {
  // Contoh data peminjaman
  const loans = [
    {
      id: "1",
      userId: "1",
      user: { name: "John Doe" },
      loanDate: new Date("2023-06-01"),
      returnDate: null,
      status: "BORROWED",
      _count: { loanItems: 2 },
    },
    {
      id: "2",
      userId: "2",
      user: { name: "Jane Smith" },
      loanDate: new Date("2023-06-05"),
      returnDate: new Date("2023-06-15"),
      status: "RETURNED",
      _count: { loanItems: 1 },
    },
    {
      id: "3",
      userId: "3",
      user: { name: "Robert Johnson" },
      loanDate: new Date("2023-06-10"),
      returnDate: null,
      status: "BORROWED",
      _count: { loanItems: 3 },
    },
    {
      id: "4",
      userId: "4",
      user: { name: "Emily Davis" },
      loanDate: new Date("2023-06-15"),
      returnDate: null,
      status: "OVERDUE",
      _count: { loanItems: 2 },
    },
    {
      id: "5",
      userId: "5",
      user: { name: "Michael Brown" },
      loanDate: new Date("2023-06-20"),
      returnDate: new Date("2023-06-25"),
      status: "RETURNED",
      _count: { loanItems: 1 },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Peminjaman Buku
          </h1>
          <p className="text-muted-foreground">
            Kelola peminjaman buku perpustakaan
          </p>
        </div>
        <Link href="/loans/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Peminjaman Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Daftar Peminjaman</CardTitle>
          <CardDescription>
            Total {loans.length} peminjaman tercatat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanTable loans={loans} />
        </CardContent>
      </Card>
    </div>
  );
}
