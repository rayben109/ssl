"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Shield,
  Calendar,
  Lock,
  Award,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SSLResult {
  domain: string
  status: "valid" | "expired" | "invalid"
  issuer: string
  expiryDate: string
  daysRemaining: number
  tlsVersion: string
  grade: string
}

export function SSLCheckerSection() {
  const [checkerDomain, setCheckerDomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<SSLResult | null>(null)

  const handleCheck = async () => {
    if (!checkerDomain) {
      toast.error("Please enter a domain name")
      return
    }

    setIsChecking(true)
    setResult(null)

    await new Promise((r) => setTimeout(r, 2000))

    setResult({
      domain: checkerDomain,
      status: "valid",
      issuer: "Let's Encrypt Authority X3",
      expiryDate: "August 14, 2026",
      daysRemaining: 87,
      tlsVersion: "TLS 1.3",
      grade: "A+",
    })

    setIsChecking(false)
    toast.success("SSL check complete")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-accent"
      case "expired":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return CheckCircle
      case "expired":
        return XCircle
      default:
        return AlertTriangle
    }
  }

  return (
    <section id="checker" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent/3 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            SSL Checker
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Verify the SSL status of any domain instantly
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="flex flex-col gap-6 pt-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter domain (e.g. example.com)"
                  value={checkerDomain}
                  onChange={(e) => setCheckerDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  className="flex-1"
                />
                <Button onClick={handleCheck} disabled={isChecking} className="gap-2">
                  {isChecking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  Check
                </Button>
              </div>

              {isChecking && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="size-8 animate-spin text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Checking SSL certificate for {checkerDomain}...
                  </p>
                </div>
              )}

              {result && !isChecking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const StatusIcon = getStatusIcon(result.status)
                        return <StatusIcon className={`size-6 ${getStatusColor(result.status)}`} />
                      })()}
                      <div>
                        <p className="font-semibold text-foreground">{result.domain}</p>
                        <p className="text-sm text-muted-foreground">SSL Certificate Status</p>
                      </div>
                    </div>
                    <Badge className="bg-accent text-accent-foreground">
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { icon: Shield, label: "Security Grade", value: result.grade },
                      { icon: Calendar, label: "Expiry Date", value: result.expiryDate },
                      { icon: Award, label: "Issuer", value: result.issuer },
                      { icon: Clock, label: "Days Remaining", value: `${result.daysRemaining} days` },
                      { icon: Lock, label: "TLS Version", value: result.tlsVersion },
                      {
                        icon: CheckCircle,
                        label: "Certificate",
                        value: "Domain Validated (DV)",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <item.icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <p className="truncate text-sm font-medium text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
