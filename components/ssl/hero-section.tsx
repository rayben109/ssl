"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Lock, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 gap-2 border-accent/30 bg-accent/10 px-4 py-1.5 text-accent">
              <Lock className="size-3.5" />
              Powered by Let&apos;s Encrypt
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Generate Free SSL Certificates{" "}
            <span className="text-accent">for Your Website</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
          >
            Secure your website with free SSL certificates powered by Let&apos;s Encrypt
            technology. Fast, simple, and beginner-friendly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="#generator">
                <Shield className="size-4" />
                Generate SSL
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8" asChild>
              <Link href="#checker">
                <CheckCircle className="size-4" />
                Check Existing SSL
              </Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6"
          >
            {[
              { icon: Shield, label: "256-bit Encryption" },
              { icon: Lock, label: "Domain Validated" },
              { icon: CheckCircle, label: "Auto-Renewable" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
              >
                <item.icon className="size-4 text-accent" />
                {item.label}
              </div>
            ))}
          </motion.div>

          {/* Animated Shield Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative mt-20"
          >
            <div className="relative mx-auto flex size-32 items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border-2 border-dashed border-accent/30"
              />
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-accent/10 backdrop-blur-sm">
                <Shield className="size-8 text-accent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
