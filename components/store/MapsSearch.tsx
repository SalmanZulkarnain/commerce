"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface BiteshipResults {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  postal_code: number;
}
export default function MapsSearch() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<BiteshipResults[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (!input.trim()) {
      setResults([]);
      return;
    }

    const getMaps = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/biteship/maps?input=${encodeURIComponent(input)}`,
        );

        if (!response.ok) throw new Error("Network error");

        const result = await response.json();
        console.log(result.data.areas);
        setResults(result.data.areas);
      } catch (err) {
        console.error(`Gagal mengambil data map: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      getMaps();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [input, isOpen]);

  const handleSelectArea = (item: BiteshipResults) => {
    setInput(item.name);
    setSelected(item.name);
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div>
      <Input
        type="text"
        value={input}
        placeholder="Pancoran"
        onChange={(e) => {
          setInput(e.target.value);
          setIsOpen(true);
        }}
      />
      {loading && <p>Loading...</p>}

      {isOpen && results.length > 0 && (
        <ul className="mt-1 border rounded-md divide-y max-h-60 overflow-y-auto shadow-lg">
          {results.map((item: BiteshipResults) => (
            <li key={item.id}>
              <button
                className="w-full text-left px-4 py-2 hover:bg-muted text-sm transition-colors border-b last:border-0"
                onClick={() => handleSelectArea(item)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
