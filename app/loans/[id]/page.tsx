import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

/**
 * Halaman detail peminjaman buku.
 * @param params - Parameter route, berisi id peminjaman.
 */
export default async function LoanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Ambil data peminjaman beserta anggota dan item buku yang dipinjam
  const loan = await prisma.loan.findUnique({
    where: { id: params.id },
    include: {
      member: true,
      loanItems: { include: { book: true } },
    },
  });

  // Jika data tidak ditemukan, tampilkan halaman 404
  if (!loan) return notFound();

  // Format tanggal
  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h1 className="text-2xl font-bold mb-6">Detail Peminjaman</h1>
      <div className="mb-4">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="font-semibold py-1 w-40">Nama Anggota</td>
              <td className="py-1">{loan.member.name}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Tanggal Pinjam</td>
              <td className="py-1">{formatDate(loan.loanDate)}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Jatuh Tempo</td>
              <td className="py-1">{formatDate(loan.dueDate)}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1">Status</td>
              <td className="py-1">
                {loan.status === "BORROWED" ? (
                  <span className="text-yellow-600 font-medium">Dipinjam</span>
                ) : (
                  <span className="text-green-600 font-medium">
                    Dikembalikan
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <b>Buku yang Dipinjam:</b>
        <ul className="list-disc list-inside mt-2">
          {loan.loanItems.length === 0 ? (
            <li className="text-muted-foreground">Tidak ada buku.</li>
          ) : (
            loan.loanItems.map((item) => (
              <li key={item.id}>
                <span className="font-medium">{item.book.title}</span>{" "}
                <span className="text-sm text-muted-foreground">
                  ({item.quantity} buah)
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
