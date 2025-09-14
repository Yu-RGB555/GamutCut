import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, FormEvent } from "react"

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export function Search({
  placeholder = "作品タイトル、クリエイターで検索",
  onSearch,
  defaultValue = "",
  className = ""
}: SearchProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleIconClick = () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-sm ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4"
        />
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer transition-colors"
        >
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </form>
  )
}
