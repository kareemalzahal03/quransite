import { h } from 'preact';
import { useRef, useState, useLayoutEffect, useEffect } from 'preact/hooks';

export function InfoPopup({ popupMessage, children }) {
  const wrapperRef = useRef(null);
  const popupRef = useRef(null);
  const [left, setLeft] = useState(0);
  const [visible, setVisible] = useState(false);

  const updatePopupPosition = () => {
    if (!wrapperRef.current || !popupRef.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const popupWidth = popupRef.current.offsetWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const margin = 15; // Padding between popup and screen edge

    // Center the popup over the wrapper
    let idealLeft = wrapperRect.width / 2 - popupWidth / 2;

    // Clamp so the popup doesn't overflow right or left
    const maxLeft = viewportWidth - wrapperRect.left - popupWidth - margin;
    if (idealLeft > maxLeft) idealLeft = maxLeft;
    if (idealLeft < -wrapperRect.left + margin) idealLeft = -wrapperRect.left + margin;

    setLeft(idealLeft);
  };

  useLayoutEffect(() => {
    if (visible) updatePopupPosition();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    window.addEventListener('resize', updatePopupPosition);
    return () => window.removeEventListener('resize', updatePopupPosition);
  }, [visible]);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const toggle = () => setVisible(v => !v);

  return (
    <div ref={wrapperRef} class="info-popup-wrapper">
      {/* Popup */}
      {visible && (
        <div ref={popupRef} class="info-popup" style={{ left: `${left}px` }}>
          {popupMessage}
        </div>
      )}
      {/* Render the user’s trigger content and the arrow */}
      {children({ show, hide, toggle, visible })}
      {/* Small Arrow */}
      {visible && <div class="info-popup-arrow" />}
    </div>
  );
}
