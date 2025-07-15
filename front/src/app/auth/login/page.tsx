import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  return (

    <div className="my-8">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>GamutCut</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="メールアドレス"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード</Label>
                </div>
                <Input id="password" type="password" placeholder="半角英数字6文字以上" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full py-5 mt-4">
            ログイン
          </Button>
          <div>
            <a
              href="#"
              className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
            >
              パスワードをお忘れですか?
            </a>
          </div>
          <div>
            <span>はじめてGamutCutをご利用ですか？</span>
            <a
              href="#"
              className="ml-auto inline-block text-foreground text-sm underline-offset-4 hover:underline"
            >
              アカウントを作成
            </a>
          </div>
          <Button className="text-foreground border bg-muted w-full py-5 m-4">
            Googleアカウントでログイン
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
