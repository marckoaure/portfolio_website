import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keyboard behaviour every popup needs:
//  - when it opens, focus moves inside it
//  - Tab / Shift+Tab cycle inside it instead of reaching the page behind
//  - when it closes, focus returns to whatever opened it
// Escape and scroll-locking stay in each component, since each popup closes
// in its own way.
export function useDialogFocus(
  ref: RefObject<HTMLElement | null>,
  open: boolean
) {
  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const items = () =>
      node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];

    // Focus the first control, or the popup itself if it has none.
    (items()[0] ?? node)?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !node) return;
      const list = items();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const current = document.activeElement;

      if (!node.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open, ref]);
}
