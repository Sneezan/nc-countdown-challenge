import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css'],
})
export class QuoteComponent implements OnInit {
  quote: string | null = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchQuote();
  }

  fetchQuote(): void {
    this.loading = true;
    this.http.get<{ quote: string }>('https://dummyjson.com/quotes/random').subscribe({
      next: (data) => {
        this.quote = data.quote;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching quote', err);
        this.quote = 'Failed to load quote. Please refresh.';
        this.loading = false;
      },
    });
  }
}
