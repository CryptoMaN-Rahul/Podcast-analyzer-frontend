"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart3, Heart, Home, Menu, Youtube, Zap } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: <Heart className="h-4 w-4 mr-2" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold text-xl"
                  onClick={() => setIsOpen(false)}
                >
                  <Youtube className="h-6 w-6 text-primary" />
                  <span>Podcast Insights</span>
                </Link>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      asChild
                      className="justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        {item.name}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Youtube className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block">Podcast Insights</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button key={item.href} variant={pathname === item.href ? "default" : "ghost"} asChild size="sm">
              <Link href={item.href} className="flex items-center">
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Pro</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
