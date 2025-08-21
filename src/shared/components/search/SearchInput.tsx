import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchRightIcon } from "@/components/custom/svg";
import { Search as SearchIcon } from "lucide-react";

export type GetSuggestions = (query: string) => Promise<string[]> | string[];

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  getSuggestions?: GetSuggestions;
}

const defaultDataset = [
  "Pell Network",
  "Pell Token",
  "Pell Protocol",
  "Pell DeFi",
  "Pell Staking",
  "Pell Network Review",
  "Pell Network Price",
  "Pell Network Tokenomics",
  "Pell Network Analysis",
  "Pell Network News",
  "Bitcoin Restaking",
  "BTCFi Projects",
  "DeFi Protocols",
  "Cryptocurrency Research",
  "Blockchain Security",
];

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search...",
  className = "",
  getSuggestions,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolveSuggestions = useMemo<GetSuggestions>(
    () =>
      getSuggestions ||
      ((query: string) =>
        defaultDataset.filter((s) =>
          s.toLowerCase().includes(query.toLowerCase())
        )),
    [getSuggestions]
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const q = value.trim();
      if (!q) {
        setSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
        return;
      }
      const result = await Promise.resolve(resolveSuggestions(q));
      if (!cancelled) {
        const next = result.slice(0, 8);
        setSuggestions(next);
        setOpen(next.length > 0);
        setActiveIndex(-1);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [value, resolveSuggestions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => (p < suggestions.length - 1 ? p + 1 : p));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => (p > 0 ? p - 1 : -1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        const chosen = suggestions[activeIndex];
        onSelect(chosen);
        setOpen(false);
        setActiveIndex(-1);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        className="border border-[#E9E9E9] bg-transparent h-10 pl-4 pr-10 text-sm placeholder:text-gray-400 shadow-none w-full"
        placeholder={placeholder}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 transform flex items-center gap-2">
        <SearchRightIcon size={16} color="#2C2C2C" />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto w-full">
          {suggestions.map((s, idx) => (
            <div
              key={`${s}-${idx}`}
              className={`px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 transition-colors ${idx === activeIndex ? "bg-gray-100" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => {
                onSelect(s);
                setOpen(false);
                setActiveIndex(-1);
              }}
            >
              <div className="flex items-center gap-3">
                <SearchIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{s}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput; 