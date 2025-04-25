import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Pengaturan Notifikasi
        </CardTitle>
        <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notifikasi Email</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi melalui email
              </p>
            </div>
            <input
              type="checkbox"
              id="email-notifications"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="loan-reminders">Pengingat Peminjaman</Label>
              <p className="text-sm text-muted-foreground">
                Terima pengingat untuk buku yang akan jatuh tempo
              </p>
            </div>
            <input
              type="checkbox"
              id="loan-reminders"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-book-notifications">Buku Baru</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi saat ada buku baru ditambahkan
              </p>
            </div>
            <input
              type="checkbox"
              id="new-book-notifications"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-notifications">Notifikasi Sistem</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi tentang pembaruan sistem
              </p>
            </div>
            <input
              type="checkbox"
              id="system-notifications"
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
