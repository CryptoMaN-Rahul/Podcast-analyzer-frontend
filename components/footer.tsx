"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Youtube, Twitter, Linkedin, Github, Instagram, ArrowRight } from "lucide-react"

export function Footer() {
  const footerLinks = [
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Guides", href: "#" },
        { label: "API Reference", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
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
    <footer className="bg-muted/30 border-t py-6 md:py-8">
      <div className="container px-4 md:px-6 flex flex-col items-center justify-between gap-4 md:flex-row">
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

          <div className="space-y-4">
            <h3 className="font-medium">Subscribe to our newsletter</h3>
            <p className="text-muted-foreground">Get the latest insights and updates delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="max-w-xs" />
              <Button className="gap-1">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Podcast Insights. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
