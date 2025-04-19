"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { BarChart3, Heart, Home, Menu, SearchIcon, Youtube, Zap, X, Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EnhancedSearchBar } from "@/components/enhanced-search-bar"
import { useSearch } from "@/contexts/search-context"

export default function PremiumHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { searchQuery } = useSearch()

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-heading text-xl"
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

                <div className="mt-auto space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <User className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button>
                  <Button className="w-full justify-start gap-2">
                    <Zap className="h-4 w-4 text-yellow-300" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Youtube className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.span
              className="hidden sm:inline-block font-heading text-xl"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Podcast Insights
            </motion.span>
          </Link>
        </div>

        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              className="absolute left-0 right-0 mx-auto w-full max-w-md px-4 md:px-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <EnhancedSearchBar autoFocus={true} />
            </motion.div>
          ) : (
            <motion.nav
              className="hidden md:flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    asChild
                    size="sm"
                    className={pathname === item.href ? "animate-pulse-opacity" : ""}
                  >
                    <Link href={item.href} className="flex items-center">
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:flex hidden"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">3</Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start p-4 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="px-1 py-0 h-5 text-xs font-normal">
                        New
                      </Badge>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="font-medium">New business idea from Tim Ferriss</p>
                    <p className="text-sm text-muted-foreground">
                      Check out the latest insight about passive income strategies.
                    </p>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Pro</span>
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
