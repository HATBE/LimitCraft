import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchbarComponent } from './searchbar/searchbar';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import SidebarCard from '../../model/SidebarCard';
import CardService from '../../service/card.service';
import { SidebarCardComponent } from './sidebar-card/sidebar-card';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, SearchbarComponent, SidebarCardComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {
  @Output() onSidebarCardDragEnded = new EventEmitter<CdkDragEnd<SidebarCard>>();
  @Output() onDoubleClickSidebarCard = new EventEmitter<SidebarCard>();

  private activeSidebarCardsFilter: string | null = null;

  public constructor(private cardService: CardService) {}

  public async ngOnInit(): Promise<void> {
    await this.cardService.initSidebarCards();
  }

  protected getSidebarCards(): SidebarCard[] {
    return this.cardService.getSidebarCards();
  }

  protected onSearchTermUpdate(newTerm: string | null): void {
    this.activeSidebarCardsFilter = newTerm;
  }

  protected getActiveSidebarCards(): SidebarCard[] {
    const sidebarCards = this.cardService.getSidebarCards();

    const searchTerm = this.activeSidebarCardsFilter?.trim().toLowerCase();
    if (!searchTerm) return sidebarCards;

    return sidebarCards.filter((card) => {
      return card.card.word.toLowerCase().includes(searchTerm);
    });
  }
}
