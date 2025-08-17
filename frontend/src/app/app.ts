import { Component, signal } from '@angular/core';
import { IndexPage } from './page/index-page/index-page';

@Component({
  selector: 'app-root',
  imports: [IndexPage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Limit Craft');
}
