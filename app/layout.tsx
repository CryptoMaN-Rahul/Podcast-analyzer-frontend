import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { SearchProvider } from "@/contexts/search-context"
import { Toaster } from "sonner"
import PremiumHeader from "@/components/premium-header"
import { PremiumFooter } from "@/components/premium-footer"
import { Suspense } from "react"

// Font configuration
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Podcast Business Idea Extractor",
  description: "Discover business ideas from popular YouTube podcasts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <Suspense>
              <SearchProvider>
                <div className="flex min-h-screen flex-col">
                  <PremiumHeader />
                  <main className="flex-1">{children}</main>
                  <PremiumFooter />
                </div>
                <Toaster position="bottom-right" />
              </SearchProvider>
            </Suspense>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
