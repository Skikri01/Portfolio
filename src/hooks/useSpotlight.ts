import { useCallback } from 'react';

export function useSpotlight() {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const track = e.currentTarget;
    const cards = track.querySelectorAll<HTMLElement>('.spotlight');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  return handleMouseMove;
}
