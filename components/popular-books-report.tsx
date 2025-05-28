import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface PopularBook {
  id: string;
  title: string;
  author: string;
  loanCount: number;
}

export default function PopularBooksReport({
  books,
}: {
  books: PopularBook[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          Buku Paling Sering Dipinjam
        </CardTitle>
        <CardDescription>
          Daftar 10 buku yang paling sering dipinjam
        </CardDescription>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
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
                {books.map((book, index) => (
                  <tr key={book.id} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">{book.loanCount}</td>
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
