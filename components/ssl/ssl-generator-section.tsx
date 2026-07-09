"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Globe,
  FileCheck,
  Download,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  Lock,
  FileText,
  Key,
  Award,
  AlertCircle,
  ClipboardCopy,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { copyToClipboard } from "@/lib/copy-to-clipboard"

interface DnsRecord {
  name: string
  value: string
  identifier: string
}

interface OrderData {
  accountKey: string
  accountUrl: string
  orderUrl: string
  records: DnsRecord[]
  mode: "staging" | "production"
}

interface CertDetails {
  commonName: string
  issuer: string
  notBefore: string
  notAfter: string
}

interface GeneratedCerts {
  certificate: string
  privateKey: string
  caBundle: string
  fullChain: string
  details: CertDetails
}

interface VerifyResult {
  name: string
  found: boolean
  values: string[]
  error?: string
}

const steps = [
  { id: 1, title: "Domain Info", icon: Globe },
  { id: 2, title: "DNS Verify", icon: FileCheck },
  { id: 3, title: "Issue", icon: Shield },
  { id: 4, title: "Install", icon: Download },
]

const generationSteps = [
  "Validating domain ownership",
  "Submitting challenge to Let's Encrypt",
  "Finalizing the order",
  "Downloading your certificate",
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                currentStep > step.id
                  ? "border-accent bg-accent text-accent-foreground"
                  : currentStep === step.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {currentStep > step.id ? (
                <Check className="size-4" />
              ) : (
                <step.icon className="size-4" />
              )}
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-px w-8 transition-colors sm:w-12 ${
                currentStep > step.id ? "bg-accent" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function CertTextArea({
  label,
  value,
  onCopy,
  copyKey,
  copiedKey,
}: {
  label: string
  value: string
  onCopy: (text: string, key: string) => void
  copyKey: string
  copiedKey: string | null
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => onCopy(value, copyKey)}
        >
          {copiedKey === copyKey ? (
            <>
              <Check className="size-3 text-accent" />
              Copied
            </>
          ) : (
            <>
              <ClipboardCopy className="size-3" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </div>
      <Textarea
        readOnly
        value={value}
        className="min-h-[180px] resize-y font-mono text-xs leading-relaxed"
        onClick={(e) => (e.target as HTMLTextAreaElement).select()}
      />
    </div>
  )
}

export function SSLGeneratorSection() {
  const [currentStep, setCurrentStep] = useState(1)
  const [domain, setDomain] = useState("")
  const [email, setEmail] = useState("")
  const [wildcard, setWildcard] = useState(false)
  const [staging, setStaging] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [errors, setErrors] = useState<{ domain?: string; email?: string }>({})
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [verifyResults, setVerifyResults] = useState<VerifyResult[] | null>(null)
  const [generatedCerts, setGeneratedCerts] = useState<GeneratedCerts | null>(null)

  const validateStep1 = useCallback(() => {
    const newErrors: { domain?: string; email?: string } = {}
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!domain) {
      newErrors.domain = "Domain name is required"
    } else if (!domainRegex.test(domain)) {
      newErrors.domain = "Please enter a valid domain name (e.g. example.com)"
    }

    if (!email) {
      newErrors.email = "Email address is required"
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [domain, email])

  const handleCreateOrder = async () => {
    if (!validateStep1()) return
    setIsCreatingOrder(true)
    try {
      const res = await fetch("/api/ssl/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          email,
          wildcard,
          mode: staging ? "staging" : "production",
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

      setOrderData({
        accountKey: data.accountKey,
        accountUrl: data.accountUrl,
        orderUrl: data.orderUrl,
        records: data.records,
        mode: data.mode,
      })
      setVerifyResults(null)
      toast.success("Order created — add the DNS records below")
      setCurrentStep(2)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create order")
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleReset = () => {
    setCurrentStep(1)
    setDomain("")
    setEmail("")
    setWildcard(false)
    setStaging(false)
    setErrors({})
    setIsCreatingOrder(false)
    setIsVerifying(false)
    setIsGenerating(false)
    setGenerationStep(0)
    setProgress(0)
    setOrderData(null)
    setVerifyResults(null)
    setGeneratedCerts(null)
  }

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(key)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(null), 2000)
    } else {
      toast.error("Copy failed — please select and copy manually")
    }
  }

  const handleVerify = async () => {
    if (!orderData) return
    setIsVerifying(true)
    try {
      const res = await fetch("/api/ssl/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: orderData.records }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Verification failed")

      setVerifyResults(data.results)
      if (data.verified) {
        toast.success("DNS records found — issuing your certificate")
        handleGenerate()
      } else {
        toast.error("DNS records not found yet. They may still be propagating.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleGenerate = async () => {
    if (!orderData) return
    setCurrentStep(3)
    setIsGenerating(true)
    setGenerationStep(0)
    setProgress(10)

    // Animate through the steps while the ACME request runs
    const timer = setInterval(() => {
      setGenerationStep((s) => (s < generationSteps.length - 1 ? s + 1 : s))
      setProgress((p) => (p < 90 ? p + 20 : p))
    }, 2500)

    try {
      const res = await fetch("/api/ssl/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          wildcard,
          accountKey: orderData.accountKey,
          accountUrl: orderData.accountUrl,
          orderUrl: orderData.orderUrl,
          mode: orderData.mode,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to issue certificate")

      clearInterval(timer)
      setGenerationStep(generationSteps.length - 1)
      setProgress(100)
      setGeneratedCerts({
        certificate: data.certificate,
        privateKey: data.privateKey,
        caBundle: data.caBundle,
        fullChain: data.fullChain,
        details: data.details,
      })
      toast.success("Certificate issued successfully!")
      setTimeout(() => {
        setIsGenerating(false)
        setCurrentStep(4)
      }, 600)
    } catch (err) {
      clearInterval(timer)
      setIsGenerating(false)
      setCurrentStep(2)
      toast.error(
        err instanceof Error ? err.message : "Failed to issue certificate",
      )
    }
  }

  const handleDownload = (filename: string) => {
    if (!generatedCerts) return

    const contentMap: Record<string, string> = {
      "certificate.crt": generatedCerts.certificate,
      "private.key": generatedCerts.privateKey,
      "ca_bundle.crt": generatedCerts.caBundle,
      "fullchain.crt": generatedCerts.fullChain,
    }

    const content = contentMap[filename]
    if (!content) return

    const blob = new Blob([content], { type: "application/x-pem-file" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Downloaded ${filename}`)
  }

  const handleDownloadAll = () => {
    if (!generatedCerts) return
    handleDownload("certificate.crt")
    setTimeout(() => handleDownload("private.key"), 300)
    setTimeout(() => handleDownload("ca_bundle.crt"), 600)
  }

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return iso
    }
  }

  return (
    <section id="generator" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/3 blur-3xl" />
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
            SSL Certificate Generator
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Issue a free, browser-trusted SSL certificate from Let&apos;s Encrypt
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-6">
              <StepIndicator currentStep={currentStep} />
            </CardHeader>
            <CardContent className="pt-8">
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <CardTitle className="text-xl">Domain Information</CardTitle>
                      <CardDescription className="mt-1">
                        Enter the domain you want to secure with a real SSL certificate
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="domain">Domain Name</Label>
                        <Input
                          id="domain"
                          placeholder="example.com"
                          value={domain}
                          onChange={(e) => {
                            setDomain(e.target.value.trim().toLowerCase())
                            if (errors.domain) setErrors((prev) => ({ ...prev, domain: undefined }))
                          }}
                          className={errors.domain ? "border-destructive" : ""}
                        />
                        {errors.domain && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="size-3.5" />
                            {errors.domain}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@example.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                          }}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="size-3.5" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/50 p-4">
                        <div className="flex flex-col gap-0.5">
                          <Label htmlFor="wildcard" className="font-medium">
                            Wildcard SSL
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            Secure all subdomains (*.{domain || "example.com"})
                          </span>
                        </div>
                        <Switch id="wildcard" checked={wildcard} onCheckedChange={setWildcard} />
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/50 p-4">
                        <div className="flex flex-col gap-0.5">
                          <Label htmlFor="staging" className="font-medium">
                            Staging / Test mode
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            Use Let&apos;s Encrypt staging to test without hitting rate limits (not trusted by browsers)
                          </span>
                        </div>
                        <Switch id="staging" checked={staging} onCheckedChange={setStaging} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={handleCreateOrder} disabled={isCreatingOrder} className="gap-2">
                        {isCreatingOrder ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Creating order...
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={handleReset} className="gap-2">
                        <RotateCcw className="size-4" />
                        Reset
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && orderData && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <CardTitle className="text-xl">DNS TXT Verification</CardTitle>
                      <CardDescription className="mt-1">
                        Add {orderData.records.length > 1 ? "these DNS TXT records" : "this DNS TXT record"} at your
                        domain registrar to prove ownership
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-4">
                      {orderData.records.map((rec, i) => {
                        const result = verifyResults?.find((r) => r.name === rec.name && r.values.includes(rec.value))
                          ?? verifyResults?.[i]
                        return (
                          <div
                            key={`${rec.name}-${i}`}
                            className="rounded-lg border border-border/50 bg-secondary/30 p-4"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                  Record {orderData.records.length > 1 ? i + 1 : ""} · Type TXT
                                </span>
                                {verifyResults && (
                                  <Badge
                                    variant="outline"
                                    className={`gap-1 text-xs ${
                                      result?.found
                                        ? "border-accent/40 text-accent"
                                        : "border-destructive/40 text-destructive"
                                    }`}
                                  >
                                    {result?.found ? (
                                      <>
                                        <Check className="size-3" /> Found
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="size-3" /> Not found
                                      </>
                                    )}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                  Host / Name
                                </span>
                                <div className="flex items-center gap-2">
                                  <code className="flex-1 truncate rounded-md bg-card px-3 py-2 font-mono text-sm text-foreground">
                                    {rec.name}
                                  </code>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleCopy(rec.name, `host-${i}`)}
                                  >
                                    {copied === `host-${i}` ? (
                                      <Check className="size-4 text-accent" />
                                    ) : (
                                      <Copy className="size-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                  TXT Value
                                </span>
                                <div className="flex items-center gap-2">
                                  <code className="flex-1 truncate rounded-md bg-card px-3 py-2 font-mono text-sm text-foreground">
                                    {rec.value}
                                  </code>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleCopy(rec.value, `value-${i}`)}
                                  >
                                    {copied === `value-${i}` ? (
                                      <Check className="size-4 text-accent" />
                                    ) : (
                                      <Copy className="size-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Instructions:</strong> Log into your DNS provider, add the
                          TXT record(s) above, then click Verify. DNS propagation can take a few minutes. Keep the
                          record in place until the certificate is issued.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={handleVerify} disabled={isVerifying} className="gap-2">
                        {isVerifying ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Check className="size-4" />
                            Verify &amp; Issue
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="gap-2"
                      >
                        <ArrowLeft className="size-4" />
                        Back
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && isGenerating && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-8 py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="flex size-20 items-center justify-center rounded-full border-2 border-accent/20 bg-accent/10"
                    >
                      <Lock className="size-8 text-accent" />
                    </motion.div>
                    <div className="w-full max-w-md text-center">
                      <h3 className="text-lg font-semibold text-foreground">
                        Issuing SSL Certificate
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Let&apos;s Encrypt is validating your domain and signing the certificate
                      </p>
                    </div>
                    <div className="w-full max-w-md">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex w-full max-w-md flex-col gap-3">
                      {generationSteps.map((step, index) => (
                        <div
                          key={step}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                            index < generationStep
                              ? "border-accent/30 bg-accent/5"
                              : index === generationStep
                              ? "border-accent/50 bg-accent/10"
                              : "border-border/50 bg-card/50"
                          }`}
                        >
                          {index < generationStep ? (
                            <Check className="size-4 text-accent" />
                          ) : index === generationStep ? (
                            <Loader2 className="size-4 animate-spin text-accent" />
                          ) : (
                            <div className="size-4 rounded-full border border-border" />
                          )}
                          <span
                            className={`text-sm ${
                              index <= generationStep
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && generatedCerts && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-accent/10"
                      >
                        <Shield className="size-8 text-accent" />
                      </motion.div>
                      <CardTitle className="text-xl">SSL Certificate Issued</CardTitle>
                      <CardDescription className="mt-1">
                        Your certificate for{" "}
                        <span className="font-mono font-medium text-foreground">
                          {generatedCerts.details.commonName}
                        </span>{" "}
                        is ready to install
                      </CardDescription>
                      {orderData?.mode === "staging" && (
                        <Badge variant="outline" className="mt-3 border-destructive/40 text-destructive">
                          Staging certificate — not trusted by browsers
                        </Badge>
                      )}
                    </div>

                    {/* Tabs: Copy & Paste / Download Files */}
                    <Tabs defaultValue="copy" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="copy" className="gap-2">
                          <ClipboardCopy className="size-3.5" />
                          Copy &amp; Paste
                        </TabsTrigger>
                        <TabsTrigger value="download" className="gap-2">
                          <Download className="size-3.5" />
                          Download Files
                        </TabsTrigger>
                      </TabsList>

                      {/* COPY & PASTE TAB */}
                      <TabsContent value="copy" className="mt-4 flex flex-col gap-5">
                        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">How to use:</strong> Copy each field below and paste it
                            into the matching box in your hosting panel&apos;s SSL installer (cPanel, Hostinger, Plesk,
                            etc.).
                          </p>
                        </div>

                        <CertTextArea
                          label="Certificate (CRT) — paste into 'Certificate' field"
                          value={generatedCerts.certificate}
                          onCopy={handleCopy}
                          copyKey="cert"
                          copiedKey={copied}
                        />

                        <CertTextArea
                          label="Private Key (KEY) — paste into 'Private Key' field"
                          value={generatedCerts.privateKey}
                          onCopy={handleCopy}
                          copyKey="key"
                          copiedKey={copied}
                        />

                        <CertTextArea
                          label="CA Bundle — paste into 'CA Bundle / Intermediate' field"
                          value={generatedCerts.caBundle}
                          onCopy={handleCopy}
                          copyKey="ca"
                          copiedKey={copied}
                        />

                        <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                          <h4 className="mb-2 text-sm font-semibold text-foreground">
                            Quick Guide for Popular Hosts
                          </h4>
                          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                            <li>
                              <strong className="text-foreground">cPanel:</strong> SSL/TLS
                              {" > "}Manage SSL Sites {" > "} paste Certificate, Private Key, and CA Bundle.
                            </li>
                            <li>
                              <strong className="text-foreground">Hostinger:</strong> Security {" > "} SSL {" > "} Custom
                              SSL {" > "} paste the three fields.
                            </li>
                            <li>
                              <strong className="text-foreground">Plesk:</strong> Websites {" > "} SSL/TLS Certificates
                              {" > "} Add Certificate and paste.
                            </li>
                            <li>
                              <strong className="text-foreground">Cloudflare:</strong> SSL/TLS {" > "} Edge Certificates
                              {" > "} Upload Custom SSL Certificate.
                            </li>
                          </ul>
                        </div>
                      </TabsContent>

                      {/* DOWNLOAD FILES TAB */}
                      <TabsContent value="download" className="mt-4 flex flex-col gap-4">
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { icon: FileText, file: "certificate.crt", desc: "SSL Certificate" },
                            { icon: Key, file: "private.key", desc: "Private Key" },
                            { icon: Award, file: "ca_bundle.crt", desc: "CA Bundle" },
                          ].map((item) => (
                            <button
                              key={item.file}
                              onClick={() => handleDownload(item.file)}
                              className="group flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-5 transition-all hover:border-accent/30 hover:bg-accent/5"
                            >
                              <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                                <item.icon className="size-5" />
                              </div>
                              <div className="text-center">
                                <p className="font-mono text-sm font-medium text-foreground">
                                  {item.file}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {item.desc}
                                </p>
                              </div>
                              <Badge variant="outline" className="gap-1 text-xs">
                                <Download className="size-3" />
                                Download
                              </Badge>
                            </button>
                          ))}
                        </div>

                        <Button
                          onClick={handleDownloadAll}
                          className="w-full gap-2"
                          variant="outline"
                        >
                          <Download className="size-4" />
                          Download All Files
                        </Button>
                      </TabsContent>
                    </Tabs>

                    {/* Certificate Details */}
                    <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                      <h4 className="mb-3 text-sm font-semibold text-foreground">
                        Certificate Details
                      </h4>
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Common Name</span>
                          <span className="font-mono font-medium text-foreground">
                            {generatedCerts.details.commonName}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Issuer</span>
                          <span className="font-medium text-foreground">
                            {generatedCerts.details.issuer}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Valid From</span>
                          <span className="font-medium text-foreground">
                            {formatDate(generatedCerts.details.notBefore)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Expires</span>
                          <span className="font-medium text-foreground">
                            {formatDate(generatedCerts.details.notAfter)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Signature</span>
                          <span className="font-medium text-foreground">SHA-256 / RSA</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium text-foreground">
                            {wildcard ? "Wildcard (DV)" : "Single Domain (DV)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Button variant="outline" onClick={handleReset} className="gap-2">
                        <RotateCcw className="size-4" />
                        Generate Another
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
