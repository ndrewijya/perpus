"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

/**
 * Tipe data peminjaman buku.
 */
type Loan = {
  id: string;
  borrower: string;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  status: string;
};

export default function LoanReturnPage({ params }: { params: { id: string } }) {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Fetch detail peminjaman
  useEffect(() => {
    const fetchLoan = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/loans/${params.id}`);
        if (!res.ok) throw new Error("Gagal mengambil data peminjaman");
        const data = await res.json();
        setLoan(data);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setFetching(false);
      }
    };
    fetchLoan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Handler pengembalian buku
  const handleReturn = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/loans/${params.id}/return`, {
        method: "POST",
      });
      if (!res.ok) {
        let errorMsg = "Gagal mengembalikan buku";
        try {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      toast({
        title: "Berhasil",
        description: "Buku berhasil dikembalikan!",
      });
      router.push("/loans");
      router.refresh();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler tombol batal
  const handleCancel = () => {
    router.push("/loans");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h1 className="text-xl font-bold mb-4">Konfirmasi Pengembalian Buku</h1>

      {fetching ? (
        <div className="text-center py-8">Memuat data peminjaman...</div>
      ) : loan ? (
        <div className="mb-6">
          <table className="w-full text-sm mb-4">
            <tbody>
              <tr>
                <td className="font-semibold py-1">Judul Buku</td>
                <td className="py-1">{loan.bookTitle}</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">Nama Peminjam</td>
                <td className="py-1">{loan.borrower}</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">Tanggal Pinjam</td>
                <td className="py-1">{loan.loanDate}</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">Jatuh Tempo</td>
                <td className="py-1">{loan.dueDate}</td>
              </tr>
              <tr>
                <td className="font-semibold py-1">Status</td>
                <td className="py-1">{loan.status}</td>
              </tr>
            </tbody>
          </table>
          <p>
            Apakah Anda yakin ingin <b>MENGEMBALIKAN</b> buku ini?
          </p>
        </div>
      ) : (
        <div className="text-red-500">Data peminjaman tidak ditemukan.</div>
      )}

      <div className="flex gap-2 mt-4">
        <Button onClick={handleReturn} disabled={loading || fetching || !loan}>
          {loading ? "Memproses..." : "Kembalikan Buku"}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={loading || fetching}
        >
          Batal
        </Button>
      </div>
    </div>
  );
}
