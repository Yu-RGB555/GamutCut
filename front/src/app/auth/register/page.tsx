import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
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
                <Label htmlFor="name">ハンドルネーム</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="最大20文字まで"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="メールアドレス"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="半角英数字6文字以上"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">パスワード（確認用）</Label>
                </div>
                <Input
                  id="password"
                  name="password_confirmation"
                  type="password"
                  placeholder="半角英数字6文字以上"
                  required
                />
              </div>
            </div>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full py-5 mt-8">
                新規登録
              </Button>
              <div>
                <input type="checkbox" id="legal" className="mr-1" defaultChecked={false}></input>
                <a
                  href="#"
                  className="text-foreground ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  利用規約
                </a>
                <span>、</span>
                <a
                  href="#"
                  className="text-foreground ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  プライバシーポリシー
                </a>
                <span className="card-foreground ml-1">に同意する</span>
              </div>
              <Button className="text-foreground border bg-muted w-full py-5 m-4">
                Googleアカウントで登録
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
