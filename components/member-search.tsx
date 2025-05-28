"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // pastikan import Button dari UI kamu

type Member = {
  id: string;
  name: string;
  email: string;
};

export default function MemberSearch({
  value,
  onSelect,
}: {
  value: Member | null;
  onSelect: (m: Member | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/members/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then(setResults)
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div>
      <input
        className="w-full px-3 py-2 border rounded mb-2"
        placeholder="Cari nama atau email anggota..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={!!value}
      />
      {loading && <div className="text-xs text-gray-400">Mencari...</div>}
      {value ? (
        <div className="mb-2 text-green-600 font-medium">
          Dipilih: {value.name} ({value.email}){" "}
          <button
            type="button"
            className="ml-2 text-xs text-red-500 underline"
            onClick={() => onSelect(null)}
          >
            Ganti
          </button>
        </div>
      ) : (
        <ul className="max-h-40 overflow-y-auto">
          {results.map((member) => (
            <li
              key={member.id}
              className={`
                px-2 py-1 flex justify-between items-center cursor-pointer
                hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors
              `}
              onClick={() => {
                onSelect(member);
                setQuery("");
                setResults([]);
              }}
            >
              <span>
                {member.name}{" "}
                <span className="text-xs text-gray-400">({member.email})</span>
              </span>
              <Button type="button" size="sm" className="ml-2" tabIndex={-1}>
                Pilih
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
