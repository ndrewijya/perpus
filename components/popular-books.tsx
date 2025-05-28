type PopularBook = {
  id?: string;
  title?: string;
  author?: string;
  loanCount: number;
};

export function PopularBooks({ books }: { books: PopularBook[] }) {
  if (!books || books.length === 0) {
    return <div>Belum ada data buku populer.</div>;
  }
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>
          <b>{book.title}</b> - {book.author} ({book.loanCount}x dipinjam)
        </li>
      ))}
    </ul>
  );
}
