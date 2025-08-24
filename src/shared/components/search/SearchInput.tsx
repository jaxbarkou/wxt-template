import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchRightIcon } from "@/components/custom/svg";
import { Search as SearchIcon } from "lucide-react";

export type GetSuggestions = (query: string) => Promise<string[]> | string[];

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string, project?: any) => void;
  placeholder?: string;
  className?: string;
  searchProjects?: (query: string) => Promise<any[]>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search...",
  className = "",
  searchProjects,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 处理搜索
  const handleSearch = async (query: string) => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      setProjects([]);
      setOpen(false);
      setActiveIndex(-1);
      setIsSearching(false); // 清空时立即停止加载状态
      return;
    }

    if (searchProjects) {
      setIsSearching(true);
      try {
        const result = await searchProjects(q);
        const projectNames = result.map((project) => project.project_name || project.name || "").filter(Boolean);
        setProjects(result);
        setSuggestions(projectNames.slice(0, 8));
        setOpen(projectNames.length > 0);
        setActiveIndex(-1);
      } catch (error) {
        console.error("搜索失败:", error);
        setSuggestions([]);
        setProjects([]);
        setOpen(false);
      } finally {
        setIsSearching(false);
      }
    }
  };

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

  // 清理定时器
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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
          const project = projects.find(p => (p.project_name || p.name || "") === chosen);
          onSelect(chosen, project);
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
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
          
          // 清除之前的定时器
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }
          
          // 如果输入框为空，立即停止搜索
          if (!newValue.trim()) {
            setSuggestions([]);
            setProjects([]);
            setOpen(false);
            setActiveIndex(-1);
            setIsSearching(false);
            return;
          }
          
          // 设置新的定时器，500ms后执行搜索
          searchTimeoutRef.current = setTimeout(() => {
            handleSearch(newValue);
          }, 500);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        className="border border-[#E9E9E9] bg-transparent h-10 pl-4 pr-10 text-sm placeholder:text-gray-400 shadow-none w-full"
        placeholder={placeholder}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 transform flex items-center gap-2">
        {isSearching ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        ) : (
          <SearchRightIcon size={16} color="#2C2C2C" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto w-full">
          {suggestions.map((s, idx) => (
            <div
              key={`${s}-${idx}`}
              className={`px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 transition-colors ${idx === activeIndex ? "bg-gray-100" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => {
                const project = projects.find(p => (p.project_name || p.name || "") === s);
                onSelect(s, project);
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