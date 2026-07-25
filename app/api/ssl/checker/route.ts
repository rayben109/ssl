import { NextResponse } from "next/server"
import tls from "node:tls"
import net from "node:net"

interface SSLResult {
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

function checkSSLCertificate(domain: string, port = 443, timeout = 10000): Promise<SSLResult> {
  return new Promise((resolve) => {
    // 1. Establish TCP connection
    const socket = net.connect(port, domain, () => {
      // 2. Upgrade connection to TLS with SNI support
      const tlsSocket = tls.connect(
        {
          socket,
          servername: domain, // Crucial for multi-tenant / CDN hosted sites
          rejectUnauthorized: false, // Prevents thrown error on expired/untrusted certs to capture details
        },
        () => {
          const cert = tlsSocket.getPeerCertificate(true)
          const protocol = tlsSocket.getProtocol() || "TLS 1.3"

          if (!cert || Object.keys(cert).length === 0) {
            tlsSocket.destroy()
            return resolve({
              status: "invalid",
              issuer: "Unknown",
              expiryDate: "N/A",
              daysRemaining: 0,
              tlsVersion: protocol,
              grade: "F",
              serialNumber: "N/A",
              signatureAlgorithm: "N/A",
              subjectAlternativeNames: [],
              error: "No SSL certificate found on host",
            })
          }

          const now = new Date()
          const validTo = new Date(cert.valid_to)
          const diffTime = validTo.getTime() - now.getTime()
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          // Determine status & dynamic security grade
          let status: "valid" | "expired" | "invalid" = "valid"
          let grade = "A+"

          if (daysRemaining <= 0) {
            status = "expired"
            grade = "F"
          } else if (!tlsSocket.authorized) {
            status = "invalid"
            grade = "F"
          } else if (daysRemaining < 15) {
            grade = "B"
          } else if (daysRemaining < 30) {
            grade = "A"
          }

          // Extract Issuer safely ensuring no string[] leaks into string type
          let issuerName = "Unknown Issuer"
          if (cert.issuer) {
            if (typeof cert.issuer === "object" && !Array.isArray(cert.issuer)) {
              const rawVal = cert.issuer.O || cert.issuer.CN
              if (Array.isArray(rawVal)) {
                issuerName = rawVal.join(", ")
              } else if (typeof rawVal === "string") {
                issuerName = rawVal
              }
            } else if (Array.isArray(cert.issuer)) {
              issuerName = cert.issuer.join(", ")
            } else if (typeof cert.issuer === "string") {
              issuerName = cert.issuer
            }
          }

          // Parse Subject Alternative Names (SANs) from altnames string
          const sans = cert.subjectaltname
            ? cert.subjectaltname
                .split(",")
                .map((san) => san.trim().replace(/^DNS:/, ""))
                .filter(Boolean)
            : [domain]

          // Extract Signature Algorithm
          const sigAlg =
            (cert as { sigalg?: string }).sigalg ||
            cert.asn1Curve ||
            "SHA256withRSA"

          const result: SSLResult = {
            status,
            issuer: issuerName,
            expiryDate: validTo.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            daysRemaining: Math.max(0, daysRemaining),
            tlsVersion: protocol,
            grade,
            serialNumber: cert.serialNumber || "N/A",
            signatureAlgorithm: sigAlg,
            subjectAlternativeNames: sans,
            error: tlsSocket.authorizationError
              ? String(tlsSocket.authorizationError)
              : undefined,
          }

          tlsSocket.destroy()
          resolve(result)
        }
      )

      tlsSocket.on("error", (err) => {
        tlsSocket.destroy()
        resolve({
          status: "invalid",
          issuer: "N/A",
          expiryDate: "N/A",
          daysRemaining: 0,
          tlsVersion: "N/A",
          grade: "F",
          serialNumber: "N/A",
          signatureAlgorithm: "N/A",
          subjectAlternativeNames: [],
          error: err.message,
        })
      })
    })

    socket.setTimeout(timeout, () => {
      socket.destroy()
      resolve({
        status: "invalid",
        issuer: "N/A",
        expiryDate: "N/A",
        daysRemaining: 0,
        tlsVersion: "N/A",
        grade: "F",
        serialNumber: "N/A",
        signatureAlgorithm: "N/A",
        subjectAlternativeNames: [],
        error: "Connection timed out",
      })
    })

    socket.on("error", (err) => {
      socket.destroy()
      resolve({
        status: "invalid",
        issuer: "N/A",
        expiryDate: "N/A",
        daysRemaining: 0,
        tlsVersion: "N/A",
        grade: "F",
        serialNumber: "N/A",
        signatureAlgorithm: "N/A",
        subjectAlternativeNames: [],
        error: err.message,
      })
    })
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { domain: rawDomain } = body

    if (!rawDomain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    // Sanitize domain input (strips http://, https://, www., paths, and spaces)
    const cleanDomain = rawDomain
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .replace(/\/.*$/, "")

    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(cleanDomain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 })
    }

    const sslData = await checkSSLCertificate(cleanDomain)

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      ssl: sslData,
      checkedAt: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}