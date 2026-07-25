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
  Fingerprint,
  FileCode,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface SSLData {
  status: "valid" | "expired" | "invalid"
  issuer: string
  expiryDate: string
  daysRemaining: number
  tlsVersion: string
  grade: string
  serialNumber: string
  signatureAlgorithm: string
  subjectAlternativeNames: string[]
  error?: string
}

interface APIResponse {
  success: boolean
  domain: string
  ssl: SSLData
  checkedAt: string
}

export function SSLCheckerSection() {
  const [checkerDomain, setCheckerDomain] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{ domain: string; ssl: SSLData } | null>(null)

  // Clean domain input before submitting
  const sanitizeDomain = (rawInput: string) => {
    return rawInput
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .replace(/\/.*$/, "")
  }

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const cleanDomain = sanitizeDomain(checkerDomain)

    if (!cleanDomain) {
      toast.error("Please enter a domain name")
      return
    }

    setIsChecking(true)
    setResult(null)

    try {
      const response = await fetch("/api/ssl/checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      })

      const data: APIResponse = await response.json()

      if (!response.ok || !data.success) {
        toast.error((data as unknown as { error?: string }).error || "Failed to check SSL status")
        return
      }

      setResult({ domain: data.domain, ssl: data.ssl })
      toast.success("SSL check complete")
    } catch (error) {
      toast.error("Network error. Could not connect to API server.")
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusStyles = (status: SSLData["status"]) => {
    switch (status) {
      case "valid":
        return {
          text: "text-emerald-500",
          border: "border-emerald-500/20",
          bg: "bg-emerald-500/5",
          badge: "bg-emerald-500 text-white hover:bg-emerald-600",
          icon: CheckCircle,
        }
      case "expired":
        return {
          text: "text-destructive",
          border: "border-destructive/20",
          bg: "bg-destructive/5",
          badge: "bg-destructive text-destructive-foreground",
          icon: XCircle,
        }
      default:
        return {
          text: "text-amber-500",
          border: "border-amber-500/20",
          bg: "bg-amber-500/5",
          badge: "bg-amber-500 text-white",
          icon: AlertTriangle,
        }
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
              <form onSubmit={handleCheck} className="flex gap-3">
                <Input
                  placeholder="Enter domain (e.g. example.com)"
                  value={checkerDomain}
                  onChange={(e) => setCheckerDomain(e.target.value)}
                  disabled={isChecking}
                  className="flex-1"
                />
                <Button type="submit" disabled={isChecking} className="gap-2">
                  {isChecking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Search className="size-4" />
                  )}
                  Check
                </Button>
              </form>

              {isChecking && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="size-8 animate-spin text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Checking SSL certificate for{" "}
                    <span className="font-semibold text-foreground">
                      {sanitizeDomain(checkerDomain)}
                    </span>
                    ...
                  </p>
                </div>
              )}

              {result && !isChecking && (() => {
                const styles = getStatusStyles(result.ssl.status)
                const StatusIcon = styles.icon

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                  >
                    <div
                      className={`flex items-center justify-between rounded-lg border ${styles.border} ${styles.bg} p-4`}
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`size-6 ${styles.text}`} />
                        <div>
                          <p className="font-semibold text-foreground">{result.domain}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.ssl.error ? result.ssl.error : "SSL Certificate Status"}
                          </p>
                        </div>
                      </div>
                      <Badge className={styles.badge}>
                        {result.ssl.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { icon: Shield, label: "Security Grade", value: result.ssl.grade },
                        { icon: Calendar, label: "Expiry Date", value: result.ssl.expiryDate },
                        { icon: Award, label: "Issuer", value: result.ssl.issuer },
                        { icon: Clock, label: "Days Remaining", value: `${result.ssl.daysRemaining} days` },
                        { icon: Lock, label: "TLS Version", value: result.ssl.tlsVersion },
                        {
                          icon: Fingerprint,
                          label: "Serial Number",
                          value: result.ssl.serialNumber,
                        },
                        {
                          icon: FileCode,
                          label: "Signature Algorithm",
                          value: result.ssl.signatureAlgorithm,
                        },
                        {
                          icon: CheckCircle,
                          label: "SAN Domains",
                          value: `${result.ssl.subjectAlternativeNames.length} domain(s)`,
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
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })()}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}