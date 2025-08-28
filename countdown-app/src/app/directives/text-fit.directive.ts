import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Directive({
  selector: '[textFit]',
  standalone: true,
})
export class TextFitDirective implements AfterViewInit, OnDestroy {
  // Minimum/maximum font sizes (px) the fitter can choose between
  @Input() tfMin?: number;
  @Input() tfMax?: number;

  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private rafId: number | null = null;
  private destroyed = false;
  private readonly isBrowser: boolean;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    // SSR-safety: only run browser APIs when rendering in the browser
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const element = this.hostRef.nativeElement;
    // Ensure predictable single-line measuring context
    element.style.display = 'block';
    element.style.width = '100%';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';

    // Observe size and content changes outside Angular to avoid change detection thrash
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(this.scheduleFit);
      this.resizeObserver.observe(element);

      this.mutationObserver = new MutationObserver(this.scheduleFit);
      this.mutationObserver.observe(element, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      window.addEventListener('resize', this.scheduleFit);
    });

    this.scheduleFit();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (!this.isBrowser) return;
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    window.removeEventListener('resize', this.scheduleFit);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  // Debounce multiple triggers into a single RAF-ticked fit
  private scheduleFit = () => {
    if (!this.isBrowser || this.destroyed) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.fit);
  };

  // Binary search the largest font-size that fits within the element width
  private fit = () => {
    const element = this.hostRef.nativeElement;
    const containerWidth = element.clientWidth || element.parentElement?.clientWidth || 0;
    if (containerWidth <= 0) return;

    let low = this.tfMin,
      high = this.tfMax,
      best = low;

    // Quick-path: try max first
    element.style.fontSize = high + 'px';
    if (element.scrollWidth <= containerWidth) return;

    // Find the largest size that does not overflow
    while (typeof low === 'number' && typeof high === 'number' && low <= high) {
      const mid = (low + high) >> 1;
      element.style.fontSize = mid + 'px';
      if (element.scrollWidth <= containerWidth) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    element.style.fontSize = best + 'px';
  };
}
