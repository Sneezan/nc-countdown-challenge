export function shouldShowQuote(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 430px)').matches;
}

export function addMediaQueryListener(
  query: string,
  callback: (matches: boolean) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia(query);
  const handler = (event: MediaQueryListEvent) => callback(event.matches);

  mediaQuery.addEventListener('change', handler);

  return () => mediaQuery.removeEventListener('change', handler);
}
