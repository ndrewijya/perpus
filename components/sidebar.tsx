import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BookMarked,
  BarChart3,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({ isOpen, onToggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "Buku", href: "/books" },
    { icon: Users, label: "Anggota", href: "/members" },
    { icon: BookMarked, label: "Peminjaman", href: "/loans" },
    { icon: BarChart3, label: "Laporan", href: "/reports" },
  ];

  return (
    <aside
      className={cn(
        "h-full bg-white dark:bg-gray-900 border-r shadow-sm transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Library className="h-6 w-6 text-primary" />
        <span
          className={cn(
            "text-lg font-semibold transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0 md:hidden"
          )}
        >
          Perpustakaan
        </span>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center py-3 px-3 rounded-md transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  !isOpen && "justify-center"
                )}
              >
                <route.icon
                  size={20}
                  className={cn(
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400",
                    isOpen && "mr-3"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-200",
                    !isOpen && "w-0 overflow-hidden opacity-0"
                  )}
                >
                  {route.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div
        className={cn(
          "border-t p-4 flex flex-col gap-2 transition-all duration-300",
          isOpen ? "items-start" : "items-center"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 w-full",
            !isOpen && "justify-center"
          )}
        >
          <Library className="h-4 w-4" />
          {isOpen && (
            <span className="text-sm text-muted-foreground font-medium">
              © 2024 Perpustakaan
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
