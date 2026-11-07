"use client";

import { useState } from "react";

declare global {
  interface Window {
    /** DataBull custom events, defined by its script in the root layout. */
    datacheap?: (goal: string, params?: Record<string, string>) => void;
  }
}

/** Copy-to-clipboard button used inside PromptCard. */
export default function CopyPrompt({ text, title }: { text: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      // DataBull goal, param values capped at 255 chars
      window.datacheap?.("copy_prompt", title ? { prompt: title.slice(0, 255) } : undefined);
    } catch {
      /* clipboard unavailable (e.g. non-secure context), ignore */
    }
  };

  return (
    <button type="button" className={`prompt-copy${copied ? " copied" : ""}`} onClick={copy}>
      {copied ? "✓ Copied" : "Copy prompt"}
    </button>
  );
}
