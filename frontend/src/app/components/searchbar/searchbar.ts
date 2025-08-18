import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class Searchbar {
  @Output() onSearchTermUpdate = new EventEmitter<string | null>();
  protected searchTerm: string | null = null;

  protected onSearchbarInput(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.onSearchTermUpdate.emit(this.searchTerm);
  }

  protected onClearSearchbar() {
    this.searchTerm = null;
    this.onSearchTermUpdate.emit(this.searchTerm);
  }
}
