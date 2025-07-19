import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="title" placeholder="作品タイトル..." />
      <Button type="submit" variant="outline">
        検索
      </Button>
    </div>
  )
}
