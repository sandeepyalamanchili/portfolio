import { useEffect, useRef, useState } from 'react';

const cache = new Map();

/**
 * Samples the average color of an image (via a tiny offscreen canvas) so
 * the UI can tint itself to match whatever photo is currently showing.
 * Results are cached per URL — each photo's color is only ever computed
 * once for the whole session.
 */
export function useDominantColor(src) {
  const [color, setColor] = useState(cache.get(src) || null);
  const lastSrc = useRef(src);

  useEffect(() => {
    lastSrc.current = src;
    if (!src) return undefined;

    if (cache.has(src)) {
      setColor(cache.get(src));
      return undefined;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const size = 16;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0;
        let g = 0;
        let b = 0;
        const pixelCount = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        const rgb = `${r}, ${g}, ${b}`;
        cache.set(src, rgb);
        if (lastSrc.current === src) setColor(rgb);
      } catch {
        // canvas read can fail in odd environments (e.g. file:// protocol)
        // — fail silently and just keep whatever glow color was showing
      }
    };

    return () => {
      cancelled = true;
    };
  }, [src]);

  return color;
}
