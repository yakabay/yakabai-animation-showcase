import { type RefObject, useEffect, useState } from "react";

/** True when `sentinelRef` has scrolled past the sticky top inset (mobile only). */
export function useStickyStuck(
  sentinelRef: RefObject<Element | null>,
  mobileQuery = "(max-width: 639px)"
): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const mql = window.matchMedia(mobileQuery);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(mql.matches && !entry.isIntersecting);
      },
      {
        threshold: 0,
        // Match sticky `top-4` (16px) so the cue flips when pinning starts.
        rootMargin: "-16px 0px 0px 0px",
      }
    );

    const onQueryChange = () => {
      if (!mql.matches) setStuck(false);
    };

    observer.observe(sentinel);
    mql.addEventListener("change", onQueryChange);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", onQueryChange);
    };
  }, [mobileQuery, sentinelRef]);

  return stuck;
}
