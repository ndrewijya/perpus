"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DashboardRefreshButton() {
  const router = useRouter();
  return <Button onClick={() => router.refresh()}>Refresh Dashboard</Button>;
}
