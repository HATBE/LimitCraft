import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import PlaygroundCard from '../../../model/PlaygroundCard';
import CardService from '../../../service/card.service';

@Component({
  selector: 'app-playground-card',
  imports: [CommonModule, DragDropModule],
  templateUrl: './playground-card.html',
  styleUrl: './playground-card.css',
})
export class PlaygroundCardComponent {
  @Input() card!: PlaygroundCard;
  @Output() onPlaygroundCardDragEnded = new EventEmitter<{ event: CdkDragEnd; id: string }>();
  @Output() onPlaygroundCardDragStarted = new EventEmitter<string>();

  @ViewChild('dragElRef', { read: ElementRef, static: true })
  private dragEl!: ElementRef<HTMLElement>;

  public constructor(private cardService: CardService) {}

  public getDragEl(): ElementRef<HTMLElement> {
    return this.dragEl;
  }

  protected onDoubleClickPlaygroundCard(card: PlaygroundCard): void {
    this.cardService.createPlaygroundCard(
      card.card.id,
      card.card.icon,
      card.card.word,
      card.x + 20,
      card.y + 20,
      false
    );
  }

  protected onPlaygroundCardDelete(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const card = target.closest('.item') as HTMLDivElement | null;
    const id = card?.dataset['id'];
    if (!id) return;
    if (this.cardService.findPlaygroundCardById(id)?.isLoading) return;
    this.cardService.deletePlaygroundCardById(id);
  }
}
