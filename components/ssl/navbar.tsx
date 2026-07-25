"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Shield, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/ssl-generator" className="flex items-center gap-3">
          <Image
            src="/images/codeeit-logo.png"
            alt="Codeeit Technologies Logo"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-lg font-semibold text-foreground">
            Codeeit <span className="text-accent">SSL</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/ssl-generator#features" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/ssl-generator#generator" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Generator
          </Link>
          <Link href="/ssl-generator#checker" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            SSL Checker
          </Link>
          <Link href="/ssl-generator#guides" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Guides
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="hidden dark:block" />
            <Moon className="block dark:hidden" />
          </Button>
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/ssl-generator#generator">
              <Shield className="mr-1.5 size-4" />
              Generate SSL
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            <Link href="/ssl-generator#features" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="/ssl-generator#generator" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Generator
            </Link>
            <Link href="/ssl-generator#checker" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              SSL Checker
            </Link>
            <Link href="/ssl-generator#guides" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Guides
            </Link>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/ssl-generator#generator" onClick={() => setMobileOpen(false)}>
                <Shield className="mr-1.5 size-4" />
                Generate SSL
              </Link>
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
