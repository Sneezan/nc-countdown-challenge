import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export function isBrowserPlatform(): boolean {
  return isPlatformBrowser(inject(PLATFORM_ID));
}

export function addResizeListener(handler: () => void): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('resize', handler);
}

export function removeResizeListener(handler: () => void): void {
  if (typeof window === 'undefined') return;
  window.removeEventListener('resize', handler);
}

export function isWindowAvailable(): boolean {
  return typeof window !== 'undefined';
}
