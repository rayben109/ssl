import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { domain } = body

  if (!domain) {
    return NextResponse.json(
      { error: "Domain is required" },
      { status: 400 }
    )
  }

  // Mock SSL checker response
  const daysRemaining = Math.floor(Math.random() * 300) + 30

  return NextResponse.json({
    success: true,
    domain,
    ssl: {
      status: daysRemaining > 0 ? "valid" : "expired",
      issuer: "Let's Encrypt Authority X3",
      expiryDate: new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toISOString(),
      daysRemaining,
      tlsVersion: "TLS 1.3",
      grade: daysRemaining > 60 ? "A+" : daysRemaining > 30 ? "A" : "B",
      serialNumber: `04:${Math.random().toString(16).substring(2, 14)}`,
      signatureAlgorithm: "SHA256withRSA",
      subjectAlternativeNames: [domain, `www.${domain}`],
    },
    checkedAt: new Date().toISOString(),
  })
}
