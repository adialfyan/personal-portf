import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getMessages, type MessageStatus } from "@/lib/queries/messages";

const FILTERS: { value: MessageStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
  { value: "spam", label: "Spam" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MessagesPage({
  searchParams,
}: PageProps<"/admin/messages">) {
  await requireAdmin("/admin/messages");
  const params = await searchParams;
  const raw = params.status;
  const filter: MessageStatus | "all" =
    raw === "unread" || raw === "read" || raw === "archived" || raw === "spam"
      ? raw
      : "all";

  const messages = await getMessages(filter);

  return (
    <div>
      <h1
        className="text-4xl tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Messages
      </h1>
      <p className="mt-2 mb-8 leading-relaxed text-muted">
        Inquiries from the contact form. Reply via your email client.
      </p>

      <div className="flex flex-wrap gap-2 text-xs tracking-[0.16em] uppercase">
        {FILTERS.map((f) => {
          const isSelected = filter === f.value;
          return (
            <Link
              key={f.value}
              href={
                f.value === "all" ? "/admin/messages" : `/admin/messages?status=${f.value}`
              }
              className={`group inline-flex items-center px-3.5 py-2 text-xs font-medium uppercase rounded-[3px] border transition-all duration-150 select-none ${
                isSelected
                  ? "bg-[#0a0a0a] text-white border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.24),0_1px_0_#000] active:translate-y-[1px]"
                  : "bg-neutral-50/90 text-neutral-600 border-neutral-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-neutral-100 hover:text-foreground hover:border-neutral-400/90 active:translate-y-[1px]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-[1.5px] mr-2 shrink-0 border transition-all ${
                  isSelected
                    ? "bg-white border-white/80 shadow-[0_0_4px_rgba(255,255,255,0.9)]"
                    : "bg-neutral-300 border-neutral-400/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] group-hover:bg-neutral-400"
                }`}
              />
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 border-t border-border">
        {messages.length === 0 ? (
          <p className="py-6 leading-relaxed text-muted">
            No messages{filter !== "all" ? ` with status "${filter}"` : ""}.
          </p>
        ) : (
          messages.map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages/${m.id}`}
              className="block border-b border-border py-4 hover:text-accent"
            >
              <span className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="flex items-center gap-3">
                  {m.status === "unread" && (
                    <span
                      aria-label="Unread"
                      className="inline-block h-2 w-2 bg-accent"
                    />
                  )}
                  <span className="font-medium">{m.name}</span>
                  <span className="text-sm text-muted">{m.email}</span>
                </span>
                <span className="flex items-center gap-4 font-mono text-xs tracking-[0.2em] uppercase text-muted">
                  <span>{formatDate(m.created_at)}</span>
                  <span>{m.status}</span>
                </span>
              </span>
              <span className="mt-1 block truncate text-sm text-muted">
                {m.subject ? `${m.subject} — ` : ""}
                {m.message}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
