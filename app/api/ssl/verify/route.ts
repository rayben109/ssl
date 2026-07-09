import { NextResponse } from "next/server"
import { Resolver } from "node:dns/promises"

export const runtime = "nodejs"

/**
 * Self-test: check whether the DNS-01 TXT records have propagated before we
 * ask Let's Encrypt to validate them. Uses public resolvers (Cloudflare +
 * Google) to avoid stale local caches.
 */
export async function POST(request: Request) {
  try {
    const { records } = await request.json()

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: "No DNS records provided" },
        { status: 400 },
      )
    }

    const resolver = new Resolver()
    resolver.setServers(["1.1.1.1", "8.8.8.8"])

    const results: {
      name: string
      found: boolean
      values: string[]
      error?: string
    }[] = []
    let allValid = true

    for (const rec of records) {
      try {
        const txtChunks = await resolver.resolveTxt(rec.name)
        const flat = txtChunks.map((chunk) => chunk.join(""))
        const found = flat.includes(rec.value)
        if (!found) allValid = false
        results.push({ name: rec.name, found, values: flat })
      } catch (e) {
        allValid = false
        results.push({
          name: rec.name,
          found: false,
          values: [],
          error: e instanceof Error ? e.message : "DNS lookup failed",
        })
      }
    }

    return NextResponse.json({ success: true, verified: allValid, results })
  } catch (err) {
    console.error("[v0] verify error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification failed" },
      { status: 500 },
    )
  }
}
