import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/components/query-provider"
import { SearchProvider } from "@/contexts/search-context"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Podcast Insights - Business Ideas from Top Podcasts",
  description: "Discover business ideas and insights extracted from popular YouTube podcasts.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <SearchProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </Suspense>
            </SearchProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
