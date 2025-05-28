import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function EditMemberPage({
  params,
}: {
  params: { id: string };
}) {
  // Ambil data anggota berdasarkan id
  const member = await prisma.member.findUnique({ where: { id: params.id } });

  if (!member) return <div>Anggota tidak ditemukan</div>;

  // Fungsi update anggota dengan validasi sederhana
  async function updateMember(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;

    // Validasi sederhana (opsional, bisa diperluas)
    if (!name || !email) return;

    await prisma.member.update({
      where: { id: params.id },
      data: { name, email, phone, address },
    });

    redirect("/members");
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Anggota</h1>
      <form action={updateMember} className="space-y-4">
        <div>
          <Label htmlFor="name">Nama</Label>
          <Input name="name" id="name" defaultValue={member.name} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" id="email" defaultValue={member.email} required />
        </div>
        <div>
          <Label htmlFor="phone">Telepon</Label>
          <Input name="phone" id="phone" defaultValue={member.phone ?? ""} />
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Input
            name="address"
            id="address"
            defaultValue={member.address ?? ""}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Link href="/members">
            <Button type="button" variant="outline">
              Batal
            </Button>
          </Link>
          <Button type="submit">Simpan Perubahan</Button>
        </div>
      </form>
    </div>
  );
}
