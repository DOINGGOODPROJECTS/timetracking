"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import DashboardNav from "@/components/dashboard-nav"
import { logout } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/language-provider"

interface DashboardHeaderProps {
  user: {
    name: string
    email: string
    isAdmin?: boolean
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  // Make sure user exists and has required properties
  if (!user || !user.name || !user.email) {
    return (
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Image src="/logo.png" alt={t("general.appName")} width={32} height={32} />
              <span>{t("general.appName")}</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">{t("nav.login")}</Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t("nav.toggleMenu")}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <DashboardNav className="border-none" />
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Image src="/logo.png" alt={t("general.appName")} width={32} height={32} />
            <span>{t("general.appName")}</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("nav.myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/profile" className="w-full">
                  {t("nav.profile")}
                </Link>
              </DropdownMenuItem>
              {user.isAdmin && (
                <DropdownMenuItem>
                  <Link href="/admin/employees" className="w-full">
                    {t("nav.admin")}
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>{t("nav.logout")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
