import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface EditBookPageProps {
  params: { id: string };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
  });

  if (!book) {
    notFound();
  }

  async function updateBook(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const publisher = formData.get("publisher") as string;
    const year = formData.get("year") as string;
    const isbn = formData.get("isbn") as string;
    const stock = Number(formData.get("stock"));

    await prisma.book.update({
      where: { id: params.id },
      data: {
        title,
        author,
        publisher,
        year: year ? Number(year) : null,
        isbn,
        stock,
      },
    });

    redirect("/books");
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Buku</h1>
      <form action={updateBook} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Judul</label>
          <input
            name="title"
            defaultValue={book.title}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Pengarang</label>
          <input
            name="author"
            defaultValue={book.author}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Penerbit</label>
          <input
            name="publisher"
            defaultValue={book.publisher || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tahun</label>
          <input
            name="year"
            type="number"
            defaultValue={book.year || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">ISBN</label>
          <input
            name="isbn"
            defaultValue={book.isbn || ""}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Stok</label>
          <input
            name="stock"
            type="number"
            defaultValue={book.stock}
            min={0}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
