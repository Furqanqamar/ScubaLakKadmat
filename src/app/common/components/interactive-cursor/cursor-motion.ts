export interface CursorElements {
  root: HTMLElement;
  ring: HTMLElement;
  dot: HTMLElement;
}

export interface CursorMotion {
  setSuspended(suspended: boolean): void;
  destroy(): void;
}

const NATIVE_POINTER = 'input, textarea, select, label, [contenteditable]:not([contenteditable="false"]), [data-cursor="native"], iframe, video[controls], dialog';
const INTERACTIVE = 'a[href], button:not(:disabled), summary, [role="button"]:not([aria-disabled="true"]), [data-cursor]:not([data-cursor="native"])';

/** Time-based trailing motion; no Angular renders or perpetual animation loop. */
export function createCursorMotion(document: Document, elements: CursorElements): CursorMotion {
  const view = document.defaultView;
  if (!view) return { setSuspended() {}, destroy() {} };
  const pointer = view.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
  let frame: number | null = null, lastTime: number | null = null;
  let targetX = 0, targetY = 0, ringX = 0, ringY = 0;
  let positioned = false, visible = false, suspended = false, destroyed = false;
  let mode = '';
  const enabled = (): boolean => !destroyed && !suspended && pointer.matches && !reduced.matches;
  const place = (element: HTMLElement, x: number, y: number): void => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };
  const hide = (): void => {
    visible = false; positioned = false; lastTime = null;
    elements.root.setAttribute('data-cursor-state', 'hidden');
    elements.root.removeAttribute('data-cursor-pressed');
    document.body?.classList.remove('custom-cursor-enabled');
    if (frame !== null) { view.cancelAnimationFrame(frame); frame = null; }
  };
  const targetElement = (target: EventTarget | null): Element | null => target instanceof view.Element ? target : null;
  const eligible = (target: EventTarget | null): boolean => {
    const element = targetElement(target);
    if (!enabled() || !element || element.closest(NATIVE_POINTER)) { hide(); return false; }
    const nextMode = element.closest(INTERACTIVE) ? 'interactive' : 'default';
    if (nextMode !== mode) { mode = nextMode; elements.root.setAttribute('data-cursor-mode', mode); }
    return true;
  };
  const animate = (time: number): void => {
    frame = null;
    if (!visible || !enabled()) return;
    // 80ms damping feels the same on 60Hz and high-refresh displays.
    const elapsed = lastTime === null ? 1000 / 60 : Math.min(64, Math.max(0, time - lastTime));
    const follow = 1 - Math.exp(-elapsed / 80);
    lastTime = time;
    ringX += (targetX - ringX) * follow;
    ringY += (targetY - ringY) * follow;
    const settled = Math.hypot(targetX - ringX, targetY - ringY) < .1;
    if (settled) { ringX = targetX; ringY = targetY; lastTime = null; }
    place(elements.dot, targetX, targetY);
    place(elements.ring, ringX, ringY);
    if (!settled) frame = view.requestAnimationFrame(animate);
  };
  const move = (event: PointerEvent): void => {
    if ((event.pointerType && event.pointerType !== 'mouse') || !eligible(event.target)) { hide(); return; }
    targetX = event.clientX; targetY = event.clientY;
    if (!positioned) {
      ringX = targetX; ringY = targetY; positioned = true;
      place(elements.dot, targetX, targetY);
      place(elements.ring, ringX, ringY);
    }
    if (!visible) {
      visible = true;
      elements.root.setAttribute('data-cursor-state', 'visible');
      document.body?.classList.add('custom-cursor-enabled');
    }
    if (frame === null) { lastTime = view.performance.now(); frame = view.requestAnimationFrame(animate); }
  };
  const over = (event: PointerEvent): void => {
    if (event.pointerType && event.pointerType !== 'mouse') { hide(); return; }
    if (visible) eligible(event.target);
  };
  const out = (event: PointerEvent): void => {
    if (!event.relatedTarget) hide();
    else if (visible) eligible(event.relatedTarget);
  };
  const down = (event: PointerEvent): void => {
    if (visible && (!event.pointerType || event.pointerType === 'mouse') && eligible(event.target)) elements.root.setAttribute('data-cursor-pressed', 'true');
  };
  const up = (): void => { elements.root.removeAttribute('data-cursor-pressed'); };
  const scroll = (): void => { if (visible) eligible(document.elementFromPoint(targetX, targetY)); };
  const visibility = (): void => { if (document.visibilityState === 'hidden') hide(); };
  const capability = (): void => { if (!enabled()) hide(); };

  hide();
  view.addEventListener('pointermove', move, { passive: true });
  view.addEventListener('pointerdown', down, { passive: true });
  view.addEventListener('pointerup', up, { passive: true });
  view.addEventListener('pointercancel', hide, { passive: true });
  view.addEventListener('blur', hide);
  view.addEventListener('scroll', scroll, { passive: true, capture: true });
  document.addEventListener('pointerover', over, { passive: true });
  document.addEventListener('pointerout', out, { passive: true });
  document.addEventListener('pointerleave', hide);
  document.addEventListener('visibilitychange', visibility);
  pointer.addEventListener('change', capability);
  reduced.addEventListener('change', capability);
  return {
    setSuspended(value) { suspended = value; if (suspended) hide(); },
    destroy() {
      destroyed = true; hide();
      view.removeEventListener('pointermove', move);
      view.removeEventListener('pointerdown', down);
      view.removeEventListener('pointerup', up);
      view.removeEventListener('pointercancel', hide);
      view.removeEventListener('blur', hide);
      view.removeEventListener('scroll', scroll, true);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', visibility);
      pointer.removeEventListener('change', capability);
      reduced.removeEventListener('change', capability);
    }
  };
}
