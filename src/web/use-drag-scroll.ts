import { RefObject, useEffect } from 'react';
import { Platform, ScrollView } from 'react-native';

/**
 * Mouse drag-to-scroll for horizontal ScrollViews on web.
 *
 * Touch devices already pan natively; desktop mice can't drag a scroll
 * container at all, which kills swipe navigation for reviewers. This adds
 * pointer-based dragging with flick velocity, snapping to `snapInterval`
 * pages, and click suppression after a real drag (so a swipe over a card
 * doesn't open it).
 *
 * No-op on native and for touch/pen pointers.
 */
export function useHorizontalDragScroll(
  ref: RefObject<ScrollView | null>,
  getSnapInterval: (node: HTMLElement) => number,
) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const scrollView = ref.current as
      | (ScrollView & { getScrollableNode?: () => unknown })
      | null;
    const node = (scrollView?.getScrollableNode?.() ?? null) as HTMLElement | null;
    if (!node) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px/ms, sign follows pointer movement
    let restoreTimer: ReturnType<typeof setTimeout> | null = null;

    node.style.cursor = 'grab';

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      // Let form fields behave normally
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = node.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      if (restoreTimer) clearTimeout(restoreTimer);
      // CSS scroll-snap (from pagingEnabled/snapToInterval) fights manual
      // scrollLeft updates — suspend it for the duration of the drag.
      node.style.scrollSnapType = 'none';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        node.style.cursor = 'grabbing';
      }
      if (moved) {
        node.scrollLeft = startScroll - dx;
        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = now;
        e.preventDefault();
      }
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      node.style.cursor = 'grab';

      const interval = getSnapInterval(node);
      if (moved && interval > 0) {
        const current = node.scrollLeft;
        const max = node.scrollWidth - node.clientWidth;
        let page: number;
        if (velocity < -0.4) {
          page = Math.floor(current / interval) + 1; // flick left → next
        } else if (velocity > 0.4) {
          page = Math.ceil(current / interval) - 1; // flick right → previous
        } else {
          page = Math.round(current / interval);
        }
        const target = Math.max(0, Math.min(page * interval, max));
        node.scrollTo({ left: target, behavior: 'smooth' });
      }
      // Restore snap once the smooth scroll has settled
      restoreTimer = setTimeout(() => {
        node.style.scrollSnapType = '';
      }, 450);
    };

    // Swallow the click that follows a drag so cards under the pointer
    // don't activate.
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    node.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    node.addEventListener('click', onClickCapture, true);

    return () => {
      node.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      node.removeEventListener('click', onClickCapture, true);
      if (restoreTimer) clearTimeout(restoreTimer);
    };
  }, [ref, getSnapInterval]);
}
