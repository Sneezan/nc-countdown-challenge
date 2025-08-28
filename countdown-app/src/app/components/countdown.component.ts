import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteComponent } from './QuoteOfTheDay/quote.component';
import { TextFitDirective } from '../directives/text-fit.directive';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  showQuote: boolean = false;
  private resizeHandler = () => this.updateShowQuote();

  ngOnInit(): void {
    // Restore from URL params (browser only)
    if (this.isBrowser && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const qpTitle = url.searchParams.get('title');
      const qpDate = url.searchParams.get('date');
      this.title = qpTitle ?? '';
      this.date = qpDate ?? '';
    }

    this.countdown = '';
    this.headerText = '';
    this.detailText = '';
    if (this.intervalId) clearInterval(this.intervalId);

    // Start countdown if we have a title and date
    if (this.title && this.date) {
      this.startCountdown();
    }

    // Determine whether to show quote (<= 430px)
    this.updateShowQuote();
    if (this.isBrowser && typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.isBrowser && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private updateShowQuote(): void {
    if (!(this.isBrowser && typeof window !== 'undefined')) {
      this.showQuote = false;
      return;
    }
    this.showQuote = window.matchMedia('(max-width: 430px)').matches;
  }

  private updateUrlParams(): void {
    if (!(this.isBrowser && typeof window !== 'undefined')) return;
    const url = new URL(window.location.href);
    if (this.title) url.searchParams.set('title', this.title);
    else url.searchParams.delete('title');
    if (this.date) url.searchParams.set('date', this.date);
    else url.searchParams.delete('date');
    window.history.replaceState({}, '', url.toString());
  }

  startCountdown(): void {
    if (this.intervalId) clearInterval(this.intervalId);

    // If title is cleared, reset the countdown
    if (!this.title || !this.title.trim()) {
      this.headerText = '';
      this.detailText = '';
      this.updateUrlParams();
      return;
    }

    // Persist to URL (browser only)
    this.updateUrlParams();

    this.intervalId = setInterval(() => {
      if (!this.date) {
        this.countdown = '';
        this.headerText = '';
        this.detailText = '';
        return;
      }

      const eventDate = new Date(this.date).getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance <= 0) {
        this.headerText = `${this.title} has arrived! 🎉`;
        this.detailText = '';
        clearInterval(this.intervalId);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.headerText = `Time to ${this.title}`;
      this.detailText = `${days} days, ${hours} h, ${minutes}m, ${seconds}s`;
    }, 1000);
  }
}
