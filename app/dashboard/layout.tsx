"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi mode mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handler toggle sidebar desktop
  const handleToggleSidebar = () => setSidebarOpen((open) => !open);

  // Handler toggle sidebar mobile
  const handleToggleMobileSidebar = () => setMobileOpen((open) => !open);

  return (
    <html lang="id">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen">
            <Sidebar
              isOpen={isSidebarOpen}
              onToggleSidebar={handleToggleSidebar}
            />
            <div className="flex-1 flex flex-col">
              <Header
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={handleToggleSidebar}
              />
              <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
