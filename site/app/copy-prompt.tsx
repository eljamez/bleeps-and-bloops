"use client";

import { useState } from "react";

export function CopyPrompt({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy prompt");

  return (
    <button
      type="button"
      className="border border-ink bg-amber px-3 py-2 text-sm font-bold text-ink"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(
          () => setLabel("Copied"),
          () => setLabel("Copy failed"),
        );
      }}
    >
      {label}
    </button>
  );
}
