import { Component, signal } from '@angular/core';

import { CountdownComponent } from './components/countdown.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CountdownComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('countdown');
}
