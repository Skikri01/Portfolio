import { useRef } from 'react';

export function useReveal<T extends HTMLElement = HTMLHeadingElement>() {
  const ref = useRef<T>(null);
  return ref;
}
