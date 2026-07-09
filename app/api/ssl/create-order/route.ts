import { NextResponse } from "next/server"
import * as acme from "acme-client"

// acme-client needs the Node.js runtime (uses node:crypto + outbound TLS)
export const runtime = "nodejs"
export const maxDuration = 60

function getDirectoryUrl(mode?: string) {
  return mode === "staging"
    ? acme.directory.letsencrypt.staging
    : acme.directory.letsencrypt.production
}

/**
 * Step 1 of the ACME flow (modeled after afosto/yaac):
 * - create a Let's Encrypt account
 * - create an order for the requested domain(s)
 * - return the DNS-01 challenge TXT records the user must add
 *
 * The account key + order URL are returned to the client so the flow can be
 * completed statelessly on the /generate call (no server-side session needed).
 */
export async function POST(request: Request) {
  try {
    const { domain, email, wildcard, mode } = await request.json()

    if (!domain || !email) {
      return NextResponse.json(
        { error: "Domain and email are required" },
        { status: 400 },
      )
    }

    const accountKey = await acme.crypto.createPrivateKey()
    const client = new acme.Client({
      directoryUrl: getDirectoryUrl(mode),
      accountKey,
    })

    await client.createAccount({
      termsOfServiceAgreed: true,
      contact: [`mailto:${email}`],
    })

    const identifiers: { type: "dns"; value: string }[] = [
      { type: "dns", value: domain },
    ]
    if (wildcard) {
      identifiers.push({ type: "dns", value: `*.${domain}` })
    }

    const order = await client.createOrder({ identifiers })
    const authorizations = await client.getAuthorizations(order)

    const records: { name: string; value: string; identifier: string }[] = []
    for (const authz of authorizations) {
      const challenge = authz.challenges.find((c) => c.type === "dns-01")
      if (!challenge) {
        throw new Error(
          `No DNS-01 challenge available for ${authz.identifier.value}`,
        )
      }
      const value = await client.getChallengeKeyAuthorization(challenge)
      const baseDomain = authz.identifier.value.replace(/^\*\./, "")
      records.push({
        name: `_acme-challenge.${baseDomain}`,
        value,
        identifier: authz.identifier.value,
      })
    }

    return NextResponse.json({
      success: true,
      accountKey: accountKey.toString(),
      accountUrl: client.getAccountUrl(),
      orderUrl: order.url,
      records,
      mode: mode === "staging" ? "staging" : "production",
    })
  } catch (err) {
    console.error("[v0] create-order error:", err)
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create ACME order",
      },
      { status: 500 },
    )
  }
}
