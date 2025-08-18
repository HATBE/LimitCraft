import { Component, signal } from '@angular/core';
import { IndexPage } from './page/index-page/index-page';
import { HeaderComponent } from './components/header/header';
import { FooterCompoennt } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [IndexPage, HeaderComponent, FooterCompoennt],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Limit Craft');
}
