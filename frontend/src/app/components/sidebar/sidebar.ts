import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar';
import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import SidebarCard from '../../model/SidebarCard';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SearchbarComponent, DragDropModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() sidebarCards!: SidebarCard[];
  @Output() onSidebarCardDragEnded = new EventEmitter<CdkDragEnd<SidebarCard>>();
  @Output() onSidebarCardMoved = new EventEmitter<CdkDragMove<SidebarCard>>();
  @Output() onDoubleClickSidebarCard = new EventEmitter<SidebarCard>();

  protected activeSidebarCardsFilter: string | null = null;

  protected onSearchTermUpdate(newTerm: string | null) {
    this.activeSidebarCardsFilter = newTerm;
  }

  protected onSearchbarChange(event: Event) {
    this.activeSidebarCardsFilter = (event.target as HTMLInputElement).value;
  }

  protected onlyShowActiveSidebarCards(): SidebarCard[] {
    if (this.activeSidebarCardsFilter === null || this.activeSidebarCardsFilter == '')
      return this.sidebarCards;

    const filter = this.activeSidebarCardsFilter;

    return this.sidebarCards.filter((card) =>
      card.card.word.toLowerCase().includes(filter.toLowerCase())
    );
  }
}
