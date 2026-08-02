import { useState } from "react";
import { motion } from "motion/react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { asset } from "../../../lib/asset";
import { fadeUpInView, stagger } from "../showcase-page.motion";

const RIVE_SCREENSHOT_SRC = asset("rive-screenshot.png");
const RIVE_SCREENSHOT_ALT =
  "Rive editor — cup.riv artboard, hierarchy, and state machine";

export function InsideTheFile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="px-5 py-10 sm:px-14">
      <motion.div
        className="mb-6 text-[11px] tracking-[0.18em] text-[#8b929c] uppercase"
        {...fadeUpInView}
      >
        Inside Rive editor
      </motion.div>

      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-[#1e2228] p-0"
        aria-label="Open Rive editor screenshot — pinch or scroll to zoom"
        {...fadeUpInView}
        transition={stagger(0.08)}
      >
        <img
          src={RIVE_SCREENSHOT_SRC}
          alt={RIVE_SCREENSHOT_ALT}
          className="block h-auto w-full"
        />
      </motion.button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: RIVE_SCREENSHOT_SRC, alt: RIVE_SCREENSHOT_ALT }]}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        on={{ click: () => setOpen(false) }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        zoom={{
          maxZoomPixelRatio: 4,
          scrollToZoom: true,
          doubleTapDelay: 300,
        }}
      />
    </div>
  );
}
