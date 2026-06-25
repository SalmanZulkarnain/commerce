"use client";

import { useEffect, useRef, useState } from "react";
import { searchBiteshipArea } from "@/actions/address";

export interface BiteshipArea {
  id: string;
  name: string;
  postal_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_2_name: string;
  administrative_division_level_3_name: string;
}

export function useBiteshipAreaSearch(query: string) {
  const [results, setResults] = useState<BiteshipArea[]>([]);
  const [loading, setLoading] = useState(false);

  const cacheRef = useRef<Record<string, BiteshipArea[]>>({});
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    const handler = setTimeout(async () => {
      // 1. return cached
      if (cacheRef.current[query]) {
        setResults(cacheRef.current[query]);
        return;
      }

      setLoading(true);

      // 2. cancel previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await searchBiteshipArea(query);

        if (!controller.signal.aborted) {
          cacheRef.current[query] = data;
          setResults(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 400); // debounce delay

    return () => clearTimeout(handler);
  }, [query]);

  return { results, loading };
}