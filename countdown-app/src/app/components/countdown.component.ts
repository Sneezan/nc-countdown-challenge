import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteComponent } from './QuoteOfTheDay/quote.component';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [CommonModule, FormsModule, QuoteComponent],
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

  ngOnInit(): void {
    this.title = '';
    this.date = '';
    this.countdown = '';
    this.headerText = '';
    this.detailText = '';
    if (this.intervalId) clearInterval(this.intervalId);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  startCountdown(): void {
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (!this.date) {
        this.countdown = '';
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
