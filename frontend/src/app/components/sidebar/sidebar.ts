import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar';
import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import SidebarCard from '../../model/SidebarCard';
import CardService from '../../service/card.service';
import { SidebarCardComponent } from './sidebar-card/sidebar-card';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SearchbarComponent, SidebarCardComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Output() onSidebarCardDragEnded = new EventEmitter<CdkDragEnd<SidebarCard>>();
  @Output() onDoubleClickSidebarCard = new EventEmitter<SidebarCard>();

  private activeSidebarCardsFilter: string | null = null;

  public constructor(private cardService: CardService) {}

  protected getSidebarCards(): SidebarCard[] {
    return this.cardService.getSidebarCards();
  }

  protected onSearchTermUpdate(newTerm: string | null): void {
    this.activeSidebarCardsFilter = newTerm;
  }

  protected getActiveSidebarCards(): SidebarCard[] {
    const sidebarCards = this.cardService.getSidebarCards();

    if (this.activeSidebarCardsFilter === null || this.activeSidebarCardsFilter == '') {
      return sidebarCards;
    }

    return sidebarCards.filter((card) => {
      card.card.word.toLowerCase().includes(this.activeSidebarCardsFilter!.toLowerCase());
    });
  }
}
