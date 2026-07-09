"use client"

import { motion } from "framer-motion"
import { Shield, Globe, UserCheck, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Free SSL Certificates",
    description:
      "Generate industry-standard SSL certificates at zero cost, backed by Let's Encrypt certificate authority.",
  },
  {
    icon: Globe,
    title: "DNS Verification Support",
    description:
      "Verify domain ownership through DNS TXT records with step-by-step guidance and copy-paste simplicity.",
  },
  {
    icon: UserCheck,
    title: "Beginner Friendly Setup",
    description:
      "No command-line expertise needed. Our guided wizard walks you through every step of the process.",
  },
  {
    icon: Zap,
    title: "Fast Certificate Generation",
    description:
      "Get your SSL certificate in under a minute. Automated validation and instant file delivery.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for SSL
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Professional-grade SSL tools designed for simplicity
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group relative h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                <CardContent className="flex flex-col gap-4 pt-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                    <feature.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
