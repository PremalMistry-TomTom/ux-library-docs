import { useState, useEffect, useRef, useCallback } from 'react';

const GLOBAL_H        = 50;   // px — global header height
const NAV_H           = 52;   // px — UX Library topnav height
const SCROLL_HIDE_AT  = 1;    // scrollY threshold before global header hides
const SCROLL_SHOW_AT  = 8;    // scrollY threshold to auto-show again (back at top)
const HOVER_HIDE_MS   = 2500; // ms idle before re-hiding after hover-reveal
const HOVER_REVEAL_MS = 2500; // ms hover dwell before expanding the global header

export function useGlobalHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef         = useRef(null);
  const revealTimerRef   = useRef(null);
  const mouseInGlobalRef = useRef(false);

  /* ─── Helpers ────────────────────────────────────────────── */
  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current) { clearTimeout(revealTimerRef.current); revealTimerRef.current = null; }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimer();
    // Only hide via timeout when the page has actually scrolled — never time-out
    // and collapse the header while the user is at the top of the page.
    timerRef.current = setTimeout(() => {
      if (!mouseInGlobalRef.current && window.scrollY > SCROLL_SHOW_AT) {
        setIsVisible(false);
      }
    }, HOVER_HIDE_MS);
  }, [clearTimer]);

  /** Call this from any hover-entry that should reveal the global header.
   *  Waits HOVER_REVEAL_MS before expanding — cancelled if mouse leaves first. */
  const reveal = useCallback(() => {
    clearRevealTimer();
    revealTimerRef.current = setTimeout(() => {
      setIsVisible(true);
      scheduleHide();
    }, HOVER_REVEAL_MS);
  }, [clearRevealTimer, scheduleHide]);

  /** Mouse entered the global header itself — cancel the idle timer */
  const onMouseEnterGlobal = useCallback(() => {
    mouseInGlobalRef.current = true;
    clearRevealTimer();
    clearTimer();
  }, [clearRevealTimer, clearTimer]);

  /** Mouse left the global header — restart idle timer */
  const onMouseLeaveGlobal = useCallback(() => {
    mouseInGlobalRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  /* ─── Scroll-based show / hide ───────────────────────────── */
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;

      if (y <= SCROLL_SHOW_AT) {
        // Back at the very top — always reveal, cancel any pending timer
        clearTimer();
        setIsVisible(true);
      } else if (y > SCROLL_HIDE_AT && y > lastY && !mouseInGlobalRef.current) {
        // Scrolling down past threshold — hide
        clearTimer();
        setIsVisible(false);
      }
      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [clearTimer]);

  /* ─── Push state into CSS custom properties ──────────────── */
  useEffect(() => {
    const el = document.documentElement;
    const offset = isVisible ? GLOBAL_H + NAV_H : NAV_H;
    el.style.setProperty('--app-top-offset',      `${offset}px`);
    el.style.setProperty('--topnav-top',           isVisible ? `${GLOBAL_H}px` : '0px');
    // Breadcrumb: nudge left by crumb's own padding-left so text aligns at 32px (logo edge);
    // shift right to clear the logo when global is hidden (collapsed single-bar state).
    el.style.setProperty('--breadcrumb-shift',     isVisible ? '-16px' : '120px');
    el.style.setProperty('--breadcrumb-sep-alpha', isVisible ? '0' : '1');
  }, [isVisible]);

  /* ─── Init CSS vars synchronously (avoid flash) ─────────── */
  useEffect(() => {
    const el = document.documentElement;
    el.style.setProperty('--app-top-offset',      `${GLOBAL_H + NAV_H}px`);
    el.style.setProperty('--topnav-top',           `${GLOBAL_H}px`);
    el.style.setProperty('--breadcrumb-shift',     '-16px');
    el.style.setProperty('--breadcrumb-sep-alpha', '0');
    return () => { clearTimer(); clearRevealTimer(); };
  }, [clearTimer, clearRevealTimer]);

  return { isVisible, reveal, cancelReveal: clearRevealTimer, onMouseEnterGlobal, onMouseLeaveGlobal };
}
