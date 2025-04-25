"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  BookMarked,
  BarChart3,
  Home,
  Settings,
  Library,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/books",
      label: "Buku",
      icon: BookOpen,
    },
    {
      href: "/users",
      label: "Anggota",
      icon: Users,
    },
    {
      href: "/loans",
      label: "Peminjaman",
      icon: BookMarked,
    },
    {
      href: "/reports",
      label: "Laporan",
      icon: BarChart3,
    },
    {
      href: "/settings",
      label: "Pengaturan",
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Perpustakaan</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Library className="h-4 w-4" />
          <span>© 2024 Perpustakaan</span>
        </div>
      </div>
    </aside>
  );
}
