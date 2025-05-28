import { prisma } from "@/lib/prisma";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AddMemberPage() {
  async function addMember(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;

    await prisma.member.create({
      data: { name, email, phone, address },
    });

    redirect("/members");
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Tambah Anggota
        </h1>
        <p className="text-muted-foreground">
          Isi data anggota perpustakaan dengan lengkap
        </p>
      </div>
      <form action={addMember} className="space-y-4">
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input name="name" id="name" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Telepon</Label>
          <Input name="phone" id="phone" />
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Input name="address" id="address" />
        </div>
        <div className="flex gap-2 justify-end">
          <Link href="/members">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
}
