import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";

export default function Loading() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-6"
      >
        <p
          role="status"
          className="text-xs font-medium tracking-[0.2em] uppercase text-muted"
        >
          Loading…
        </p>
      </main>
      <SiteFooter email={null} socialLinks={[]} />
    </div>
  );
}
