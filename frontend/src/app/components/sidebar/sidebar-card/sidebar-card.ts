import { CdkDragEnd, CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import SidebarCard from '../../../model/SidebarCard';
import CardService from '../../../service/card.service';

@Component({
  selector: 'app-sidebar-card',
  imports: [CommonModule, DragDropModule],
  templateUrl: './sidebar-card.html',
  styleUrl: './sidebar-card.css',
})
export class SidebarCardComponent {
  @Input() card!: SidebarCard;

  @Output() onSidebarCardDragEnded = new EventEmitter<CdkDragEnd<SidebarCard>>();
  @Output() onDoubleClickSidebarCard = new EventEmitter<SidebarCard>();

  public constructor(private cardService: CardService) {}

  protected onSidebarCardMoved(event: CdkDragMove<SidebarCard>) {
    this.cardService.updateSidebarCardPosition(
      event.source.data.localId,
      event.pointerPosition.x,
      event.pointerPosition.y
    );
  }
}
