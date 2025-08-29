import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Directive({
  selector: '[textFit]',
  standalone: true,
})
export class TextFitDirective implements AfterViewInit, OnDestroy {
  @Input() tfMin = 12;
  @Input() tfMax = 200;
  
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private destroyed = false;
  private readonly isBrowser: boolean;

  constructor(
    private hostRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const element = this.hostRef.nativeElement;
    element.style.display = 'block';
    element.style.width = '100%';
    element.style.whiteSpace = 'nowrap';
    element.style.overflow = 'hidden';

    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => this.fit());
      this.resizeObserver.observe(element);
      
      this.mutationObserver = new MutationObserver(() => this.fit());
      this.mutationObserver.observe(element, {
        childList: true,
        characterData: true,
        subtree: true,
      });
      
      window.addEventListener('resize', () => this.fit());
    });

    this.fit();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (!this.isBrowser) return;
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    window.removeEventListener('resize', () => this.fit());
  }

  private fit = () => {
    if (this.destroyed) return;
    
    const element = this.hostRef.nativeElement;
    const containerWidth = element.clientWidth || element.parentElement?.clientWidth || 0;
    if (containerWidth <= 0) return;

    let low = this.tfMin || 12, high = this.tfMax || 200, best = low;

    element.style.fontSize = high + 'px';
    if (element.scrollWidth <= containerWidth) return;

    while (low <= high) {
      const mid = (low + high) >> 1;
      element.style.fontSize = mid + 'px';
      if (element.scrollWidth <= containerWidth) { best = mid; low = mid + 1; }
      else { high = mid - 1; }
    }

    element.style.fontSize = best + 'px';
  };
}
