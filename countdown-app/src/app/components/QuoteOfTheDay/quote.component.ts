import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
})
export class QuoteComponent implements OnInit {
  quote: string | null = null;
  loading = true;
  private minLoadingTime = 1000; // Minimum 1 second loading time

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchQuote();
  }

  fetchQuote(): void {
    this.loading = true;
    this.quote = null;

    const startTime = Date.now();

    this.http.get<{ quote: string }>('https://dummyjson.com/quotes/random').subscribe({
      next: (data) => {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsed);

        setTimeout(() => {
          this.quote = data.quote;
          this.loading = false;
        }, remainingTime);
      },
      error: (err) => {
        console.error('Error fetching quote', err);
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, this.minLoadingTime - elapsed);

        setTimeout(() => {
          this.quote = 'Failed to load quote. Please refresh.';
          this.loading = false;
        }, remainingTime);
      },
    });
  }
}
