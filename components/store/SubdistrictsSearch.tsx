"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BiteshipArea, useBiteshipAreaSearch } from "@/hooks/useBiteshipAreaSearch";

interface SubdistrictSearchProps {
  onSelect: (area: BiteshipArea) => void;
}

export default function SubdistrictSearch({ onSelect }: SubdistrictSearchProps) {
  const [query, setQuery] = useState("");

  const { results, loading } = useBiteshipAreaSearch(query)
  const [selected, setSelected] = useState<BiteshipArea | null>(null);

  return (
    <div className="space-y-2 relative">
      <Label>Kecamatan/Kelurahan</Label>

      <Input
        value={selected?.administrative_division_level_3_name}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        placeholder="Ketik nama kelurahan... (min 3 huruf)"
      />

      {loading && (
        <div className="text-xs text-muted-foreground">Mencari...</div>
      )}

      {results.length > 0 && !selected && (
        <div className="absolute z-50 w-full bg-background border rounded-lg shadow-md max-h-60 overflow-y-auto">
          {results.map((area) => (
            <button
              key={`${area.id}-${area.administrative_division_level_3_name}`}
              onClick={() => {
                setSelected(area)
                onSelect(area)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors border-b last:border-0"
            >
              {area.administrative_division_level_3_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
