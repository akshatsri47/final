// hooks/useSearch.ts
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  name: string;
}

export function useSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setSearchResults(data.data || []);
        
        // Removed auto-redirect code
      } catch (error) {
        console.error("❌ Error fetching search results:", error);
        setError("Failed to fetch search results");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delay = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductSelect = (productId: string) => {
    if (!productId) return;
    window.location.href = `/product/${productId}`;
  };

  return {
    searchQuery,
    searchResults,
    isLoading,
    error,
    handleSearchChange,
    handleSearchSubmit,
    handleProductSelect
  };
}