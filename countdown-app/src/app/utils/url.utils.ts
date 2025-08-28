export interface UrlParams {
  title: string;
  date: string;
}

export function updateUrlParams(title: string, date: string): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  if (title) url.searchParams.set('title', title);
  else url.searchParams.delete('title');
  if (date) url.searchParams.set('date', date);
  else url.searchParams.delete('date');
  window.history.replaceState({}, '', url.toString());
}

export function getUrlParams(): UrlParams {
  if (typeof window === 'undefined') {
    return { title: '', date: '' };
  }

  const url = new URL(window.location.href);
  return {
    title: url.searchParams.get('title') ?? '',
    date: url.searchParams.get('date') ?? '',
  };
}
