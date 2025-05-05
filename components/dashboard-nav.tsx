"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clock, Users, BarChart, Settings, Home, Map } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface DashboardNavProps {
  className?: string
}

export default function DashboardNav({ className }: DashboardNavProps) {
  const pathname = usePathname() || ""
  const { t } = useLanguage()

  const navItems = [
    {
      title: t("nav.dashboard"),
      href: "/dashboard",
      icon: Home,
    },
    {
      title: t("nav.timesheet"),
      href: "/dashboard/timesheet",
      icon: Clock,
    },
    {
      title: t("nav.map"),
      href: "/dashboard/map",
      icon: Map,
    },
    {
      title: t("nav.reports"),
      href: "/dashboard/reports",
      icon: BarChart,
    },
    {
      title: t("nav.admin"),
      href: "/admin",
      icon: Users,
      admin: true,
    },
    {
      title: t("nav.settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className={cn("flex flex-col gap-2 p-4", className)}>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn("justify-start gap-2", {
            hidden: item.admin && !pathname.includes("/admin"),
          })}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
