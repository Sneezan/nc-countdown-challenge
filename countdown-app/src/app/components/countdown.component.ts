import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteComponent } from './QuoteOfTheDay/quote.component';
import { TextFitDirective } from '../directives/text-fit.directive';
import { calculateCountdown } from '../utils/countdown.utils';
import { getUrlParams, updateUrlParams } from '../utils/url.utils';
import { isBrowserPlatform, addResizeListener, removeResizeListener } from '../utils/browser.utils';
import { shouldShowQuote } from '../utils/media.utils';
import { isValidTitle } from '../utils/validation.utils';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, FormsModule, QuoteComponent, TextFitDirective],
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  title: string = '';
  date: string = '';
  countdown: string = '';
  headerText: string = '';
  detailText: string = '';
  private intervalId: any;
  private readonly isBrowser = isBrowserPlatform();

  showQuote: boolean = false;
  private resizeHandler = () => this.updateShowQuote();


  ngOnInit(): void {
    // Restore from URL params
    if (this.isBrowser) {
      const params = getUrlParams();
      this.title = params.title;
      this.date = params.date;
    }

    this.resetCountdown();

    if (this.title && this.date) {
      this.startCountdown();
    }

    // Determine whether to show quote
    this.updateShowQuote();
    if (this.isBrowser) {
      addResizeListener(this.resizeHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.isBrowser) {
      removeResizeListener(this.resizeHandler);
    }
  }

  private updateShowQuote(): void {
    this.showQuote = shouldShowQuote();
  }

  private resetCountdown(): void {
    this.countdown = '';
    this.headerText = '';
    this.detailText = '';
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startCountdown(): void {
    if (this.intervalId) clearInterval(this.intervalId);

    // If title is cleared, reset the countdown
    if (!isValidTitle(this.title)) {
      this.headerText = '';
      this.detailText = '';
      updateUrlParams(this.title, this.date);
      return;
    }

    updateUrlParams(this.title, this.date);

    this.intervalId = setInterval(() => {
      if (!this.date) {
        this.resetCountdown();
        return;
      }

      const result = calculateCountdown(this.date);

      if (result.isExpired || result.isInThePast) {
        this.headerText = result.isExpired
          ? `${this.title} has arrived! 🎉`
          : `${this.title} is in the past! 😅`;
        this.detailText = '';
        clearInterval(this.intervalId);
        return;
      }

      this.headerText = `Time to ${this.title}`;
      this.detailText = `${result.days} days, ${result.hours}h, ${result.minutes}m, ${result.seconds}s`;
    }, 1000);
  }
}
