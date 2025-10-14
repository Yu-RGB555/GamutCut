'use client';

import { useRouter } from "next/navigation"
import {
  Home,
  Image,
  PenTool,
  Palette,
  Settings,
  HelpCircle
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// メニュー項目の定義
const items = [
  {
    title: "ホーム",
    url: "/",
    icon: Home,
  },
  {
    title: "作品一覧",
    url: "/work",
    icon: Image,
  },
  {
    title: "作品投稿",
    url: "/work/new",
    icon: PenTool,
  },
  {
    title: "マスク作成",
    url: "/mask",
    icon: Palette,
  },
]

const utilityItems = [
  {
    title: "使い方",
    url: "/help",
    icon: HelpCircle,
  },
  {
    title: "設定",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const router = useRouter()

  // useSidebarフックを活用してSidebarの内部状態にアクセスしサイドバーを制御
  const { setOpenMobile, isMobile } = useSidebar()

  // ナビゲーション時のサイドバー制御（モバイル限定）
  const handleNavigation = (url: string) => {
    if (isMobile) {
      setOpenMobile(false)
    }

    // ページ遷移を明示的に行うことで、Sheet内のsetOpenMobile(false)を呼び出す
    router.push(url)
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <button
          onClick={() => handleNavigation("/")}
          className="text-xl font-bold text-foreground text-left hover:cursor-pointer"
        >
          <img src='/app_logo.svg' className="w-1/2 h-auto" alt="GamutCut" />
        </button>
      </SidebarHeader>

      <SidebarContent>
        {/* メインナビゲーション */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-label">メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ユーティリティ */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-label">その他</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className="flex items-center hover:cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <p className="flex justify-center text-xs text-muted-foreground">© 2025 GamutCut</p>
      </SidebarFooter>
    </Sidebar>
  )
}