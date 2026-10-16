import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Dialog({ label, onClose, children, className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6' }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const siblings = [...document.body.children].filter(el => el !== dialog && !['SCRIPT', 'STYLE'].includes(el.tagName));
    const inertStates = siblings.map(el => el.inert);
    siblings.forEach(el => { el.inert = true; });
    const focusables = () => [...dialog.querySelectorAll('button, a[href], input, textarea, select, [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
    const frame = requestAnimationFrame(() => (focusables()[0] || dialog).focus());
    const keyboard = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key !== 'Tab') return;
      const elements = focusables();
      const first = elements[0], last = elements.at(-1);
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first.focus(); }
    };
    const observer = new MutationObserver(() => {
      if (!dialog.contains(document.activeElement)) (focusables()[0] || dialog).focus();
    });
    observer.observe(dialog, { childList: true, subtree: true });
    dialog.addEventListener('keydown', keyboard);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      dialog.removeEventListener('keydown', keyboard);
      document.body.style.overflow = overflow;
      siblings.forEach((el, i) => { el.inert = inertStates[i]; });
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return createPortal(<div ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} className={className}>{children}</div>, document.body);
}
