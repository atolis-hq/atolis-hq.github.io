import { useEffect, useState } from 'react';

export function resolveAnchoredScrollProgress(anchors: number[], scrollY: number): number {
  if (anchors.length <= 1) {
    return 0;
  }

  if (scrollY <= anchors[0]) {
    return 0;
  }

  const lastIndex = anchors.length - 1;
  if (scrollY >= anchors[lastIndex]) {
    return 1;
  }

  for (let index = 0; index < lastIndex; index += 1) {
    const start = anchors[index];
    const end = anchors[index + 1];

    if (scrollY >= start && scrollY <= end) {
      const localProgress = (scrollY - start) / (end - start);
      return (index + localProgress) / lastIndex;
    }
  }

  return 1;
}

function getFocusAnchors(): number[] {
  const focusSections = Array.from(document.querySelectorAll<HTMLElement>('[data-focus-section]'));

  if (focusSections.length <= 1) {
    return [0, document.documentElement.scrollHeight - window.innerHeight];
  }

  return focusSections.map((section) => {
    if (section.classList.contains('hero-section')) {
      return section.offsetTop;
    }

    return section.offsetTop + section.offsetHeight / 2 - window.innerHeight / 2;
  });
}

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setProgress(resolveAnchoredScrollProgress(getFocusAnchors(), window.scrollY));
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}
