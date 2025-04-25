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
import { Shield } from "lucide-react";

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Ubah Kata Sandi
        </CardTitle>
        <CardDescription>Perbarui kata sandi akun Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Kata Sandi Saat Ini</Label>
          <Input id="current-password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">Kata Sandi Baru</Label>
          <Input id="new-password" type="password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Konfirmasi Kata Sandi Baru</Label>
          <Input id="confirm-password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Batal</Button>
        <Button>Simpan Perubahan</Button>
      </CardFooter>
    </Card>
  );
}
