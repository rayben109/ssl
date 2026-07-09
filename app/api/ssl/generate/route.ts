import { NextResponse } from "next/server"
import * as acme from "acme-client"

export const runtime = "nodejs"
export const maxDuration = 60

function getDirectoryUrl(mode?: string) {
  return mode === "staging"
    ? acme.directory.letsencrypt.staging
    : acme.directory.letsencrypt.production
}

/**
 * Final step of the ACME flow:
 * - reconstruct the client from the account key + order URL
 * - ask Let's Encrypt to validate each DNS-01 challenge
 * - finalize the order with a fresh CSR
 * - download the issued (browser-trusted) certificate chain
 */
export async function POST(request: Request) {
  try {
    const { domain, wildcard, accountKey, accountUrl, orderUrl, mode } =
      await request.json()

    if (!domain || !accountKey || !orderUrl) {
      return NextResponse.json(
        { error: "Missing order data. Please restart the process." },
        { status: 400 },
      )
    }

    const client = new acme.Client({
      directoryUrl: getDirectoryUrl(mode),
      accountKey,
      accountUrl,
    })

    // Re-fetch the order created earlier (stateless resume)
    const order = await client.getOrder({ url: orderUrl } as acme.Order)
    const authorizations = await client.getAuthorizations(order)

    // Ask Let's Encrypt to validate each pending DNS-01 challenge
    for (const authz of authorizations) {
      if (authz.status === "valid") continue
      const challenge = authz.challenges.find((c) => c.type === "dns-01")
      if (!challenge) {
        throw new Error(
          `No DNS-01 challenge available for ${authz.identifier.value}`,
        )
      }
      await client.completeChallenge(challenge)
      await client.waitForValidStatus(challenge)
    }

    // Generate the certificate key + CSR, then finalize
    const altNames = wildcard ? [domain, `*.${domain}`] : [domain]
    const [key, csr] = await acme.crypto.createCsr({
      commonName: wildcard ? `*.${domain}` : domain,
      altNames,
    })

    const finalizedOrder = await client.finalizeOrder(order, csr)
    const fullChain = await client.getCertificate(finalizedOrder)

    // Split the full chain: leaf cert + intermediate (CA bundle)
    const chain = acme.crypto.splitPemChain(fullChain)
    const certificate = chain[0].trim()
    const caBundle = chain.slice(1).join("\n").trim()

    const info = await acme.crypto.readCertificateInfo(certificate)

    return NextResponse.json({
      success: true,
      certificate,
      privateKey: key.toString().trim(),
      caBundle,
      fullChain: fullChain.trim(),
      details: {
        commonName: info.domains.commonName,
        issuer: info.issuer.commonName,
        notBefore: info.notBefore,
        notAfter: info.notAfter,
      },
    })
  } catch (err) {
    console.error("[v0] generate error:", err)
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to issue certificate",
      },
      { status: 500 },
    )
  }
}
