"use client";

import {
  useEffect,
  useRef,
  useState,
  startTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [curtainActive, setCurtainActive] = useState(true);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const duration = isMobile ? 420 : 700;
    const timer = setTimeout(() => {
      setCurtainActive(false);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <>
      {curtainActive && (
        <div aria-hidden="true" className="segue-entrance-curtain">
          <div className="segue-entrance-trail" />
          <div className="segue-entrance-lead" />
        </div>
      )}
      {children}
    </>
  );
}
