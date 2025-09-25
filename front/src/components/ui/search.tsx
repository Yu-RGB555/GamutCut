import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, FormEvent, useEffect } from "react"

interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
}

export function Search({
  placeholder = "作品タイトル、クリエイターで検索",
  onSearch,
  onChange,
  value,    // valueが提供されているかで制御/非制御を自動判定
  defaultValue = "",
  className = ""
}: SearchProps) {
  const [internalQuery, setInternalQuery] = useState(defaultValue);

  // 制御コンポーネントか非制御コンポーネントかを判定
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalQuery;

  // valueが変更された時に内部状態を同期（制御モード時）
  useEffect(() => {
    if (isControlled) {
      setInternalQuery(value);
    }
  }, [value, isControlled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;

    if (!isControlled) {
      setInternalQuery(newQuery);
    }

    if (onChange) {
      onChange(newQuery);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(currentValue);
    }
  };

  const handleIconClick = () => {
    if (onSearch) {
      onSearch(currentValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-sm ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={currentValue}
          onChange={handleInputChange}
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
