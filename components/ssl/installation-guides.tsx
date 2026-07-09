"use client"

import { motion } from "framer-motion"
import { ExternalLink, Server, Globe, Cloud, Shield, Layout } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const guides = [
  {
    icon: Layout,
    name: "cPanel",
    description: "Install SSL via cPanel's SSL/TLS Manager. Upload your certificate files in the SSL management section.",
    color: "text-accent",
  },
  {
    icon: Globe,
    name: "Hostinger",
    description: "Navigate to SSL section in Hostinger's hPanel. Paste certificate and key in custom SSL fields.",
    color: "text-accent",
  },
  {
    icon: Server,
    name: "Apache",
    description: "Configure SSLCertificateFile and SSLCertificateKeyFile directives in your Apache virtual host.",
    color: "text-accent",
  },
  {
    icon: Shield,
    name: "Nginx",
    description: "Set ssl_certificate and ssl_certificate_key paths in your Nginx server block configuration.",
    color: "text-accent",
  },
  {
    icon: Cloud,
    name: "Cloudflare",
    description: "Upload custom certificate in Cloudflare's Edge Certificates section under SSL/TLS settings.",
    color: "text-accent",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function InstallationGuides() {
  return (
    <section id="guides" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Installation Guides
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Step-by-step instructions for popular hosting platforms
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {guides.map((guide) => (
            <motion.div key={guide.name} variants={item}>
              <Card className="group h-full border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                      <guide.icon className="size-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{guide.name}</h3>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {guide.description}
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 self-start">
                    <ExternalLink className="size-3.5" />
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
