import { useEffect, useRef, useState } from 'react';
import { OrbItem } from './useFieldLayout';

export interface Position {
  x: number;
  y: number;
  opacity: number;
}

interface GravityParams {
  orbs: OrbItem[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  activeCategory: string | null;
  disabled?: boolean;
}

export function useGravityField({
  orbs,
  containerRef,
  activeCategory,
  disabled,
}: GravityParams): Map<string, Position> {
  const [positions, setPositions] = useState<Map<string, Position>>(new Map());
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number | null>(null);

  const orbStates = useRef<
    Map<
      string,
      {
        x: number;
        y: number;
        vx: number;
        vy: number;
      }
    >
  >(new Map());

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef, disabled]);

  useEffect(() => {
    if (disabled) return;

    const updateLoop = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width || 800;
      const height = rect.height || 500;

      const nextPositions = new Map<string, Position>();

      orbs.forEach((orb) => {
        let state = orbStates.current.get(orb.id);
        const homeX = orb.x * width;
        const homeY = orb.y * height;

        if (!state) {
          state = { x: homeX, y: homeY, vx: 0, vy: 0 };
          orbStates.current.set(orb.id, state);
        }

        // Mouse repulsion physics
        const dx = state.x - mouseRef.current.x;
        const dy = state.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 140;

        let fx = 0;
        let fy = 0;

        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 4;
          fx = (dx / dist) * force;
          fy = (dy / dist) * force;
        }

        // Spring back to base position
        const springK = 0.04;
        const damping = 0.82;

        state.vx = (state.vx + fx + (homeX - state.x) * springK) * damping;
        state.vy = (state.vy + fy + (homeY - state.y) * springK) * damping;

        state.x += state.vx;
        state.y += state.vy;

        const isDimmed = activeCategory !== null && orb.categoryId !== activeCategory;
        const opacity = isDimmed ? 0.25 : 1;

        nextPositions.set(orb.id, {
          x: state.x,
          y: state.y,
          opacity,
        });
      });

      setPositions(nextPositions);
      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [orbs, containerRef, activeCategory, disabled]);

  return positions;
}
