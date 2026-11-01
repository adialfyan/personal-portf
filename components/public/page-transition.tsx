"use client";

import {
  useEffect,
  useRef,
  startTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const finishRef = useRef<(() => void) | null>(null);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // When pathname changes (new route has mounted), resolve the pending view transition
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      if (finishRef.current) {
        finishRef.current();
        finishRef.current = null;
      }
    }
  }, [pathname]);

  const router = useRouter();

  // Global click delegator: any standard internal link triggers startViewTransition
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;
      if (target.target && target.target !== "_self") return;

      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // In-page hash link (e.g. #work) - let browser/smooth scroll handle it
      if (url.pathname === window.location.pathname) return;

      if (!("startViewTransition" in document)) return;

      e.preventDefault();
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timer = setTimeout(() => resolve(), 3500);
            startTransition(() => {
              router.push(url.pathname + url.search + url.hash);
              finishRef.current = () => {
                clearTimeout(timer);
                resolve();
              };
            });
          })
      );
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleClick, { capture: true });
  }, [router]);

  return <>{children}</>;
}
