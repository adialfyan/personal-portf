"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset?: (widgetId?: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !widgetRef.current) return;
    const container = widgetRef.current;

    const renderWidget = () => {
      if (!window.turnstile || !container.isConnected) return;
      if (container.dataset.rendered === "1") return;
      container.dataset.rendered = "1";
      window.turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }
    window.onTurnstileLoad = renderWidget;
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      delete window.onTurnstileLoad;
      script.remove();
    };
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Something went wrong.");
      }
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-border bg-white p-6 sm:p-8"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 text-[11px] font-semibold tracking-[0.2em] uppercase">
          <span className="text-foreground">Received &bull; Confirmation</span>
          <span className="text-muted font-normal">Thank You</span>
        </div>
        <p
          className="mt-5 text-2xl sm:text-3xl tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Message received.
        </p>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted font-normal">
          Thanks for reaching out. I read every message personally and will
          reply to the address you provided.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-[3px] border border-neutral-300/80 bg-neutral-50/90 text-xs font-medium tracking-[0.16em] uppercase text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:border-neutral-400/90 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
        >
          <span>Write another message</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-[3px] border border-neutral-300/80 bg-white px-3.5 py-3 text-sm sm:text-base leading-relaxed text-foreground outline-none placeholder:text-muted/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] transition-colors focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10";

  const labelClass =
    "mb-2 block text-[11px] font-medium tracking-[0.18em] uppercase text-muted";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5"
      aria-busy={status === "sending"}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>
          Subject <span className="normal-case tracking-normal text-muted/60">(optional)</span>
        </span>
        <input
          name="subject"
          maxLength={150}
          placeholder="Project inquiry"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Tell me about your project, timeline, and goals."
          className={`${inputClass} resize-y`}
        />
      </label>
      {/* Honeypot — humans never fill this. */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {TURNSTILE_SITE_KEY && <div ref={widgetRef} className="pt-1" />}
      {status === "error" && error && (
        <p
          role="alert"
          className="border-l-2 border-foreground pl-3 text-sm leading-relaxed text-foreground"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-[3px] border border-black bg-[#0a0a0a] px-6 py-3.5 text-xs font-medium tracking-[0.2em] uppercase text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.24),0_1px_0_#000] hover:bg-neutral-900 active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] disabled:opacity-50 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-[1.5px] bg-white border border-white/80 shadow-[0_0_4px_rgba(255,255,255,0.9)]" />
          <span>{status === "sending" ? "Sending…" : "Send message"}</span>
          <span aria-hidden="true">&#8599;</span>
        </button>
        <span className="text-xs text-muted/70 font-normal">
          Name, email and message are required.
        </span>
      </div>
    </form>
  );
}
