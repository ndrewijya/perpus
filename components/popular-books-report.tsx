import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export function PopularBooksReport() {
  // Contoh data buku populer
  const popularBooks = [
    {
      id: "1",
      title: "Pemrograman Web",
      author: "John Doe",
      _count: { loanItems: 27 },
    },
    {
      id: "2",
      title: "Database Design",
      author: "Jane Smith",
      _count: { loanItems: 24 },
    },
    {
      id: "3",
      title: "Artificial Intelligence",
      author: "Robert Johnson",
      _count: { loanItems: 21 },
    },
    {
      id: "4",
      title: "Data Structures",
      author: "Emily Davis",
      _count: { loanItems: 18 },
    },
    {
      id: "5",
      title: "Machine Learning",
      author: "Michael Brown",
      _count: { loanItems: 15 },
    },
    {
      id: "6",
      title: "Web Development",
      author: "Sarah Wilson",
      _count: { loanItems: 12 },
    },
    {
      id: "7",
      title: "Mobile App Development",
      author: "David Lee",
      _count: { loanItems: 10 },
    },
    {
      id: "8",
      title: "Cloud Computing",
      author: "Lisa Taylor",
      _count: { loanItems: 8 },
    },
    {
      id: "9",
      title: "Cybersecurity",
      author: "James Anderson",
      _count: { loanItems: 7 },
    },
    {
      id: "10",
      title: "DevOps",
      author: "Jennifer White",
      _count: { loanItems: 5 },
    },
  ];

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
