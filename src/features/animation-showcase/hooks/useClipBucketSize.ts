import { useEffect, useState } from "react";

import type { ClipSizeBucket } from "../animation-showcase.data";

function getQueries() {
  return {
    shortMobile: window.matchMedia(
      "(max-width: 639px) and (max-height: 700px)"
    ),
    mobile: window.matchMedia("(max-width: 639px)"),
    sm: window.matchMedia("(min-width: 640px) and (max-width: 1023px)"),
  };
}

function resolveBucket(queries: ReturnType<typeof getQueries>): ClipSizeBucket {
  if (queries.shortMobile.matches) return "shortMobile";
  if (queries.mobile.matches) return "mobile";
  if (queries.sm.matches) return "sm";
  return "lg";
}

export function useClipBucketSize(): ClipSizeBucket {
  const [bucket, setBucket] = useState<ClipSizeBucket>(() =>
    resolveBucket(getQueries())
  );

  useEffect(() => {
    const queries = getQueries();
    const onChange = () => setBucket(resolveBucket(queries));

    const mediaQueries = Object.values(queries);
    mediaQueries.forEach((mq) => mq.addEventListener("change", onChange));

    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener("change", onChange));
    };
  }, []);

  return bucket;
}
