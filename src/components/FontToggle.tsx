"use client";

import { useEffect, useState } from "react";

// Dyslexia-friendly font toggle. Persists to localStorage and flips a data
// attribute on <html> that globals.css keys off of.
export function FontToggle() {
  const [readable, setReadable] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mtff-font") === "readable";
    setReadable(saved);
    document.documentElement.dataset.font = saved ? "readable" : "default";
  }, []);

  function toggle() {
    const next = !readable;
    setReadable(next);
    document.documentElement.dataset.font = next ? "readable" : "default";
    localStorage.setItem("mtff-font", next ? "readable" : "default");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={readable}
      className="btn-ghost text-xs"
      title="Toggle an easier-to-read font"
    >
      {readable ? "Standard font" : "Readable font"}
    </button>
  );
}
