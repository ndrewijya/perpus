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
import LoanTable from "@/components/loan-table";
import { prisma } from "@/lib/prisma";

export default async function LoansPage() {
  // Ambil data peminjaman asli dari database
  const loansRaw = await prisma.loan.findMany({
    include: {
      member: true,
      loanItems: { include: { book: true } },
    },
    orderBy: { loanDate: "desc" },
  });

  const loans = loansRaw.map((loan) => ({
    ...loan,
    loanDate: loan.loanDate ? loan.loanDate.toISOString() : "",
    dueDate: loan.dueDate ? loan.dueDate.toISOString() : "",
    returnDate: loan.returnDate ? loan.returnDate.toISOString() : "",
  }));

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
