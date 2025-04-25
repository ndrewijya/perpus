export function PopularBooks() {
  // Contoh data buku populer
  const popularBooks = [
    { id: 1, title: "Pemrograman Web", loanCount: 27 },
    { id: 2, title: "Database Design", loanCount: 24 },
    { id: 3, title: "Artificial Intelligence", loanCount: 21 },
    { id: 4, title: "Data Structures", loanCount: 18 },
    { id: 5, title: "Machine Learning", loanCount: 15 },
  ];

  return (
    <div className="space-y-4">
      {popularBooks.map((book, index) => (
        <div key={book.id} className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{book.title}</p>
            <p className="text-xs text-muted-foreground">
              Dipinjam {book.loanCount} kali
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
