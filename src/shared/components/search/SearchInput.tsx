import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchRightIcon } from "@/components/custom/svg";
import { Search as SearchIcon } from "lucide-react";

export type GetSuggestions = (query: string) => Promise<string[]> | string[];

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string, project?: any) => void;
  onClear?: () => void; // 添加清空回调
  placeholder?: string;
  className?: string;
  searchProjects?: (query: string) => Promise<any[]>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = "Search...",
  className = "",
  searchProjects,
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // 记录已选择的项目ID
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
    // 如果已经选择了项目，不执行搜索
    if (selectedProjectId) {
      return;
    }

    if (searchProjects) {
      setIsSearching(true);
      try {
        const result = await searchProjects(q);
        setProjects(result);
        setSuggestions(result); // 直接使用完整结果，不截取
        setOpen(result.length > 0);
        console.log("result", result);
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

  // 当value发生变化时，自动触发搜索
  useEffect(() => {
    if (value && value.trim() && searchProjects) {
      setSelectedProjectId(null);
      handleSearch(value);
    }
  }, [value]);

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
          onSelect(chosen.name, chosen);
          setOpen(false);
          setActiveIndex(-1);
          // 记录已选择的项目ID
          setSelectedProjectId(chosen.id);
          // 清空suggestions，避免重新显示
          setSuggestions([]);
          setProjects([]);
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
          
          // 用户开始输入时，清除已选择的项目
          setSelectedProjectId(null);
          
          // 清除之前的定时器
          if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
          }
          
          // 如果输入框为空，立即停止搜索并通知父组件清空
          if (!newValue.trim()) {
            setSuggestions([]);
            setProjects([]);
            setOpen(false);
            setActiveIndex(-1);
            setIsSearching(false);
            onClear?.(); // 通知父组件清空数据
            return;
          }
          
          // 设置新的定时器，500ms后执行搜索
          searchTimeoutRef.current = setTimeout(() => {
            handleSearch(newValue);
          }, 500);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => value.trim() && suggestions.length > 0 && setOpen(true)}
        className="border border-[#E9E9E9] bg-transparent h-10 pl-4 pr-10 text-sm placeholder:text-gray-400 shadow-none w-full"
        placeholder={placeholder}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 transform flex items-center gap-2">
        {isSearching ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-[#F67C00] rounded-full animate-spin"></div>
        ) : (
          <SearchRightIcon size={16} color="#2C2C2C" />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto w-full">
          {suggestions.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              className={`px-4 py-3 cursor-pointer text-sm hover:bg-gray-50 transition-colors ${idx === activeIndex ? "bg-gray-100" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => {
                onSelect(project.name, project);
                setOpen(false);
                setActiveIndex(-1);
                // 记录已选择的项目ID
                setSelectedProjectId(project.id);
                // 清空suggestions，避免重新显示
                setSuggestions([]);
                setProjects([]);
              }}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={project.logo} 
                  alt={project.name} 
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    // 图片加载失败时显示默认图标
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-gray-700 font-medium">{project.name}</span>
                  {project.token_symbol && (
                    <span className="text-gray-500 text-xs">{project.token_symbol}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput; 