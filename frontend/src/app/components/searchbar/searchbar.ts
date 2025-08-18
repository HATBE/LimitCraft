import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class SearchbarComponent {
  @Output() onSearchTermUpdate = new EventEmitter<string | null>();
  @Input() cardCount = 0;

  protected searchTerm: string | null = null;

  protected onSearchbarInput(event: Event) {
    this.onSearchTermUpdate.emit(this.searchTerm);
  }

  protected onClearSearchbar() {
    this.searchTerm = null;
    this.onSearchTermUpdate.emit(this.searchTerm);
  }
}
