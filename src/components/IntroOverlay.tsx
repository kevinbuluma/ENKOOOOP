import { useEffect, useState } from 'react';
import { Logo } from './common';

function hasSeenIntro() {
  try { return window.sessionStorage.getItem('enkop-intro-seen') === '1'; }
  catch { return false; }
}

export function IntroOverlay() {
  const [visible, setVisible] = useState(() => window.location.pathname === '/' && !hasSeenIntro());
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(() => dismiss(), reduceMotion ? 350 : 1850);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  function dismiss() {
    try { window.sessionStorage.setItem('enkop-intro-seen', '1'); } catch { /* storage may be unavailable */ }
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 520);
  }

  if (!visible) return null;
  return (
    <div className={`intro-overlay ${leaving ? 'intro-overlay--leaving' : ''}`} aria-label="ENKOP introduction">
      <div className="intro-overlay__center">
        <Logo light />
        <span className="intro-overlay__rule"><i /></span>
        <span className="intro-overlay__caption">A considered view of property</span>
      </div>
      <button type="button" className="intro-overlay__skip" onClick={dismiss}>Skip introduction <span>↗</span></button>
    </div>
  );
}
