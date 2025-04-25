import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Bell } from "lucide-react";
import { ProfileSettings } from "@/components/profile-settings";
import { SecuritySettings } from "@/components/security-settings";
import { NotificationSettings } from "@/components/notification-settings";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Pengaturan
        </h1>
        <p className="text-muted-foreground">
          Kelola pengaturan aplikasi perpustakaan
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
