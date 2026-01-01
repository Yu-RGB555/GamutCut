'use client';

import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Home,
  Image as ImageIcon,
  PenTool,
  Palette,
  Settings,
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
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const router = useRouter();
  const t = useTranslations('Sidebar');

  // useSidebarフックを活用してSidebarの内部状態にアクセスしサイドバーを制御
  const { setOpenMobile, isMobile } = useSidebar();

  // ナビゲーション時のサイドバー制御（モバイル限定）
  const handleNavigation = (url: string) => {
    if (isMobile) {
      setOpenMobile(false);
    }

    // ページ遷移を明示的に行うことで、Sheet内のsetOpenMobile(false)を呼び出す
    router.push(url);
  }

  // メニュー項目の定義
  const items = [
    {
      title: t('home'),
      url: "/",
      icon: Home,
    },
    {
      title: t('create_mask'),
      url: "/mask",
      icon: Palette,
    },
    {
      title: t('work_list'),
      url: "/work",
      icon: ImageIcon,
    },
    {
      title: t('post_work'),
      url: "/work/new",
      icon: PenTool,
    },
  ]

  const utilityItems = [
    {
      title: t('settings'),
      url: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <button
          onClick={() => handleNavigation("/")}
          className="text-xl font-bold text-foreground text-left hover:cursor-pointer"
        >
          <Image
            src='/app_logo.svg'
            alt="GamutCut"
            width={100}
            height={20}
            sizes="100px"
            className="w-1/2 h-auto"
          />
        </button>
      </SidebarHeader>

      <SidebarContent>
        {/* メインナビゲーション */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-label mt-2">{t('menu')}</SidebarGroupLabel>
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
          <SidebarGroupLabel className="text-label">{t('others')}</SidebarGroupLabel>
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