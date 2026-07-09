export async function copyToClipboard(text: string): Promise<boolean> {
  // Preferred modern API — may be blocked by permissions policy (e.g. in sandboxed iframes)
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to legacy method
    }
  }

  // Legacy fallback using a temporary textarea + execCommand
  try {
    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.top = "-9999px"
    textarea.style.left = "-9999px"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const successful = document.execCommand("copy")
    document.body.removeChild(textarea)
    return successful
  } catch {
    return false
  }
}
