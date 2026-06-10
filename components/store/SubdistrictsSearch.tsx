"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Subdistrict {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

interface Props {
  onSelect: (subdistrict: Subdistrict) => void;
}

export function SubdistrictSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Subdistrict[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cacheRef = useRef<Record<string, typeof results>>({});

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        if (cacheRef.current[query]) {
          setResults(cacheRef.current[query]);
          setOpen(true);
          setLoading(false);
          return;
        }
        const res = await fetch(
          `/api/subdistricts?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        cacheRef.current[query] = data;
        setResults(data); 
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query]);

  const handleSelect = (subdistrict: Subdistrict) => {
    setSelected(subdistrict.label);
    setQuery(subdistrict.label);
    setOpen(false);
    onSelect(subdistrict);
  };

  return (
    <div className="space-y-2 relative">
      <Label>Kecamatan/Kelurahan</Label>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected("");
        }}
        placeholder="Ketik nama kelurahan... (min 3 huruf)"
      />
      {loading && (
        <div className="text-xs text-muted-foreground">Mencari...</div>
      )}

      {open && results.length > 0 && !selected && (
        <div className="absolute z-50 w-full bg-background border rounded-lg shadow-md max-h-60 overflow-y-auto">
          {results.map((res) => (
            <button
              key={res.id}
              onClick={() => handleSelect(res)}
              className="w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors border-b last:border-0"
            >
              {res.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
