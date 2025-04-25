"use client";

import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
      <Link href="/" className="flex items-center gap-2 flex-1">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="font-bold">Perpustakaan</span>
      </Link>
      <ThemeToggle />
    </div>
  );
}
