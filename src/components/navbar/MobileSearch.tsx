"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface MobileSearchProps {
  isMenuOpen: boolean;
}

interface SearchResult {
  id: string;
  name: string;
}

export default function MobileSearch({ isMenuOpen }: MobileSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false); // ✅ Loading state

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
    console.log(`✅ Redirecting to: /product/${productId}`);
    router.push(`/product/${productId}`);
  };

  // Fetch search results using the updated API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setSearchResults(data.data || []);
        console.log("🔍 Mobile API Response:", data);
      } catch (error) {
        console.error("❌ Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const delay = setTimeout(fetchSearchResults, 300); // ✅ Debounce API calls
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <div className={`md:hidden px-4 pb-2 ${isMenuOpen ? "block" : "hidden"}`}>
      <form onSubmit={handleSearchSubmit} className="relative w-full mt-2">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
          aria-label="Search products"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        <button type="submit" className="hidden">Search</button>
        
        {/* Mobile Search Suggestions Dropdown */}
        {searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md mt-2 z-50">
            {isSearching ? (
              <div className="p-4 text-gray-500 text-center">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((product) => (
                <button 
                  key={product.id} 
                  onClick={() => handleProductSelect(product.id)} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium">{product.name}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-center">No results found</div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
