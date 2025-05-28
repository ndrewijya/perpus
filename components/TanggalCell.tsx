"use client";
import { useEffect, useState } from "react";

export default function TanggalCell({ date }: { date: string | null }) {
  const [formatted, setFormatted] = useState<string>("-");
  useEffect(() => {
    if (date) setFormatted(new Date(date).toLocaleDateString("id-ID"));
    else setFormatted("-");
  }, [date]);
  return <span>{formatted}</span>;
}
