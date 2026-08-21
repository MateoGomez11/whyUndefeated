'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Two-line fixed hero headline:
 *   line 1:  Is <cycling app name>▌
 *   line 2:  Still Undefeated?
 *
 * The app name cycles with a typewriter effect and the blinking caret (.ds-cursor)
 * belongs ONLY here — never in the header/wordmark. This is progressive
 * enhancement: the first name is server-rendered, so with JavaScript disabled the
 * headline still reads as a complete "Is <name> Still Undefeated?" (FR-011).
 */
export function HeroHeadline({ names }: { names: string[] }) {
  const words = names.length > 0 ? names : ['the internet'];
  // SSR / no-JS state: the full first name.
  const [text, setText] = useState(words[0]);
  const [isMounted, setIsMounted] = useState(false);
  const wordsRef = useRef(words);
  wordsRef.current = words;

  useEffect(() => {
    setIsMounted(true);
    const w = wordsRef.current;
    let wordIndex = 0;
    let charIndex = w[0].length;
    let deleting = true; // start by holding, then deleting the first (already shown) word
    let timeoutId: ReturnType<typeof setTimeout>;
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const holdTime = 1200;
    const pauseTime = 300;

    function step() {
      const word = w[wordIndex % w.length];
      if (!deleting) {
        charIndex++;
        setText(word.slice(0, charIndex));
        if (charIndex === word.length) {
          deleting = true;
          timeoutId = setTimeout(step, holdTime);
          return;
        }
        timeoutId = setTimeout(step, typeSpeed);
      } else {
        charIndex--;
        setText(word.slice(0, charIndex));
        if (charIndex === 0) {
          deleting = false;
          wordIndex++;
          timeoutId = setTimeout(step, pauseTime);
          return;
        }
        timeoutId = setTimeout(step, deleteSpeed);
      }
    }

    timeoutId = setTimeout(step, holdTime);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <h1
      style={{
        font: '700 clamp(32px, 5vw, 64px)/1.15 var(--font-sans), sans-serif',
        color: 'var(--fg-primary)',
        letterSpacing: 'var(--tracking-tight)',
        margin: '0 auto 16px',
        maxWidth: 880,
      }}
    >
      <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
        <span>Is </span>
        <span
          style={{ color: 'var(--brand-400)', borderBottom: '2px solid var(--brand-600)' }}
          suppressHydrationWarning
        >
          {isMounted ? text : words[0]}
        </span>
        <span className="ds-cursor" aria-hidden="true" />
      </span>
      <span style={{ display: 'block' }}>Still Undefeated?</span>
    </h1>
  );
}
