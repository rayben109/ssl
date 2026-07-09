"use client"

import { motion } from "framer-motion"
import { MessageCircle, Mail, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center rounded-2xl border border-border/50 bg-card/80 p-8 text-center backdrop-blur-sm sm:p-12"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10">
            <Headphones className="size-7 text-accent" />
          </div>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Need Help Installing SSL?
          </h2>
          <p className="mt-4 max-w-lg text-pretty text-muted-foreground">
            Our team at Codeeit Technologies is ready to help you secure your website.
            Get in touch for free installation support.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2 px-8" asChild>
              <a href="https://wa.me/255672232334" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                WhatsApp Us
              </a>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 px-8" asChild>
              <a href="mailto:support@codeeit.co.tz">
                <Mail className="size-4" />
                Contact Us
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
