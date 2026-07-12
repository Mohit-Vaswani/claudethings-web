"use client";

import { useState } from "react";

/** Copy-to-clipboard button used inside PromptCard. */
export default function CopyPrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (e.g. non-secure context) — ignore */
    }
  };

  return (
    <button type="button" className={`prompt-copy${copied ? " copied" : ""}`} onClick={copy}>
      {copied ? "✓ Copied" : "Copy prompt"}
    </button>
  );
}
