import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Informasi Profil
        </CardTitle>
        <CardDescription>Perbarui informasi profil Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <h3 className="font-medium">Foto Profil</h3>
            <p className="text-sm text-muted-foreground">
              JPG, GIF atau PNG. Ukuran maksimal 1MB.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button size="sm" variant="outline">
                Unggah Foto
              </Button>
              <Button size="sm" variant="outline">
                Hapus
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" defaultValue="Admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="admin@perpustakaan.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" defaultValue="081234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Peran</Label>
              <Input id="role" defaultValue="Administrator" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              defaultValue="Jl. Contoh No. 123, Kota Contoh"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Batal</Button>
        <Button>Simpan Perubahan</Button>
      </CardFooter>
    </Card>
  );
}
