"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Youtube, Twitter, Linkedin, Github, Instagram, ArrowRight } from "lucide-react"

export function PremiumFooter() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Testimonials", href: "#" },
        { label: "FAQ", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Guides", href: "#" },
        { label: "API Reference", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
  ]

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl">
              <Youtube className="h-6 w-6 text-primary" />
              <span>Podcast Insights</span>
            </Link>
            <p className="text-muted-foreground">
              Discover business ideas and insights extracted from popular YouTube podcasts.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
                    <Link href={social.href}>
                      {social.icon}
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {footerLinks.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <h3 className="font-medium">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-medium mb-2">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground mb-4">Get the latest insights and updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="max-w-xs" />
              <Button className="gap-1">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground md:text-right">
            <p>© {new Date().getFullYear()} Podcast Business Idea Extractor. All rights reserved.</p>
            <div className="flex gap-4 mt-2 md:justify-end">
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
